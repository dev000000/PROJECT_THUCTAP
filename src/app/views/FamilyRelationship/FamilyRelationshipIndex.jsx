import React, { useEffect } from "react";
import MaterialTable from "material-table";
import Pagination from "@material-ui/lab/Pagination";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import ReusableTextField from "../ReusableComponent/ReusableTextField";
const useStyles = makeStyles({
  root: {
    maxWidth: "90%",
    margin: "20px auto",
  },
  field: {
    margin: "20px 0",
    width: "400px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px 0 0 4px",
    },
  },
  button: {
    margin: "20px 0",
    borderRadius: "0 4px 4px 0",
    padding: "6.8px ",
  },
});
export default observer(function FamilyRelationshipIndex() {
  const { familyRelationshipStore } = useStore();
  const { familyRelationshipList, pageSize, totalPages } =
    familyRelationshipStore;
  useEffect(() => {
    familyRelationshipStore.getFamilyRelationshipList();
  }, []);
  const handleChangePageSize = (e) => {
    familyRelationshipStore.setPaging({ pageSize: e.target.value });
  };
  const handleChangePageIndex = (e, value) => {
    familyRelationshipStore.setPaging({ pageIndex: value });
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/* Form Search */}
      <Formik
        initialValues={{ keyword: "" }}
        onSubmit={(values) => {
          familyRelationshipStore.setPaging({
            pageIndex: 1,
            pageSize: 10,
            keyword: values.keyword,
          });
        }}
      >
        <Form autoComplete="off">
          <ReusableTextField
            name="keyword"
            className={classes.field}
            placeholder="Nhập từ khóa....."
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className={classes.button}
            type="submit"
          >
            <SearchIcon />
          </Button>
        </Form>
      </Formik>
      {/* Table */}
      <MaterialTable
        columns={[
          {
            title: "Tên",
            field: "name",
            validate: (rowData) =>
              rowData.name === "" ? "Không được để trống" : "",
          },
          {
            title: "Mã",
            field: "code",
            validate: (rowData) =>
              rowData.code === "" ? "Không được để trống" : "",
          },
          { title: "Mô tả", field: "description" },
        ]}
        data={familyRelationshipList}
        title="Country list"
        editable={{
          onRowAdd: async (newData) => {
            const errors = [];
            if (!newData.name || newData.name.trim() === "") {
              errors.push("Tên không được để trống");
            }
            if (!newData.code || newData.code.trim() === "") {
              errors.push("Mã không được để trống");
            }
            if (errors.length > 0) {
              alert(errors.join("\n"));
              return Promise.reject();
            }
            await familyRelationshipStore.addFamilyRelationshipStore(newData);
            return Promise.resolve();
          },
          onRowUpdate: async (newData) => {
            await familyRelationshipStore.updateFamilyRelationshipStore(
              newData
            );
          },
          onRowDelete: async (oldData) => {
            await familyRelationshipStore.deleteFamilyRelationshipStore(
              oldData
            );
          },
        }}
        localization={{
          header: {
            actions: "Thao tác",
          },
        }}
        options={{
          search: false,
          paging: false,
          showTitle: false,
          headerStyle: {
            backgroundColor: "#01C0C8",
            color: "#fff",
            position: "sticky",
          },
          rowStyle: (rowData, index) => ({
            backgroundColor: index % 2 === 1 ? "rgb(237, 245, 251)" : "#FFF",
          }),
        }}
      />
      {/* Paging */}
      <div className="country__pagination">
        <div className="country__pagination-size">
          <p className="country__pagination-text">Số hàng mỗi trang:</p>
          <NativeSelect
            id="demo-customized-select-native"
            value={pageSize}
            onChange={handleChangePageSize}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </NativeSelect>
        </div>
        <Pagination
          count={totalPages}
          color="primary"
          onChange={handleChangePageIndex}
        />
      </div>
    </div>
  );
});

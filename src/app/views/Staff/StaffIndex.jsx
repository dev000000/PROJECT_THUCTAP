import { useEffect } from "react";
import MaterialTable from "material-table";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DateFnsUtils from "@date-io/date-fns";
import Pagination from "@material-ui/lab/Pagination";
import NativeSelect from "@material-ui/core/NativeSelect";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: "90%",
    margin: "50px auto",
  },
  field: {
    width: "calc(70% - 64px)",
    margin: "20px 0",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px 0 0 4px",
    },
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  buttonSearch: {
    margin: "20px 0",
    borderRadius: "0 4px 4px 0",
    padding: "6.8px ",
  },
  buttonSpecial: {
    position: "absolute",
    right: "0px",
    top: "0px",
    zIndex: "100",
  },
  gridSpecial: {
    position: "relative",
  },
  formSearch: {
    display: "flex",
    justifyContent: "flex-end",
  },
});
export default observer(function StaffIndex() {
  const utils = new DateFnsUtils();
  const history = useHistory();
  const { staffStore } = useStore();
  const { staffList, pageSize, totalPages } = staffStore;
  useEffect(() => {
    staffStore.getStaffList();
  }, []);
  const handleClick = () => {
    console.log("hehe");
    history.push("/category/staff/create");
  };
  const handleChangePageSize = (e) => {
    staffStore.setPaging({ pageSize: e.target.value });
  };
  const handleChangePageIndex = (e, value) => {
    staffStore.setPaging({ pageIndex: value });
  };
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Button */}
          <Grid item xs={6}>
            <div className={classes.buttonGroup}>
              {" "}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleClick}
              >
                <AddIcon fontSize="small" />
                Thêm mới
              </Button>{" "}
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                <InsertDriveFileIcon fontSize="small" />
                Nhập Excel
              </Button>
            </div>
          </Grid>
          {/* Form search */}
          <Grid item xs={6}>
            <Formik
              initialValues={{ keyword: "" }}
              onSubmit={(values) => {
                staffStore.setPaging({
                  pageIndex: 1,
                  pageSize: 10,
                  keyword: values.keyword,
                });
              }}
            >
              <Form autoComplete="off" className={classes.formSearch}>
                <Field
                  name="keyword"
                  as={TextField}
                  variant="outlined"
                  className={classes.field}
                  placeholder="Nhập từ khóa....."
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.buttonSearch}
                  type="submit"
                >
                  <SearchIcon />
                </Button>
              </Form>
            </Formik>
          </Grid>
          <Grid item xs={12}>
            {/* Table */}
            <MaterialTable
              data={staffList}
              columns={[
                { title: "Họ và Tên", field: "displayName", align: "center" },
                {
                  title: "Ngày sinh",
                  field: "birthDate",
                  type: "date",
                  render: (row) =>
                    `${utils.format(new Date(row.birthDate), "dd/MM/yyyy")}`,
                },
                { title: "Email", field: "email" },
                { title: "Số điện thoại", field: "phoneNumber" },
                {
                  title: "idNumber",
                  field: "idNumber",
                  align: "center",
                },
              ]}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Edit or View Detail",
                  onClick: (event, rowData) => {
                    history.push(`/category/staff/update/${rowData.id}`);     
                  },
                },
              ]}
              editable={{
                onRowDelete: async (oldData) => {
                  await staffStore.deleteStaffStore(oldData);
                },
              }}
              localization={{
                header: {
                  actions: "Thao tác",
                },
              }}
              options={{
                paging: false,
                selection: false,
                search: false,
                showTitle: false,
                headerStyle: {
                  backgroundColor: "#01C0C8",
                  color: "#fff",
                  position: "sticky",
                },
                rowStyle: (rowData, index) => ({
                  backgroundColor:
                    index % 2 === 1 ? "rgb(237, 245, 251)" : "#FFF",
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
          </Grid>
        </Grid>
      </div>
    </>
  );
});

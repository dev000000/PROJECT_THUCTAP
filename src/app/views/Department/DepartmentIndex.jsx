import { useEffect, useRef, useState } from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import { Radio } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import NativeSelect from "@material-ui/core/NativeSelect";
import ReusableTextField from "../ReusableComponent/ReusableTextField";
import ReusableDatePicker from "../ReusableComponent/ReusableDateTimePicker";
import * as Yup from "yup";

const validationSchema = Yup.object({
  code: Yup.string().required("Không được để trống"),
  name: Yup.string().required("Không được để trống"),
  func: Yup.string().required("Không được để trống"),
  industryBlock: Yup.string().required("Không được để trống"),
  foundedNumber: Yup.string().required("Không được để trống"),
  foundedDate: Yup.date().required("Không được để trống"),
  displayOrder: Yup.string().required("Không được để trống"),
});
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
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#01C0C8",
    color: "#fff",
    position: "sticky",
    "& .MuiTypography-root": {
      color: "#fff",
      fontSize: "16px",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogTitle: {
    color: "#fff",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.dialogTitle}>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: "600px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
export default observer(function DepartmentIndex() {
  const formikRef = useRef();
  const [selectedRow, setSelectedRow] = useState({});
  const { departmentStore } = useStore();
  const { departmentList, pageSize, totalPages } = departmentStore;
  const utils = new DateFnsUtils();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogParent, setOpenDialogParent] = useState(false);

  useEffect(() => {
    departmentStore.getDepartmentList();
  }, []);
  const handleOpenDialogAdd = () => {
    setOpenDialogAdd(true);
  };
  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };
  const handleOpenDialogParent = () => {
    setOpenDialogParent(true);
  };
  const handleCloseDialogParent = () => {
    setOpenDialogParent(false);
  };
  const handleChooseDialogParent = () => {
    formikRef.current.setFieldValue("parent", selectedRow);
    setOpenDialogParent(false);
  };
  const handleChangePageSize = (e) => {
    departmentStore.setPaging({ pageSize: e.target.value });
  };
  const handleChangePageIndex = (e, value) => {
    departmentStore.setPaging({ pageIndex: value });
  };
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        {/* Dialog Lua Chon Phong Ban  */}
        <Dialog onClose={handleCloseDialogParent} open={openDialogParent}>
          <DialogTitle onClose={handleCloseDialogParent}>
            Lựa chọn phòng ban
          </DialogTitle>
          <DialogContent dividers>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12}>
                <Formik
                  initialValues={{ keyword: "" }}
                  onSubmit={(values) => {
                    departmentStore.setPaging({
                      pageIndex: 1,
                      pageSize: 10,
                      keyword: values.keyword,
                    });
                  }}
                >
                  <Form autoComplete="off" className={classes.formSearch}>
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
                      className={classes.buttonSearch}
                      type="submit"
                    >
                      <SearchIcon />
                    </Button>
                  </Form>
                </Formik>
              </Grid>
              <Grid item xs={12}>
                <MaterialTable
                  data={departmentList}
                  columns={[
                    { title: "Mã", field: "code", align: "center" },
                    { title: "Tên phòng ban", field: "name" },
                    { title: "Mô tả", field: "description" },
                  ]}
                  actions={[
                    {
                      icon: "select",
                      tooltip: "Select Row",
                      onClick: (event, rowData) => {
                        setSelectedRow(rowData);
                      },
                    },
                  ]}
                  components={{
                    Action: (props) => (
                      <Radio
                        checked={
                          selectedRow?.tableData?.id === props.data.tableData.id
                        }
                        onChange={(event) =>
                          props.action.onClick(event, props.data)
                        }
                        color="primary"
                      />
                    ),
                  }}
                  parentChildData={(row, rows) =>
                    rows.find((a) => a.id === row.parentId)
                  }
                  localization={{
                    header: {
                      actions: "Chọn",
                    },
                  }}
                  options={{
                    paging: false,
                    search: false,
                    showTitle: false,
                    headerStyle: {
                      backgroundColor: "#2A80C8",
                      color: "#fff",
                      position: "sticky",
                    },

                    rowStyle: (rowData, index) => ({
                      backgroundColor:
                        index % 2 === 1 ? "rgb(237, 245, 251)" : "#FFF",
                    }),
                  }}
                />
                <div className="country__pagination">
                  <div className="country__pagination-size">
                    <p className="country__pagination-text">
                      Số hàng mỗi trang:
                    </p>
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
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleCloseDialogParent}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleChooseDialogParent}
            >
              Lựa chọn
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog Them Phong Ban */}
        <Dialog onClose={handleCloseDialogAdd} open={openDialogAdd}>
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleCloseDialogAdd}
          >
            Thêm mới phòng ban
          </DialogTitle>
          <Formik
            innerRef={formikRef}
            initialValues={{
              parent: {},
              code: "",
              name: "",
              description: "",
              func: "",
              industryBlock: "",
              foundedNumber: "",
              foundedDate: "",
              displayOrder: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              departmentStore.addDepartment(values);
            }}
          >
            {({ values }) => {
              return (
                <Form autoComplete="off">
                  <DialogContent dividers>
                    <Grid container spacing={2}>
                      <Grid item xs={12} className={classes.gridSpecial}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.buttonSpecial}
                          onClick={handleOpenDialogParent}
                        >
                          Lựa chọn
                        </Button>
                        <ReusableTextField
                          name="parent"
                          label="Đơn vị trực thuộc"
                          value={values.parent?.code || ""}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField name="code" label="Mã" />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField name="name" label="Tên phòng ban" />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField
                          name="description"
                          label="Mô tả"
                          multiline
                          maxRows={4}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField name="func" label="Chức năng" />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField
                          name="industryBlock"
                          label="industryBlock"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField
                          name="foundedNumber"
                          label="foundedNumber"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <ReusableDatePicker
                          name="foundedDate"
                          label="foundedDate"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <ReusableTextField
                          name="displayOrder"
                          label="displayOrder"
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      type="submit"
                      // onClick={handleCloseDialogAdd}
                    >
                      Lưu lại
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={handleCloseDialogAdd}
                    >
                      Thoát
                    </Button>
                  </DialogActions>
                </Form>
              );
            }}
          </Formik>
        </Dialog>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Button */}
          <Grid item xs={6}>
            <div className={classes.buttonGroup}>
              {" "}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleOpenDialogAdd}
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
          {/* Form Search */}
          <Grid item xs={6}>
            <Formik
              initialValues={{ keyword: "" }}
              onSubmit={(values) => {
                departmentStore.setPaging({
                  pageIndex: 1,
                  pageSize: 10,
                  keyword: values.keyword,
                });
              }}
            >
              <Form autoComplete="off" className={classes.formSearch}>
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
              data={departmentList}
              columns={[
                { title: "Mã", field: "code", align: "center" },
                { title: "Tên phòng ban", field: "name" },
                { title: "Mô tả", field: "description" },
                { title: "Chức năng", field: "func" },
                {
                  title: "industryBlock",
                  field: "industryBlock",
                  align: "center",
                },
                { title: "foundedNumber", field: "foundedNumber" },
                {
                  title: "foundedDate",
                  field: "foundedDate",
                  type: "date",
                  render: (row) =>
                    `${utils.format(new Date(row.foundedDate), "dd/MM/yyyy")}`,
                },
                {
                  title: "displayOrder",
                  field: "displayOrder",
                  align: "center",
                },
              ]}
              parentChildData={(row, rows) =>
                rows.find((a) => a.id === row.parentId)
              }
              editable={{
                onRowUpdate: async (newData, oldData) => {
                  await departmentStore.updateDeparmentStore(newData);
                },
                onRowDelete: async (oldData) => {
                  await departmentStore.deleteDepartmentStore(oldData);
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

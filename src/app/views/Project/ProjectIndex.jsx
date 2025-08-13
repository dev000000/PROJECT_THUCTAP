import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, FieldArray } from "formik";
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
import Pagination from "@material-ui/lab/Pagination";
import NativeSelect from "@material-ui/core/NativeSelect";
import DeleteIcon from "@material-ui/icons/Delete";
import red from "@material-ui/core/colors/red";
import * as Yup from "yup";
import ReusableTextField from "../ReusableComponent/ReusableTextField";
import ReusableAutocomplete from "../ReusableComponent/ReusableAutocomplete";

const validationSchema = Yup.object({
  code: Yup.string().required("Không được để trống"),
  name: Yup.string().required("Không được để trống"),
  projectStaff: Yup.array()
    .of(
      Yup.object()
        .nullable()
        .typeError("Không được để trống")
        .required("Không được để trống")
    )
    .min(1, "Phải có ít nhất 1 nhân viên cho dự án")
    .required("Không được để trống"),
});
const useStyles = makeStyles({
  root: {
    padding: "20px",
    backgroundColor: "#fff",
  },
  typography: {
    margin: "10px 0",
  },
  button1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    margin: "20px 0",
  },
  buttonSearch: {
    borderRadius: "0 4px 4px 0",
    padding: "6.8px ",
  },
  formSearch: {
    display: "flex",
    justifyContent: "flex-end",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  buttonSubmit: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[500],
    },
  },
  field: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "0",
    },
    "& .MuiFormControl-marginNormal": {
      margin: "0",
    },
  },
  gridSpecial: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ddd",
  },
  buttonDelete: {
    color: red[500],
  },
  header: {
    padding: "16px 14px",
    height: 50,
    border: "1px solid #ddd",
  },
  error: {
    color: red[500],
    margin: "10px 0",
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
        <IconButton className={classes.closeButton} onClick={onClose}>
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

export default observer(function ProjectIndex() {
  const { projectStore, staffStore } = useStore();
  const { projectList, pageSize, totalPages } = projectStore;
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          projectStore.getProjectList(),
          staffStore.getAllStaffStore(),
        ]);
      } catch (error) {
        console.log("error loading project list or staff list");
      }
    };
    loadAll();
  }, []);
  const handleOpenDialogForAdd = () => {
    setIsUpdating(false);
    setEditingProject(null);
    setOpenDialog(true);
  };
  const handleCloseDialogForAdd = () => {
    setOpenDialog(false);
  };
  const handleChangePageSize = (e) => {
    projectStore.setPaging({ pageSize: e.target.value });
  };
  const handleChangePageIndex = (e, value) => {
    projectStore.setPaging({ pageIndex: value });
  };
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        {/* Dialog handle Add or Edit */}
        <Dialog onClose={handleCloseDialogForAdd} open={openDialog}>
          <DialogTitle onClose={handleCloseDialogForAdd}>
            {isUpdating ? "Sửa đổi dự án" : "Thêm mới dự án"}
          </DialogTitle>
          <Formik
            enableReinitialize
            initialValues={
              isUpdating && editingProject
                ? {
                    code: editingProject.code || "",
                    name: editingProject.name || "",
                    description: editingProject.description || "",
                    projectStaff: editingProject.projectStaff || [],
                  }
                : {
                    code: "",
                    name: "",
                    description: "",
                    projectStaff: [],
                  }
            }
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (isUpdating) {
                projectStore.updateProjectStore({
                  ...editingProject,
                  ...values,
                });
              } else {
                projectStore.addProjectStore(values);
              }
            }}
          >
            {({ values, handleChange, setFieldValue, isSubmitting }) => {
              return (
                <Form autoComplete="off">
                  <DialogContent dividers>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <ReusableTextField name="name" label="Tên" />
                      </Grid>
                      <Grid item xs={12}>
                        <ReusableTextField name="code" label="Mã" />
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
                        <FieldArray name="projectStaff">
                          {({ insert, remove, push, form }) => {
                            const { values, errors, touched } = form;
                            return (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                  onClick={() =>
                                    push(null)
                                  }
                                >
                                  <AddIcon fontSize="small" />
                                  Thêm mới nhân viên
                                </Button>{" "}
                                <Grid container>
                                  {["Nhân viên", ""].map((item, index) => (
                                    <Grid item xs key={index}>
                                      <div className={classes.header}>
                                        {item}
                                      </div>
                                    </Grid>
                                  ))}
                                </Grid>
                                {values.projectStaff.length > 0 &&
                                  values.projectStaff.map((staff, index) => {
                                    const selectedIds = values.projectStaff
                                      .filter((_, i) => i !== index)
                                      .map((s) => s?.id);

                                    const availableOptions =
                                      staffStore.staffOptionList.filter(
                                        (option) =>
                                          !selectedIds.includes(option.id)
                                      );

                                    return (
                                      <Grid container key={index}>
                                        <Grid item xs>
                                          <ReusableAutocomplete
                                            className={classes.field}
                                            options={availableOptions}
                                            displayData="displayName"
                                            name={`projectStaff.${index}`}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs
                                          className={classes.gridSpecial}
                                        >
                                          <IconButton
                                            className={classes.buttonDelete}
                                            onClick={() => remove(index)}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    );
                                  })}
                                {values.projectStaff.length == 0 &&
                                  errors.projectStaff !== "" &&
                                  touched.projectStaff && (
                                    <div className={classes.error}>
                                      {errors.projectStaff}
                                    </div>
                                  )}
                              </>
                            );
                          }}
                        </FieldArray>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      type="submit"
                      // onClick={handleCloseDialogForAdd}
                    >
                      Lưu lại
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={handleCloseDialogForAdd}
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
                onClick={handleOpenDialogForAdd}
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
                projectStore.setPaging({
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
              data={projectList}
              columns={[
                { title: "Mã", field: "code", align: "center" },
                { title: "Tên dự án", field: "name" },
                { title: "Mô tả", field: "description" },
              ]}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Edit",
                  onClick: (event, rowData) => {
                    setIsUpdating(true);
                    setEditingProject(rowData);
                    setOpenDialog(true);
                  },
                },
              ]}
              editable={{
                onRowDelete: async (oldData) => {
                  await projectStore.deleteProjectStore(oldData);
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

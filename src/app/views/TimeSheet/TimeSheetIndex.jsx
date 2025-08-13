import { useCallback, useEffect } from "react";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import debounce from "lodash.debounce";
import ReusableTextField from "../ReusableComponent/ReusableTextField";

const useStyles = makeStyles({
  root: {
    maxWidth: "95%",
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
  formSearch: {
    display: "flex",
    justifyContent: "flex-end",
  },
  workingItemTitle: {
    fontWeight: "700",
  },
  datetime: {
    color: "red",
  },
  priority2: {
    color: "white",
    backgroundColor: "green",
    padding: "3px 5px",
    borderRadius: "2px",
  },
  priority3: {
    color: "black",
    backgroundColor: "yellow",
    padding: "3px 5px",
    borderRadius: "2px",
  },
  priority4: {
    color: "white",
    backgroundColor: "red",
    padding: "3px 5px",
    borderRadius: "2px",
  },
  tabProject: {
    backgroundColor: "white",
    marginTop: "77px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
  },
  tabProjectHeader: {
    backgroundColor: "#01C0C8",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
  },
  tabProjectBody: {
    padding: "0px 10px",
  },

  itemSelect: {
    color: "#FB9678",
    padding: "10px 20px",
    textAlign: "center",
    cursor: "pointer",
  },
  itemSelectActive: {
    backgroundColor: "#FB9678",
    color: "#FFF",
  },
  listScroll: {
    maxHeight: "428px",
    overflowX: "auto",
  },
});

export default observer(function TimeSheetIndex() {
  const dateFns = new DateFnsUtils();
  const history = useHistory();
  const { timeSheetStore, projectStore } = useStore();
  const { timeSheetList, pageSize, totalPages } = timeSheetStore;
  useEffect(() => {
    timeSheetStore.getTimeSheetList();
    projectStore.searchProjectsForTimeSheet();
  }, []);
  const handleSearchTimeSheetByProject = (projectId) => {
    timeSheetStore.setPaging({ projectId: projectId });
  };
  const handleClick = () => {
    history.push("/category/timesheet/create");
  };
  const handleChangePageSize = (e) => {
    timeSheetStore.setPaging({ pageSize: e.target.value });
  };
  const handleChangePageIndex = (e, value) => {
    timeSheetStore.setPaging({ pageIndex: value });
  };
  const classes = useStyles();
  const priorityDisplay = [
    {
      value: 1,
      label: "Thấp",
      display: <div>Thấp</div>,
    },
    {
      value: 2,
      label: "Trung bình",
      display: <span className={classes.priority2}>Trung bình</span>,
    },
    {
      value: 3,
      label: "Cao",
      display: <span className={classes.priority3}>Cao</span>,
    },
    {
      value: 4,
      label: "Cấp bách",
      display: <span className={classes.priority4}>Cấp bách</span>,
    },
  ];
  const handleSearch = useCallback(
    debounce((keyword) => {
      projectStore.searchProjectsForTimeSheet(keyword);
    }, 500),
    [] // chỉ tạo một lần
  );
  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <div className={classes.tabProject}>
              <div className={classes.tabProjectHeader}> Danh sách dự án:</div>
              <div className={classes.tabProjectBody}>
                <div
                  className={
                    timeSheetStore.projectIdSelectSearch == ""
                      ? `${classes.itemSelect} ${classes.itemSelectActive}`
                      : classes.itemSelect
                  }
                  onClick={() => handleSearchTimeSheetByProject("")}
                >
                  {" "}
                  Tất cả{" "}
                </div>
                <Formik initialValues={{ keyword: "" }}>
                  {({ values, setFieldValue }) => (
                    <Form autoComplete="off">
                      <ReusableTextField
                        name="keyword"
                        variant="standard"
                        placeholder="Nhập từ khóa....."
                        size="small"
                        onChange={(e) => {
                          setFieldValue("keyword", e.target.value);
                          handleSearch(e.target.value);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Form>
                  )}
                </Formik>
                <div className={classes.listScroll}>
                  {projectStore.projectSearchForTimeSheetList.map((project) => (
                    <div
                      key={project.id}
                      className={
                        project.id === timeSheetStore.projectIdSelectSearch
                          ? `${classes.itemSelect} ${classes.itemSelectActive}`
                          : classes.itemSelect
                      }
                      onClick={() => handleSearchTimeSheetByProject(project.id)}
                    >
                      {project.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={6}>
                <div className={classes.buttonGroup}>
                  {" "}
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    // onClick={handleOpenDialogAdd}
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
              <Grid item xs={6}>
                <Formik
                  initialValues={{ keyword: "" }}
                  onSubmit={(values) => {
                    timeSheetStore.setPaging({
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
                  data={timeSheetList}
                  columns={[
                    {
                      title: "Công việc",
                      render: (row) => {
                        if (!row.details || row.details.length === 0) {
                          return <div>Không có dữ liệu ....</div>;
                        }

                        const text = row.details
                          .map((detail) => detail.workingItemTitle)
                          .join(", ");

                        return (
                          <div className={classes.workingItemTitle}>{text}</div>
                        );
                      },
                    },
                    {
                      title: "Thời gian",
                      render: (row) => {
                        const start = new Date(row.startTime);
                        const end = new Date(row.endTime);
                        const formatDateTime = (date) =>
                          dateFns.format(date, "HH:mm dd/MM/yyyy");
                        return (
                          <div>
                            <div>
                              <strong>Thời gian bắt đầu:</strong>{" "}
                              <span className={classes.datetime}>
                                {formatDateTime(start)}
                              </span>
                            </div>
                            <div>
                              <strong>Thời gian kết thúc:</strong>{" "}
                              <span className={classes.datetime}>
                                {formatDateTime(end)}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      title: "Mức độ ưu tiên",
                      field: "priority",
                      align: "center",
                      render: (row) => {
                        const item = priorityDisplay.find(
                          (p) => p.value === row.priority
                        );
                        return item ? item.display : null;
                      },
                    },
                    {
                      title: "Người thực hiện",
                      render: (row) => {
                        if (!row.details || row.details.length === 0) {
                          return <div>Không có dữ liệu ....</div>;
                        }

                        // Lọc trùng theo employee.id
                        const uniqueDetails = row.details.filter(
                          (detail, index, self) =>
                            index ===
                            self.findIndex(
                              (d) => d.employee.id === detail.employee.id
                            )
                        );

                        return (
                          <ul>
                            {uniqueDetails.map((detail) => (
                              <li key={`${row.id}-${detail.employee.id}`}>
                                {detail.employee.displayName}
                              </li>
                            ))}
                          </ul>
                        );
                      },
                    },
                    {
                      title: "Mô tả",
                      field: "description",
                    },
                  ]}
                  actions={[
                    {
                      icon: "edit",
                      tooltip: "Edit or View Detail",
                      onClick: (event, rowData) => {
                        history.push(
                          `/category/timesheet/update/${rowData.id}`
                        );
                      },
                    },
                  ]}
                  editable={{
                    onRowDelete: async (oldData) => {
                      await timeSheetStore.deleteTimeSheetStore(oldData);
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
                    toolbar: false,
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
          </Grid>
        </Grid>
      </div>
    </>
  );
});

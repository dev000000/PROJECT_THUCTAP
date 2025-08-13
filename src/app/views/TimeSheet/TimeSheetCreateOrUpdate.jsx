import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { useHistory, useParams } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import red from "@material-ui/core/colors/red";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { formatDateForInput, formatTimeForInput, toUtcISOString } from "utils";
import ReusableAutocomplete from "../ReusableComponent/ReusableAutocomplete";
import ReusableDateTimePicker from "../ReusableComponent/ReusableDateTimePicker";
import ReusableTextField from "../ReusableComponent/ReusableTextField";
import * as Yup from "yup";

const useStyles = makeStyles({
  root: {
    padding: "20px",
    backgroundColor: "#fff",
  },
  typography: {
    margin: "10px 0",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
  },
  header: {
    padding: "16px 14px",
    height: 50,
    border: "1px solid #ddd",
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
  error: {
    color: red[500],
    margin: "10px 0",
  },
});
const priority = [
  {
    value: 1,
    label: "Thấp",
  },
  {
    value: 2,
    label: "Trung bình",
  },
  {
    value: 3,
    label: "Cao",
  },
  {
    value: 4,
    label: "Cấp bách",
  },
];
const initialValuesTimeSheet = {
  project: null,
  timeSheetStaff: [],
  workingDate: "",
  startTime: "",
  endTime: "",
  priority: 1,
  description: "",
  details: [
    {
      workingItemTitle: "",
      employee: null,
    },
  ],
};
const validationSchema = Yup.object({
  project: Yup.object().typeError("Không được để trống"),
  timeSheetStaff: Yup.array()
    .of(Yup.object().nullable().required("Không được để trống"))
    .min(1, "Phải chọn ít nhất 1 nhân viên thực hiện TimeSheet")
    .required("Không được để trống"),
  workingDate: Yup.string().required("Không được để trống"),
  startTime: Yup.string().required("Không được để trống"),
  endTime: Yup.string().required("Không được để trống"),
  details: Yup.array()
    .of(
      Yup.object({
        workingItemTitle: Yup.string().required("Không được để trống"),
        employee: Yup.object()
          .nullable()
          .required("Không được để trống")
          .typeError("Không được để trống"),
      })
    )
    .min(1, "Phải có ít nhất 1 chi tiết")
    .required("Không được để trống"),
});


export default observer(function TimeSheetCreateOrUpdate() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(initialValuesTimeSheet);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(!!id);
  const { timeSheetStore, projectStore } = useStore();
  useEffect(() => {
    const loadAll = async () => {
      try {
        let arrayPromise = [
          projectStore.getProjectOptionList(),
          ...(id ? [timeSheetStore.getSelectedTimeSheet(id)] : []),
        ];
        await Promise.all(arrayPromise);
        if (id && Object.keys(timeSheetStore.timeSheetSelect).length === 0) {
          history.goBack();
        } else if (id) {
          setInitialValues({
            ...initialValuesTimeSheet,
            ...timeSheetStore.timeSheetSelect,
            workingDate: formatDateForInput(
              timeSheetStore.timeSheetSelect.workingDate
            ),
            startTime: formatTimeForInput(
              timeSheetStore.timeSheetSelect.startTime
            ),
            endTime: formatTimeForInput(timeSheetStore.timeSheetSelect.endTime),
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Hien thi loading khi chua co du lieu
  if (
    loading 
  ) {
    return <div>Đang tải...</div>;
  }
  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      startTime: toUtcISOString(values.startTime),
      endTime: toUtcISOString(values.endTime),
    };
    // console.log(payload);
    try {
      if (isUpdate) {
        await timeSheetStore.updateTimeSheetStore(payload);
      } else {
        await timeSheetStore.addTimeSheetStore(payload);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
      history.push("/category/timesheet");
    }
  };
  const handleOptionDetail = (options) => {
    let newOptions = removeNulls(options);
    return newOptions;
  };
  const removeNulls = (arr) => {
    return arr.filter((item) => item !== null);
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIosIcon />}
        onClick={() => history.goBack()}
      >
        Quay lại
      </Button>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => {
          return (
            <Form>
              {/* section Thong Tin Co Ban*/}
              <Typography variant="h5" className={classes.typography}>
                1.Thông tin cơ bản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReusableAutocomplete
                    name="project"
                    options={projectStore.projectOptionList}
                    onChange={(event, newValue) => {
                      setFieldValue("project", newValue);
                      setFieldValue("timeSheetStaff", [null]);
                      setFieldValue("details", [
                        {
                          workingItemTitle: "",
                          employee: null,
                        },
                      ]);
                    }}
                    label="Dự án"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FieldArray name="timeSheetStaff">
                    {({ insert, remove, push, form }) => {
                      const { values, errors, touched } = form;
                      return (
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => push(null)}
                          >
                            <AddIcon fontSize="small" />
                            Thêm mới nhân viên
                          </Button>{" "}
                          {/* Header */}
                          <Grid container>
                            {["Nhân viên thực hiện", ""].map((item, index) => (
                              <Grid item xs key={index}>
                                <div className={classes.header}>{item}</div>
                              </Grid>
                            ))}
                          </Grid>
                          {/* Body */}
                          <Grid container>
                            {values.timeSheetStaff.length > 0 &&
                              values.timeSheetStaff.map((detail, index) => {
                                const selectedStaffIds = values.timeSheetStaff
                                  .filter(
                                    (staff, i) => staff !== null && i !== index
                                  ) // bỏ qua chính dòng hiện tại
                                  .map((staff) => staff?.id);

                                const availableStaff = (
                                  values.project?.projectStaff || []
                                ).filter(
                                  (staff) =>
                                    !selectedStaffIds.includes(staff?.id)
                                );
                                return (
                                  <Grid container key={index}>
                                    <Grid item xs>
                                      <ReusableAutocomplete
                                        name={`timeSheetStaff.${index}`}
                                        className={classes.field}
                                        options={availableStaff}
                                        displayData="displayName"
                                        onChange={(event, newValue) =>
                                          setFieldValue(
                                            `timeSheetStaff.${index}`,
                                            newValue
                                          )
                                        }
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs
                                      className={classes.gridSpecial}
                                    >
                                      <IconButton
                                        aria-label="delete"
                                        className={classes.buttonDelete}
                                        onClick={() => remove(index)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                );
                              })}
                          </Grid>
                          {values.timeSheetStaff.length == 0 &&
                            errors.timeSheetStaff !== "" &&
                            touched.timeSheetStaff && (
                              <div className={classes.error}>
                                {errors.timeSheetStaff}
                              </div>
                            )}
                        </div>
                      );
                    }}
                  </FieldArray>
                </Grid>
                <Grid item xs={3}>
                  <ReusableDateTimePicker
                    name="workingDate"
                    label="Ngày làm việc"
                    value={values.workingDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setFieldValue("workingDate", newDate);
                      const formatDateTime = (date, dateTimeString) => {
                        if (!dateTimeString) return "";
                        // Lấy phần giờ từ giá trị cũ
                        const timePart = dateTimeString.includes("T")
                          ? dateTimeString.split("T")[1].slice(0, 5)
                          : dateTimeString;
                        return `${newDate}T${timePart}:00`;
                      };
                      // Update start và end theo ngay moi
                      setFieldValue(
                        "startTime",
                        formatDateTime(newDate, values.startTime || "")
                      );
                      setFieldValue(
                        "endTime",
                        formatDateTime(newDate, values.endTime || "")
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Field name="startTime">
                    {({ field, form }) => {
                      const currentValue = field.value
                        ? field.value.includes("T")
                          ? field.value.split("T")[1].slice(0, 5)
                          : field.value
                        : "";

                      return (
                        <ReusableDateTimePicker
                          name="startTime"
                          type="time"
                          label="Giờ bắt đầu"
                          value={currentValue}
                          onChange={(e) => {
                            const time = e.target.value; // HH:mm
                            form.setFieldValue(
                              "startTime",
                              `${values.workingDate}T${time}:00`
                            );
                          }}
                        />
                      );
                    }}
                  </Field>
                </Grid>
                <Grid item xs={3}>
                  <Field name="endTime">
                    {({ field, form }) => {
                      const currentValue = field.value
                        ? field.value.includes("T")
                          ? field.value.split("T")[1].slice(0, 5)
                          : field.value
                        : "";

                      return (
                        <ReusableDateTimePicker
                          name="endTime"
                          type="time"
                          label="Giờ kết thúc"
                          value={currentValue}
                          onChange={(e) => {
                            const time = e.target.value;
                            form.setFieldValue(
                              "endTime",
                              `${values.workingDate}T${time}:00`
                            );
                          }}
                        />
                      );
                    }}
                  </Field>
                </Grid>
                <Grid item xs={3}>
                  <ReusableTextField name="priority" label="Độ ưu tiên" select>
                    {priority.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </ReusableTextField>
                </Grid>
                <Grid item xs={12}>
                  <ReusableTextField name="description" label="Mô tả" />
                </Grid>
              </Grid>
              {/* section Chi Tiet Cong Viec */}
              <Typography variant="h5" className={classes.typography}>
                2. Chi tiết công việc
              </Typography>
              <FieldArray name="details">
                {({ insert, remove, push, form }) => {
                  const { values, errors, touched } = form;
                  return (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() =>
                          push({
                            workingItemTitle: "",
                            employee: null,
                          })
                        }
                      >
                        <AddIcon fontSize="small" />
                        Thêm mới công việc
                      </Button>{" "}
                      {/* Header */}
                      <Grid container>
                        {["Tiêu đề công việc", "Nhân viên thực hiện", ""].map(
                          (item, index) => (
                            <Grid item xs key={index}>
                              <div className={classes.header}>{item}</div>
                            </Grid>
                          )
                        )}
                      </Grid>
                      {/* Body */}
                      <Grid container>
                        {values.details.length > 0 &&
                          values.details.map((detail, index) => (
                            <Grid container key={index}>
                              <Grid item xs>
                                <ReusableTextField
                                  className={classes.field}
                                  name={`details.${index}.workingItemTitle`}
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableAutocomplete
                                  name={`details.${index}.employee`}
                                  className={classes.field}
                                  options={handleOptionDetail(
                                    values.timeSheetStaff
                                  )}
                                  displayData="displayName"
                                />
                              </Grid>
                              <Grid item xs className={classes.gridSpecial}>
                                <IconButton
                                  className={classes.buttonDelete}
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                      {values.details.length == 0 &&
                        errors.details !== "" &&
                        touched.details && (
                          <div className={classes.error}>{errors.details}</div>
                        )}
                    </div>
                  );
                }}
              </FieldArray>
              {/* Button Submit */}
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} ${classes.buttonSubmit}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isUpdate ? "Cập nhật TimeSheet" : "Thêm mới TimeSheet"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
});

import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, FieldArray } from "formik";
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
import { formatDateForInput } from "utils";
import ReusableTextField from "../ReusableComponent/ReusableTextField";
import ReusableDatePicker from "../ReusableComponent/ReusableDateTimePicker";
import ReusableAutocomplete from "../ReusableComponent/ReusableAutocomplete";
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
  buttonSubmit: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[500],
    },
  },
  header: {
    padding: "16px 14px",
    height: 50,
    border: "1px solid #ddd",
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
});
const gender = [
  {
    value: "",
    label: "---",
  },
  {
    value: "M",
    label: "Nam",
  },
  {
    value: "F",
    label: "Nữ",
  },
  {
    value: "U",
    label: "Không rõ",
  },
];
const initialValuesStaff = {
  lastName: "",
  firstName: "",
  displayName: "",
  gender: "",
  birthDate: "",
  birthPlace: "",
  permanentResidence: "",
  currentResidence: "",
  email: "",
  phoneNumber: "",
  idNumber: "",
  nationality: null,
  ethnics: null,
  religion: null,
  department: null,
  familyRelationships: [
    {
      fullName: "",
      profession: "",
      birthDate: "",
      familyRelationship: null,
      address: "",
      description: "",
    },
  ],
};
const validationSchema = Yup.object({
  lastName: Yup.string().required("Không được để trống"),
  firstName: Yup.string().required("Không được để trống"),
  gender: Yup.string().required("Không được để trống"),
  birthDate: Yup.string().required("Không được để trống"),
  birthPlace: Yup.string().required("Không được để trống"),
  permanentResidence: Yup.string().required("Không được để trống"),
  currentResidence: Yup.string().required("Không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phoneNumber: Yup.string()
    .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  idNumber: Yup.string().required("Không được để trống"),
});

export default observer(function StaffCreateOrUpdate() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(initialValuesStaff);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(!!id);
  const {
    countryStore,
    ethnicsStore,
    religionStore,
    departmentStore,
    familyRelationshipStore,
    staffStore,
  } = useStore();
  useEffect(() => {
    const loadAll = async () => {
      try {
        let arrayPromise = [
          countryStore.getAllCountryStore(),
          religionStore.getAllReligionStore(),
          ethnicsStore.getAllEthnicStore(),
          departmentStore.getAllDepartmentStore(),
          familyRelationshipStore.getAllFamilyRelationshipStore(),
          ...(id ? [staffStore.getSelectedStaff(id)] : []),
        ];
        await Promise.all(arrayPromise);
        if (id && Object.keys(staffStore.staffSelect).length === 0) {
          // toast.error("Nhân viên không tồn tại!");
          history.goBack();
        } else if (id) {
          setInitialValues({
            ...initialValuesStaff,
            ...staffStore.staffSelect,
            birthDate: formatDateForInput(staffStore.staffSelect.birthDate), // Format birthDate
            familyRelationships: staffStore.staffSelect.familyRelationships
              ?.length
              ? staffStore.staffSelect.familyRelationships.map((rel) => ({
                  ...rel,
                  birthDate: formatDateForInput(rel.birthDate), // Format family relationship birthDate
                }))
              : initialValuesStaff.familyRelationships,
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (id) history.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);
  // Hiển thị loading trước khi có dữ liệu
  if (
    loading ||
    !countryStore.countryOptionList.length ||
    !religionStore.religionOptionList.length ||
    !ethnicsStore.ethnicOptionList.length ||
    !departmentStore.departmentOptionList.length ||
    !familyRelationshipStore.familyRelationshipOptionList.length
  ) {
    return <div>Đang tải...</div>;
  }
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isUpdate) {
        // Update existing staff
        await staffStore.updateStaffStore(values);
      } else {
        // Create new staff
        await staffStore.addStaffStore(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
      // history.push("/category/staff");
    }
  };
  return (
    <>
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
                {/* Section Thong Tin Co Ban */}
                <Typography variant="h5" className={classes.typography}>
                  1.Thông tin cơ bản
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <ReusableTextField
                      name="lastName"
                      value={values.lastName}
                      label="Họ"
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue(
                          "displayName",
                          `${e.target.value} ${values.firstName}`.trim()
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField
                      name="firstName"
                      label="Tên"
                      value={values.firstName}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue(
                          "displayName",
                          `${values.lastName} ${e.target.value}`.trim()
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField
                      name="displayName"
                      label="Họ và Tên"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField name="gender" label="Giới Tính" select>
                      {gender.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </ReusableTextField>
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableDatePicker name="birthDate" label="Ngày sinh" />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField name="birthPlace" label="Nơi sinh" />
                  </Grid>
                  <Grid item xs={6}>
                    <ReusableTextField
                      name="permanentResidence"
                      label="Địa điểm thường trú"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ReusableTextField
                      name="currentResidence"
                      label="Nơi cư trú hiện tại"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField name="email" label="Email" />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField
                      name="phoneNumber"
                      label="Số điện thoại"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ReusableTextField name="idNumber" label="Số id" />
                  </Grid>
                  <Grid item xs={3}>
                    <ReusableAutocomplete
                      name="nationality"
                      label="Quốc tịch"
                      options={countryStore.countryOptionList}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <ReusableAutocomplete
                      name="ethnics"
                      options={ethnicsStore.ethnicOptionList}
                      label="Dân tộc"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <ReusableAutocomplete
                      name="religion"
                      options={religionStore.religionList}
                      label="Tôn giáo"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <ReusableAutocomplete
                      name="department"
                      options={departmentStore.departmentList}
                      label="Phòng ban"
                    />
                  </Grid>
                </Grid>
                {/* Section Quan He Nhan Than */}
                <Typography variant="h5" className={classes.typography}>
                  2.Quan hệ nhân thân
                </Typography>
                <FieldArray name="familyRelationships">
                  {({ insert, remove, push }) => (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() =>
                          push({
                            fullName: "",
                            profession: "",
                            birthDate: "",
                            familyRelationship: null,
                            address: "",
                            description: "",
                          })
                        }
                      >
                        <AddIcon fontSize="small" />
                        Thêm mới nhân thân
                      </Button>{" "}
                      {/* Header FieldArray */}
                      <Grid container>
                        {[
                          "Tên",
                          "Nghề nghiệp",
                          "Ngày sinh",
                          "Quan hệ",
                          "Địa chỉ",
                          "Mô tả",
                          "",
                        ].map((item, index) => (
                          <Grid item xs key={index}>
                            <div className={classes.header}>{item}</div>
                          </Grid>
                        ))}
                      </Grid>
                      {/* Body FieldArray */}
                      <Grid container>
                        {values.familyRelationships.length > 0 &&
                          values.familyRelationships.map((_, index) => (
                            <Grid container key={index}>
                              <Grid item xs>
                                <ReusableTextField
                                  className={classes.field}
                                  name={`familyRelationships.${index}.fullName`}
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableTextField
                                  className={classes.field}
                                  name={`familyRelationships.${index}.profession`}
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableDatePicker
                                  className={classes.field}
                                  name={`familyRelationships.${index}.birthDate`}
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableAutocomplete
                                  name={`familyRelationships.${index}.familyRelationship`}
                                  className={classes.field}
                                  options={
                                    familyRelationshipStore.familyRelationshipOptionList
                                  }
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableTextField
                                  className={classes.field}
                                  name={`familyRelationships.${index}.address`}
                                />
                              </Grid>
                              <Grid item xs>
                                <ReusableTextField
                                  className={classes.field}
                                  name={`familyRelationships.${index}.description`}
                                />
                              </Grid>
                              <Grid item xs className={classes.gridSpecial}>
                                <IconButton
                                  aria-label="delete"
                                  className={classes.buttonDelete}
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                    </>
                  )}
                </FieldArray>
                {/* BUTTON SUBMIT */}
                <Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button} ${classes.buttonSubmit}`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isUpdate ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
});

import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/staff";

export const getStaff = (id) => {
  let url = API_PATH + "/" + id;
  return axios.get(url);
};

export const getDepartmentTree = () => {
  var url = API_PATH + "/departmenttree";
  return axios.get(url);
};

export const deleteMultipleStaff = (staffArray) => {
  var url = API_PATH;
  return axios.delete(url, {
    data: staffArray,
  });
};
export const getStaffs = (obj) => {
  let url = API_PATH + "/" + obj.pageIndex + "/" + obj.pageSize;
  return axios.get(url);
};
export const saveStaff = (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};
export const updateItem = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.put(url, obj);
};
export const removeStaff = (staffId) => {
  let url = API_PATH + "/" + staffId;
  return axios.delete(url);
};
export const findTeacherByDepartment = (obj) => {
  let url =
    API_PATH +
    `/department/${obj.departmentId}/${obj.pageIndex}/${obj.pageSize}`;
  return axios.get(url);
};
export const getAllStaffs = () => {
  let url = API_PATH + "/all";
  return axios.get(url);
};
export const findStaffs = (searchObject, pageIndex, pageSize) => {
  let url = API_PATH + `/find/${pageIndex}/${pageSize}`;
  return axios.post(url, searchObject);
  //   const searchDto = {
  //   department: { id: "uuid" },
  //   keyword: "Nguyen",
  //   isMainPosition: true
  // };
};
export const getStaffsByCode = (textSearch, pageIndex, pageSize) => {
  let url = API_PATH + `/staffcode/${textSearch}/${pageIndex}/${pageSize}`;
  return axios.get(url);
};
export const getSimpleSearch = (textSearch) => {
  let url = API_PATH;
  return axios.get(url, {
    params: { textSearch },
  });
};
export const validateStaffCode = (staffCode, staffId) => {
  let url = API_PATH + `/validatestaffcode/${staffId}`;
  return axios.post(url, {
    params: { staffCode },
  });
};
export const validateUserName = (userName, userId) => {
  let url = API_PATH + `/validateusername/${userId}`;
  return axios.post(url, {
    params: { userName },
  });
};
export const searchByPage = (searchObject) => {
  let url = API_PATH + "/searchByPage";
  return axios.post(url, searchObject);
};
export const checkIdNumber = (obj) => {
  let url = API_PATH + "/checkIdNumber";
  return axios.post(url, obj);
};

export const updateStaffImage = (id, imagePath) => {
  let url = API_PATH + `imagePath/${id}`;
  return axios.post(url, {
    params: { imagePath },
  });
};

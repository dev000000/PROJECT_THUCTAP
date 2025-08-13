import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/timesheet";

export const getTimeSheet = (id) => {
  let url = API_PATH + "/" + id;
  return axios.get(url);
};

export const getTimeSheetByWorkingDate = (obj) => {
  var url = API_PATH + `/workingdate/${obj.workingdate}/${obj.pageSize}/${obj.pageIndex}`;
  return axios.get(url);
};
export const removeTimeSheet = (timeSheetId) => {
  let url = API_PATH + "/" + timeSheetId;
  return axios.delete(url);
};
export const deleteMultipleTimeSheet = (timeSheetArray) => {
  var url = API_PATH;
  return axios.delete(url, {
    data: timeSheetArray,
  });
};
export const findPageByName = (obj) => {
  var url = API_PATH + `/searchStaff/${obj.name}/${obj.pageIndex}/${obj.pageSize}`;
  return axios.get(url);
};
export const findPageByStaff = (obj) => {
  var url = API_PATH + `/staff/${obj.name}/${obj.pageIndex}/${obj.pageSize}`;
  return axios.get(url);
};
export const searchByDto = (searchObject, pageIndex, pageSize ) => {
  var url = API_PATH + `/searchByDto/${pageIndex}/${pageSize}`;
  return axios.post(url,searchObject);
};
export const getTimeSheetDetailByTimeSheetID = (id,pageIndex,pageSize) => {
  var url = API_PATH + `/detail/${id}/${pageIndex}/${pageSize}`;
  return axios.get(url);
};
export const confirmTimeSheets = (timeSheetArray) => {
  var url = API_PATH + `/confirm`;
  return axios.post(url,{
    data: timeSheetArray
  });
};
export const searchByPage = (searchObject) => {
  var url = API_PATH + `/search-by-page`;
  return axios.post(url,searchObject);
};
export const saveTimeSheet = (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};
export const updateTimeSheet = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.put(url, obj);
};
export const updateStatus = (id,workingStatusId) => {
  let url = API_PATH + `/update-status/${id}/${workingStatusId}`;
  return axios.put(url);
};
export const exportExcel = (searchObject) => {
  let url = API_PATH + `/exportExcel`;
  return axios.post(url,searchObject);
};
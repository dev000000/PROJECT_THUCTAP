import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/project";

export const pagingProjects = (searchObject) => {
  var url = API_PATH + "/search-by-page";
  return axios.post(url, searchObject);
};
export const pagingProjectsWithUserName = (searchObject) => {
  var url = API_PATH + "/get-page-project-by-username";
  return axios.post(url, searchObject);
};

export const getProject = (id) => {
  let url = API_PATH + "/" + id;
  return axios.get(url);
};

export const createProject = (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};

export const editProject = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.put(url, obj);
};

export const deleteProject = (id) => {
  let url = API_PATH + "/" + id;
  return axios.delete(url);
};
export const checkCode = (id, code) => {
  const param = { params: { id: id, code: code } };
  let url = API_PATH + "/check-code";
  return axios.get(url, param);
};

import { makeAutoObservable, runInAction } from "mobx";
import {
  createProject,
  deleteProject,
  editProject,
  pagingProjects,
} from "./ProjectService";

export default class ProjectStore {
  projectList = [];
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  totalPages = 0;
  totalElements = 0;
  hasFetchedTotal = false;
  projectOptionList = [];
  isOptionLoaded = false;
  projectSearchForTimeSheetList = [];

  constructor() {
    makeAutoObservable(this);
  }
  async refreshLists() {
    await this.getProjectList();
    this.isOptionLoaded = false;
    await this.getProjectOptionList();
  }
  async setPaging({ pageIndex, pageSize, keyword }) {
    runInAction(() => {
      if (pageIndex !== undefined) {
        this.pageIndex = pageIndex;
      }
      if (pageSize !== undefined) {
        this.pageSize = pageSize;
      }
      if (keyword !== undefined) {
        this.keyword = keyword;
      }
    });
    this.getProjectList();
  }
  async getProjectList() {
    try {
      let response = await pagingProjects({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.projectList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading projectList", error);
    }
  }
  async getProjectOptionList() {
    try {
      if (this.isOptionLoaded) return;
      if (!this.hasFetchedTotal) {
        await this.getProjectList();
      }
      const response = await pagingProjects({
        pageIndex: 1,
        keyword: "",
        pageSize: this.totalElements,
      });
      runInAction(() => {
        this.projectOptionList = response?.data.content || [];
        this.isOptionLoaded = true;
      });
    } catch (error) {
      console.error("Error get all option project:", error);
    }
  }
  async searchProjectsForTimeSheet(keyword = "") {
    try {
      const response = await pagingProjects({
        pageIndex: 1,
        keyword: keyword,
        pageSize: this.totalElements || 9999,
      });
      runInAction(() => {
        this.projectSearchForTimeSheetList = response?.data?.content || [];
      });
    } catch (error) {
      console.error("Error loading projectSearchForTimeSheetList", error);
    }
  }
  async addProjectStore(newData) {
    try {
      await createProject(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add project", error);
    }
  }
  async updateProjectStore(newData) {
    try {
      await editProject(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit project:", error);
    }
  }
  async deleteProjectStore(oldData) {
    try {
      await deleteProject(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete project:", error);
    }
  }
}

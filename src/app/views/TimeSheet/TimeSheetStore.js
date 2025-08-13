import { makeAutoObservable, runInAction } from "mobx";
import {
  getTimeSheet,
  removeTimeSheet,
  saveTimeSheet,
  searchByPage,
  updateTimeSheet,
} from "./TimeSheetService";

export default class TimeSheetStore {
  timeSheetList = [];
  timeSheetSelect = {};
  // projectSelect = {};
  projectIdSelectSearch = "";
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  totalPages = 0;
  totalElements = 0;
  constructor() {
    makeAutoObservable(this);
  }
  async setPaging({ pageIndex, pageSize, keyword, projectId }) {
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
      if (projectId !== undefined) {
        this.projectIdSelectSearch = projectId;
      }
    });
    this.getTimeSheetList();
  }
  // async setProjectSelect(project) {
  //   this.projectSelect = project;
  // }
  async getTimeSheetList() {
    try {
      const response = await searchByPage({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
        ...(this.projectIdSelectSearch && {
          projectId: this.projectIdSelectSearch,
        }),
      });
      runInAction(() => {
        this.timeSheetList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
      });
    } catch (error) {
      console.error("Error loading TimeSheet", error);
    }
  }
  async getSelectedTimeSheet(id) {
    try {
      const response = await getTimeSheet(id);
      this.timeSheetSelect = response?.data || {};
    } catch (error) {
      console.error("Error get TimeSheet selected:", error);
    }
  }
  
  async addTimeSheetStore(newData) {
    try {
      await saveTimeSheet(newData);
      await this.getTimeSheetList();
    } catch (error) {
      console.error("Error add TimeSheet", error);
    }
  }
  async updateTimeSheetStore(newData) {
    try {
      await updateTimeSheet(newData);
      await this.getTimeSheetList();
    } catch (error) {
      console.error("Error edit TimeSheet:", error);
    }
  }
  async deleteTimeSheetStore(oldData) {
    try {
      await removeTimeSheet(oldData.id);
      await this.getTimeSheetList();
    } catch (error) {
      console.error("Error delete TimeSheet:", error);
    }
  }
  
}

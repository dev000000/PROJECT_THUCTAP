import { makeAutoObservable, runInAction } from "mobx";
import {
  getAllStaffs,
  getStaff,
  removeStaff,
  saveStaff,
  searchByPage,
  updateItem,
} from "./StaffService";

export default class StaffStore {
  staffList = [];
  staffOptionList = [];
  staffSelect = {};
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  totalPages = 0;
  totalElements = 0;
  isAllLoaded = false;
  constructor() {
    makeAutoObservable(this);
  }
  async refreshLists() {
    await this.getStaffList();
    this.isAllLoaded = false;
    await this.getAllStaffStore();
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
    this.getStaffList();
  }
  async getStaffList() {
    try {
      const response = await searchByPage({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.staffList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
      });
    } catch (error) {
      console.error("Error loading Staff", error);
    }
  }
  async getSelectedStaff(id) {
    try {
      const response = await getStaff(id);
      runInAction(() => {
        this.staffSelect = response?.data || {};
      });
    } catch (error) {
      console.error("Error get Staff selected:", error);
    }
  }
  async getAllStaffStore() {
    try {
      if(this.isAllLoaded) return;
      const response = await getAllStaffs();
      runInAction(() => {
        this.staffOptionList = response?.data || [];
        this.isAllLoaded = true;
      });
    } catch (error) {
      console.error("Error Load All Staff:", error);
    }
  }
  async addStaffStore(newData) {
    try {
      await saveStaff(newData);
      await this.getStaffList();
    } catch (error) {
      console.error("Error add Staff", error);
    }
  }
  async updateStaffStore(newData) {
    try {
      await updateItem(newData);
      await this.getStaffList();
    } catch (error) {
      console.error("Error edit Staff:", error);
    }
  }
  async deleteStaffStore(oldData) {
    try {
      await removeStaff(oldData.id);
      await this.getStaffList();
    } catch (error) {
      console.error("Error delete Staff:", error);
    }
  }
  
  
}

import { makeAutoObservable, runInAction } from "mobx";
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
  pagingAllDepartments,
} from "./DepartmentService";

export default class DepartmentStore {
  departmentList = [];
  departmentOptionList = [];
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  totalPages = 0;
  totalElements = 0;
  hasFetchedTotal = false;
  isAllLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }
  async refreshLists() {
    await this.getDepartmentList();
    this.isAllLoaded = false;
    await this.getAllDepartmentStore();
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
    this.getDepartmentList();
  }
  async getDepartmentList() {
    try {
      const response = await pagingAllDepartments({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.departmentList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading department:", error);
    }
  }
  async getAllDepartmentStore() {
      try {
        if (this.isAllLoaded) return;
        if (!this.hasFetchedTotal) {
          await this.getDepartmentList();
        }
        let response = await pagingAllDepartments({
          pageIndex: 1,
          keyword: "",
          pageSize: this.totalElements,
        });
        runInAction(() => {
          this.departmentOptionList = response?.data.content || [];
          this.totalElements = response?.data.totalElements || 0;
          this.isAllLoaded = true;
        });
      } catch (error) {
        console.error("Error get all department:", error);
      }
    }
  async addDepartment(newData) {
    try {
      if (Object.keys(newData.parent || {}).length === 0) {
        delete newData.parent;
      }
      await createDepartment(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add department:", error);
    }
  }
  async updateDeparmentStore(newData) {
    try {
      await editDepartment(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit department:", error);
    }
  }
  async deleteDepartmentStore(oldData) {
    try {
      await deleteDepartment(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete department:", error);
    }
  }
}

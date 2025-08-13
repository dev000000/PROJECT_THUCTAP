import { makeAutoObservable, runInAction } from "mobx";
import {
  createReligion,
  deleteReligion,
  editReligion,
  pagingReligions,
} from "./ReligionService";

export default class ReligionStore {
  religionList = [];
  religionOptionList = [];
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
    await this.getReligionList();
    this.isAllLoaded = false;
    await this.getAllReligionStore();
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
    this.getReligionList();
  }
  async getReligionList() {
    try {
      const response = await pagingReligions({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.religionList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading religion", error);
    }
  }
  async getAllReligionStore() {
    try {
      if (this.isAllLoaded) return;
      if (!this.hasFetchedTotal) {
        await this.getReligionList();
      }
      const response = await pagingReligions({
        pageIndex: 1,
        keyword: "",
        pageSize: this.totalElements,
      });
      runInAction(() => {
        this.religionOptionList = response?.data.content || [];
        this.totalElements = response?.data.totalElements || 0;
        this.isAllLoaded = true;
      });
    } catch (error) {
      console.error("Error get all religion:", error);
    }
  }
  async addReligionStore(newData) {
    try {
      await createReligion(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add religion", error);
    }
  }
  async updateReligionStore(newData) {
    try {
      await editReligion(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit religion:", error);
    }
  }
  async deleteReligionStore(oldData) {
    try {
      await deleteReligion(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete religion:", error);
    }
  }
}

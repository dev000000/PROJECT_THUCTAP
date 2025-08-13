import { makeAutoObservable, runInAction } from "mobx";
import {
  createEthnics,
  deleteEthnics,
  editEthnics,
  pagingEthnicities,
} from "./EthnicsService";

export default class EthnicsStore {
  ethnicList = [];
  ethnicOptionList = [];
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
    await this.getEthnicsList();
    this.isAllLoaded = false;
    await this.getAllEthnicStore();
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
    this.getEthnicsList();
  }
  async getEthnicsList() {
    try {
      let response = await pagingEthnicities({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.ethnicList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading ethnics", error);
    }
  }
  async getAllEthnicStore() {
      try {
        if (this.isAllLoaded) return;
        if (!this.hasFetchedTotal) {
          await this.getEthnicsList();
        }
        let response = await pagingEthnicities({
          pageIndex: 1,
          keyword: "",
          pageSize: this.totalElements,
        });
        runInAction(() => {
          this.ethnicOptionList = response?.data.content || [];
          this.totalElements = response?.data.totalElements || 0;
          this.isAllLoaded = true;
        });
      } catch (error) {
        console.error("Error get all ethnics:", error);
      }
    }
  async addEthnicsStore(newData) {
    try {
      await createEthnics(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add ethnics", error);
    }
  }
  async updateEthnicsStore(newData) {
    try {
      await editEthnics(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit ethnics:", error);
    }
  }
  async deleteEthnicsStore(oldData) {
    try {
      await deleteEthnics(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete ethnics:", error);
    }
  }
}

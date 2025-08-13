import { makeAutoObservable, runInAction } from "mobx";
import {
  createCountry,
  deleteCountry,
  editCountry,
  pagingCountries,
} from "./CountryService";

export default class CountryStore {
  countryList = [];
  countryOptionList = [];
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
    await this.getCountryList();
    this.isAllLoaded = false;
    await this.getAllCountryStore();
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
    this.getCountryList();
  }
  async getCountryList() {
    try {
      let response = await pagingCountries({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.countryList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  }
  async getAllCountryStore() {
    try {
      if (this.isAllLoaded) return;
      if (!this.hasFetchedTotal) {
        await this.getCountryList();
      }
      let response = await pagingCountries({
        pageIndex: 1,
        keyword: "",
        pageSize: this.totalElements,
      });
      runInAction(() => {
        this.countryOptionList = response?.data.content || [];
        this.totalElements = response?.data.totalElements || 0;
        this.isAllLoaded = true;
      });
    } catch (error) {
      console.error("Error get all Country:", error);
    }
  }
  async addCountryStore(newData) {
    try {
      await createCountry(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add country:", error);
    }
  }
  async updateCountryStore(newData) {
    try {
      await editCountry(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit country:", error);
    }
  }
  async deleteCountryStore(oldData) {
    try {
      await deleteCountry(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete country:", error);
    }
  }
}

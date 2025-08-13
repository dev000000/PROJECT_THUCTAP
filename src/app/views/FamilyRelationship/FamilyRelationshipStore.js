import { makeAutoObservable, runInAction } from "mobx";
import {
  createFamilyRelationship,
  deleteFamilyRelationship,
  editFamilyRelationship,
  pagingFamilyRelationship,
} from "./FamilyRelationshipService";

export default class FamilyRelationshipStore {
  familyRelationshipList = [];
  familyRelationshipOptionList = [];
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
    await this.getFamilyRelationshipList();
    this.isAllLoaded = false;
    await this.getAllFamilyRelationshipStore();
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
    this.getFamilyRelationshipList();
  }
  async getFamilyRelationshipList() {
    try {
      let response = await pagingFamilyRelationship({
        pageIndex: this.pageIndex,
        keyword: this.keyword,
        pageSize: this.pageSize,
      });
      runInAction(() => {
        this.familyRelationshipList = response?.data.content || [];
        this.totalPages = response?.data.totalPages || 0;
        this.totalElements = response?.data.totalElements || 0;
        this.hasFetchedTotal = true;
      });
    } catch (error) {
      console.error("Error loading familyRelationship", error);
    }
  }
  async getAllFamilyRelationshipStore() {
      try {
        if (this.isAllLoaded) return;
        if (!this.hasFetchedTotal) {
          await this.getFamilyRelationshipList();
        }
        let response = await pagingFamilyRelationship({
          pageIndex: 1,
          keyword: "",
          pageSize: this.totalElements,
        });
        runInAction(() => {
          this.familyRelationshipOptionList = response?.data.content || [];
          this.totalElements = response?.data.totalElements || 0;
          this.isAllLoaded = true;
        });
      } catch (error) {
        console.error("Error get all religion:", error);
      }
    }
  async addFamilyRelationshipStore(newData) {
    try {
      await createFamilyRelationship(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error add FamilyRelationship", error);
    }
  }
  async updateFamilyRelationshipStore(newData) {
    try {
      await editFamilyRelationship(newData);
      await this.refreshLists();
    } catch (error) {
      console.error("Error edit FamilyRelationship:", error);
    }
  }
  async deleteFamilyRelationshipStore(oldData) {
    try {
      await deleteFamilyRelationship(oldData.id);
      await this.refreshLists();
    } catch (error) {
      console.error("Error delete FamilyRelationship:", error);
    }
  }
}

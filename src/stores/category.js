import { defineStore } from "pinia";
import dataService from "@/services/dataService";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    searchQuery: "",
    categories: [],
  }),
  getters: {
  },
  actions: {

    //get all categories from splash response
    async fetchAllCategories() {
      try {
        const response = await dataService.getSplash();
        this.categories = response?.data?.data?.categories || [];
        console.log("Categories:", this.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //insert new category
    async addNewCategory(categoryData) {
      try {
        const response = await dataService.addNewCategory(categoryData);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error || "Operation failed.";
          this.alertType = "danger";
        }
      } catch (error) {
        console.error("Error creating category:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //edit existing category
    async editCategory(categoryData) {
      try {
        const response = await dataService.modifyCategory(categoryData.id, categoryData);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error || "Operation failed.";
          this.alertType = "danger";
        }
      } catch (error) {
        console.error("Error creating category:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

  },
});

import { defineStore } from "pinia";
import dataService from "@/services/dataService";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    searchQuery: "",
    posts: [],
    totalUsers: [],
    totalPosts: [],
    recentPosts: []
  }),
  getters: {},
  actions: {
    //get total users
    async fetchTotalUsers() {
      try {
        const response = await dataService.getSplash();
        this.totalUsers = response?.data?.data?.total_users || [];
        console.log("No. of users:", this.totalUsers);
      } catch (error) {
        console.error("Error occurred while fetching:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //get total posts
    async fetchTotalPosts() {
      try {
        const response = await dataService.getSplash();
        this.totalPosts = response?.data?.data?.total_posts || [];
        console.log("No. of posts:", this.totalPosts);
      } catch (error) {
        console.error("Error occurred while fetching:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //get recent posts
    async fetchRecentPosts() {
      try {
        const response = await dataService.getSplash();
        this.recentPosts = response?.data?.data?.recent_posts || [];
        console.log("Recent posts:", this.recentPosts);
      } catch (error) {
        console.error("Error occurred while fetching:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },
  },
});

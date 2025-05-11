import { defineStore } from "pinia";
import dataService from "@/services/dataService";
import { useAlertStore } from "@/stores/alert";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    loading: false,
    bets: 0,
    allbets: [],
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    searchQuery: "",
    posts: [],
    totalUsers: [],
    totalPosts: [],
    recentPosts: [],
  }),

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

    async getAllPostedBets() {
      try {
        this.loading = true;
        const res = await dataService.getAllBets();

        let code = res.data.code;
        let message = res.data.message;

        if (code !== 200) {
          this.bets = {};
         this.allbets = [];
          const alertStore = useAlertStore();
          alertStore.error(message);
        } else {
          let total_bets = res.data.total_bets || 0;
           this.allbets = res.data.createbets || [];
         

          this.bets = total_bets;
       
         
        }
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(
          error.response?.data?.message || "Error fetching bets"
        );
        this.bets = {};
      } finally {
        this.loading = false;
      }
    },

    persist: {
    enabled: true,
    strategies: [
      {
        key: "dashboardStore",       
        storage: localStorage,       
      },
    ],
  },
  },
  getters: {},
});

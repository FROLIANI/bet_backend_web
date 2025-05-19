import { defineStore } from "pinia";
import dataService from "@/services/dataService";
import { useAlertStore } from "@/stores/alert";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    loading: false,
    bet_info: [],
    total_placed: 0,
    total_bet_info:{},

    tota_users:0,
    users:{},

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

    //Total + all posted bets
    async getAllPostedBets() {
      try {
        this.loading = true;
        const res = await dataService.getAllBets();

        let code = res.data.code;
        let message = res.data.message;

        let bet_datails = res.data.bet_data;

        if (code !== 200) {
          // const alertStore = useAlertStore();
          // alertStore.error(message);
          this.bet_info = [];
        } else {
          this.bet_info = bet_datails;
        }
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(
          error.response?.data?.message || "Error fetching bets"
        );
        this.bet_info = {};
      } finally {
        this.loading = false;
      }
    },

    //Total + all placed bets
   async getPlacedBets() {
  try {
    this.loading = true;
    const res = await dataService.getAllPlacedBets();

    let code = res.data.code;
    let message = res.data.message;
    if (code !== 200) {
      this.total_placed = 0;
    } else {
      this.total_placed = res.data.total;
      this.total_bet_info = res.data.data;
    }
  } catch (error) {
    const alertStore = useAlertStore();
    alertStore.error(
      error.response?.data?.message || "Error fetching placed bets"
    );
    this.bet_info = [];
  } finally {
    this.loading = false;
  }
},

    //Total + users
   async getUsers() {
  try {
    this.loading = true;
    const res = await dataService.getAllUsers();

    let code = res.data.code;
    let message = res.data.message;

    if (code !== 200) {
      this.total_placed = 0;
    } else {
      this.tota_users = res.data.total_users;
      this.users = res.data.users;
    }
  } catch (error) {
    const alertStore = useAlertStore();
    alertStore.error(
      error.response?.data?.message || "Error fetching placed bets"
    );
    this.bet_info = [];
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

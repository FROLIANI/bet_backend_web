import { defineStore } from "pinia";
import dataService from "@/services/dataService";

export const useUserStore = defineStore("user", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    username: "",
    userId: "",
    firstName: "",
    users: [],
  }),
  getters: {
  },
  actions: {
    //Get logged-in user details
    fetchLoggedInUserDetails() {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.username = user?.username || "Unknown";
      this.userId = user?.id || null;
      this.firstName = user?.name || null;
    },

    //get all registered users
    async fetchUsers() {
      try {
        const response = await dataService.getSplash();
        this.users = response?.data?.data?.users || [];
        console.log("Users:", this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },



    //create new user
    async createUser(userData) {
      try {
        const response = await dataService.createUser(userData);

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
        console.error("Error creating user:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //update details of existing user
    async updateUser(userData) {
      try {
        const response = await dataService.updateUser(userData.id, userData);

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
        console.error("Error modifying user:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },


    //delete user by id
    async deleteUser(id) {
      try {
        const response = await dataService.deleteUser(id);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
          await this.fetchUsers();
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error;
          this.alertType = "error";
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to delete user";
        this.alertType = "error";
      }
    },
  },
});

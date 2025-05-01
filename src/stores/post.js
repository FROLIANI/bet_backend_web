import { defineStore } from "pinia";
import dataService from "@/services/dataService";
import { useUserStore } from "./user";

export const usePostStore = defineStore("post", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    searchQuery: "",
    posts: [],
    publishedPosts: [],
    draftedPosts: [],
  }),
  getters: {},
  actions: {
    //get all posts from splash response
    async fetchAllPosts() {
      try {
        const userStore = useUserStore();
        const userId = userStore.userId;
        const response = await dataService.getSplash({ user_id: userId });
        this.posts = response?.data?.data?.posts || [];
        console.log("Posts:", this.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //get all posts with status "Published"
    async getPublishedPosts() {
      try {
        this.publishedPosts = this.posts.filter(
            (post) => post.post_status_name === "Published"
          );
        console.log("Published posts:", this.publishedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //get all posts with status "Drafted"
    async getDraftedPosts() {
      try {
        this.draftedPosts = this.posts.filter(
            (post) => post.post_status_name === "Drafted"
          );
        console.log("Drafted posts:", this.draftedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //write new Post into the DB
    async writeNewPost(postData) {
      try {
        const response = await dataService.writeNewPost(postData);

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
        console.error("Error creating post:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    //Update the existing post
    async editPost(postData) {
      try {
        const response = await dataService.editPost(postData.id, postData);

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
        console.error("Error creating post:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },
  },
});

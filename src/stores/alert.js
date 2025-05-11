import { defineStore } from "pinia";
import { defineEmits } from "vue";
// const emit = defineEmits(["close"]);

export const useAlertStore = defineStore('alert',{
  state: () => ({
    alert: null,        
    loading: false,
  }),
  actions: {
    success(message) {
      this.alert = { message, type: "alert-success border-success" };
    },
    error(message) {
      this.loading = true;
      // let timeout;
      this.alert = { message, type: "alert-danger border-danger" };
      // timeout = setTimeout(() => {
      //   emit("close");

      //   // return location.reload();
      // }, 2500);
    },
    clear() {
      this.alert = null;
    },
  },
});

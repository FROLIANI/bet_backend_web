<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success", // success, error, warning, info
  },
  show: {
    type: Boolean,
    required: true,
  },
  duration: {
    type: Number,
    default: 4000, // 4 seconds
  },
});

const emit = defineEmits(["close"]);

const visible = ref(false);
let timer;

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      startTimer();
    }
  }
);

const startTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    closeAlert();
  }, props.duration);
};

const closeAlert = () => {
  visible.value = false;
  emit("close");
};

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div
    v-if="visible"
    :class="[
      'alert',
      `alert-${type}`,
      'alert-dismissible',
      'fade',
      'show',
      'position-fixed',
    ]"
    style="top: 1rem; right: 1rem; z-index: 1050; min-width: 280px;"
  >
    {{ message }}
    <button
      type="button"
      class="btn-close"
      @click="closeAlert"
      aria-label="Close"
    ></button>
  </div>
</template>

<style scoped>
.alert {
  animation: slide-in 0.5s ease-in-out;
}
@keyframes slide-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
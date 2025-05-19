<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';

// Sidebar open by default on lg and above
const isSidebarOpen = ref(window.innerWidth >= 992);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Ensure the sidebar opens automatically on larger screens
const updateSidebarVisibility = () => {
  isSidebarOpen.value = window.innerWidth >= 992;
};

onMounted(() => {
  updateSidebarVisibility();
  window.addEventListener('resize', updateSidebarVisibility);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSidebarVisibility);
});
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <!-- Header -->
    <Header :onToggleSidebar="toggleSidebar" />

    <div class="d-flex flex-grow-1">
      <!-- Sidebar -->
      <Sidebar :isSidebarOpen="isSidebarOpen" :onCloseSidebar="toggleSidebar" />

      <!-- Main Content -->
      <div class="content flex-grow-1 p-2">
        <router-view />
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer py-3 text-center">
      <div class="container">
        <span class="text-muted">&copy; 2025 The.Bet Panel. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.content {
  margin-left: 250px;
  margin-top: 60px; /* Adjust for navbar height */
  overflow-y: auto;
  transition: margin-left 0.3s ease-in-out;
}

@media (max-width: 992px) {
  .content {
    margin-left: 0;
  }
}
</style>






<script setup>
import { computed, ref, onMounted, watchEffect } from "vue";
import AddUser from "./modals/AddUser.vue";
import UserInfo from "./modals/UserInfo.vue";
import Alert from "@/components/Alert.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const currentPage = ref(1);
const itemsPerPage = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

// Hardcoded Users Data
// const users = ref([
//   {
//     id: 1,
//     firstName: "John",
//     lastName: "Doe",
//     username: "johndoe",
//     role: "Admin",
//     status: "Active",
//     dateJoined: "2025-02-28",
//   },
//   {
//     id: 2,
//     firstName: "Jane",
//     lastName: "Smith",
//     username: "janesmith",
//     role: "Author",
//     status: "Inactive",
//     dateJoined: "2025-02-27",
//   },
//   {
//     id: 3,
//     firstName: "Alice",
//     lastName: "Johnson",
//     username: "alicejohnson",
//     role: "Author",
//     status: "Active",
//     dateJoined: "2025-02-26",
//   },
//   {
//     id: 4,
//     firstName: "Bob",
//     lastName: "Brown",
//     username: "bobbrown",
//     role: "Author",
//     status: "Active",
//     dateJoined: "2025-02-25",
//   },
//   {
//     id: 5,
//     firstName: "David",
//     lastName: "Lee",
//     username: "davidlee",
//     role: "Author",
//     status: "Inactive",
//     dateJoined: "2025-02-24",
//   },
//   {
//     id: 6,
//     firstName: "Charlie",
//     lastName: "Kim",
//     username: "charliekim",
//     role: "Editor",
//     status: "Active",
//     dateJoined: "2025-02-23",
//   },
// ]);

const users = computed(() => userStore.users);

watchEffect(() => {
  users.value = userStore.users;
});

const roles = computed(() => [
  ...new Set(users.value.map((user) => user.role)),
]);

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (user) =>
        user.first_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Role filter
  if (selectedCategory.value) {
    filtered = filtered.filter((user) => user.role === selectedCategory.value);
  }

  return filtered;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Modal Functions
const closeModal = () => {
  showModal.value = false;
  modalData.value = null;
};

const openAddUserModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "create";
};

const openEditUserModal = (user) => {
  modalData.value = { ...user };
  showModal.value = true;
  currentModal.value = "edit";
};

const openViewUserModal = (user) => {
  modalData.value = { ...user };
  currentModal.value = "view";
  showModal.value = true;
};

const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    users.value = users.value.filter((user) => user.id !== id);
  }
};

onMounted(() => {
  userStore.fetchUsers();
});
</script>

<template>

<Alert
    :message="userStore.alertMessage"
    :type="userStore.alertType"
    :show="userStore.showAlert"
    @close="showAlert = false"
  />
  
  <div class="card p-3 border border-1 border-primary">
    <h2 class="mb-3">User Management</h2>

    <div class="row mb-2 g-3">
      <!-- Search, Filter & Add Button -->
      <div class="col-md-5 d-flex align-items-center mb-3 mb-md-0">
        <div class="input-group w-100">
          <span class="input-group-text bg-white text-primary">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search users..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div
        class="col-md-7 d-flex justify-content-between justify-content-md-end align-items-center"
      >
        <div class="row g-2 w-100">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white text-primary">
                <i class="bi bi-filter"></i>
              </span>
              <select
                class="form-select"
                v-model="selectedCategory"
                @change="filterUsers"
                aria-label="Filter by Role"
              >
                <option value="">All Roles</option>
                <option v-for="role in roles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-md-6 d-flex justify-content-end">
            <button class="btn btn-primary" @click="openAddUserModal">
              <i class="bi bi-plus-circle"></i> New User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr class="fw-bold">
            <th class="fw-bold">Username</th>
            <th class="fw-bold">Role</th>
            <th class="fw-bold">Status</th>
            <th class="fw-bold">Date Joined</th>
            <th class="fw-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span
                class="badge"
                :class="
                  user.status_name === 'Active' ? 'bg-success' : 'bg-secondary'
                "
                >{{ user.status_name }}</span
              >
            </td>
            <td>{{ user.date_joined }}</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="openViewUserModal(user)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-outline-success btn-sm me-1"
                  @click="openEditUserModal(user)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(user.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="7" class="text-center text-muted">
              <i class="bi bi-exclamation-circle me-2"></i> No user(s) available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginatedUsers.length > 0" class="d-flex justify-content-between align-items-center mt-3">
      <button
        class="btn btn-primary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-arrow-bar-left"></i>
        Previous
      </button>
      <span
        >Page <span class="fw-bold">{{ currentPage }}</span> of
        <span class="fw-bold">{{ totalPages }}</span>
      </span>
      <button
        class="btn btn-primary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
        <i class="bi bi-arrow-bar-right"></i>
      </button>
    </div>

    <!-- Modal Components -->
    <AddUser
      v-if="(currentModal === 'create' || currentModal === 'edit') && showModal"
      :user="modalData"
      @close="closeModal"
    />

    <UserInfo
      v-if="currentModal === 'view' && showModal"
      :user="modalData"
      @close="closeModal"
    />
  </div>
</template>

<style scoped></style>

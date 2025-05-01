<script setup>
import { useCategoryStore } from "@/stores/category";
import { computed, onMounted, ref, watchEffect } from "vue";
import CreateCategory from "./modals/CreateCategory.vue";
import ViewCategory from "./modals/ViewCategory.vue";
import Alert from "@/components/Alert.vue";

const categoryStore = useCategoryStore();
const currentPage = ref(1);
const itemsPerPage = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

// Categories Data
// const categoriesData = ref([]);
const categoriesData = computed(() => categoryStore.categories);

watchEffect(() => {
  categoriesData.value = categoryStore.categories;
});

const categories = computed(() => [
  ...new Set(categoriesData.value.map((category) => category.category_status_name)),
]);

const totalPages = computed(() =>
  Math.ceil(filteredCategories.value.length / itemsPerPage)
);

const filteredCategories = computed(() => {
  let filtered = categoriesData.value;

  if (searchQuery.value) {
    filtered = filtered.filter((category) =>
      category.category_name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(
      // (category) => category.category_name === selectedCategory.value
      (category) => category.category_status_name === selectedCategory.value
    );
  }
  return filtered;
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCategories.value.slice(start, start + itemsPerPage);
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

const openAddCategoryModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "create";
};

const openEditCategoryModal = (category) => {
  modalData.value = { ...category };
  showModal.value = true;
  currentModal.value = "edit";
};

const openViewCategoryModal = (category) => {
  modalData.value = { ...category };
  currentModal.value = "view";
  showModal.value = true;
};

const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this category?")) {
  }
};

onMounted(() => {
  categoryStore.fetchAllCategories();
});
</script>

<template>
  <Alert
    :message="alertMessage"
    :type="alertType"
    :show="showAlert"
    @close="showAlert = false"
  />

  <div class="card p-3 border border-1 border-primary">
    <h2 class="mb-3">Categories</h2>

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
            placeholder="Search categories..."
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
                @change="filterCategories"
                aria-label="Filter by Category"
              >
                <option value="">All</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-md-6 d-flex justify-content-end">
            <button class="btn btn-primary" @click="openAddCategoryModal">
              <i class="bi bi-plus-circle"></i> New Category
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr class="fw-bold">
            <th class="fw-bold">Category Name</th>
            <th class="fw-bold">Status</th>
            <th class="fw-bold">Date</th>
            <th class="fw-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(category, index) in paginatedCategories"
            :key="category.id"
          >
            <td>{{ category.category_name }}</td>
            <td>
              <span
                class="badge"
                :class="
                  category.category_status_name === 'Active'
                    ? 'bg-success'
                    : 'bg-info'
                "
                >{{ category.category_status_name }}</span
              >
            </td>
            <td>{{ category.category_inserted }}</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="openViewCategoryModal(category)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-outline-success btn-sm me-1"
                  @click="openEditCategoryModal(category)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(category.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedCategories.length === 0">
            <td colspan="4" class="text-center text-muted">
              <i class="bi bi-exclamation-circle me-2"></i> No category(s)
              available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginatedCategories.length > 0" class="d-flex justify-content-between align-items-center mt-3">
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
    <CreateCategory
      v-if="(currentModal === 'create' || currentModal === 'edit') && showModal"
      :category="modalData"
      @close="closeModal"
    />
    <ViewCategory
      v-if="currentModal === 'view' && showModal"
      :category="modalData"
      @close="closeModal"
    />
  </div>
</template>

<style scoped></style>

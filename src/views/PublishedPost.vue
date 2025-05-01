<script setup>
import { computed, ref, onMounted } from "vue";
import ReadPost from "./modals/ReadPost.vue";
import CreatePost from "./modals/CreatePost.vue";
import Alert from "@/components/Alert.vue";
import { usePostStore } from "@/stores/post";

const postStore = usePostStore();
const currentPage = ref(1);
const itemsPerPage = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

// Hardcoded Posts Data
// const posts = ref([
//   {
//     id: 1,
//     title: "Vue.js Basics",
//     author: "John Doe",
//     category: "Web Dev",
//     date: "2025-02-28",
//     content: "Learning Vue.js is fun!",
//     status: "Published",
//   },
//   {
//     id: 2,
//     title: "Advanced PHP",
//     author: "Jane Smith",
//     category: "Backend",
//     date: "2025-02-27",
//     content: "Exploring PHP security best practices.",
//     status: "Draft",
//   },
//   {
//     id: 3,
//     title: "CSS Tricks",
//     author: "Alice Johnson",
//     category: "Frontend",
//     date: "2025-02-26",
//     content: "Making CSS more fun and interactive.",
//     status: "Published",
//   },
//   {
//     id: 4,
//     title: "SEO Tips",
//     author: "Bob Brown",
//     category: "Marketing",
//     date: "2025-02-25",
//     content: "Boost your site ranking with SEO.",
//     status: "Published",
//   },
//   {
//     id: 5,
//     title: "Database Optimization",
//     author: "David Lee",
//     category: "Database",
//     date: "2025-02-24",
//     content: "Indexing and query optimization.",
//     status: "Draft",
//   },
//   {
//     id: 6,
//     title: "RESTful APIs",
//     author: "Charlie Kim",
//     category: "Backend",
//     date: "2025-02-23",
//     content: "Understanding RESTful API design.",
//     status: "Published",
//   },
// ]);

const posts = computed(() => postStore.publishedPosts);

const categories = computed(() => [
  ...new Set(posts.value.map((post) => post.category)),
]);

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage));

const filteredPosts = computed(() => {
  let filtered = posts.value;

  if (searchQuery.value) {
    filtered = filtered.filter((post) => 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((post) => post.category === selectedCategory.value);
  }

  return filtered;
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPosts.value.slice(start, start + itemsPerPage);
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

const openAddPostModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "create";
};

const openEditPostModal = (post) => {
  modalData.value = { ...post };
  showModal.value = true;
  currentModal.value = "edit";
};

const openViewPostModal = (post) => {
  modalData.value = { ...post };
  currentModal.value = "view";
  showModal.value = true;
};

const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this post?")) {
    posts.value = posts.value.filter((post) => post.id !== id);
  }
};

onMounted(async() => {
  await postStore.fetchAllPosts();
  await postStore.getPublishedPosts();
});
</script>


<template>

<Alert
    :message="postStore.alertMessage"
    :type="postStore.alertType"
    :show="postStore.showAlert"
    @close="postStore.showAlert = false"
  />

  <div class="card p-3 border border-1 border-primary">
    <h2 class="mb-3">Published Post</h2>

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
            placeholder="Search posts..."
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
                @change="filterPosts"
                aria-label="Filter by Category"
              >
                <option value="">All Categories</option>
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
            <button class="btn btn-primary" @click="openAddPostModal">
              <i class="bi bi-plus-circle"></i> New Post
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Posts Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr class="fw-bold">
            <th class="fw-bold">Title</th>
            <th class="fw-bold">Category</th>
            <th class="fw-bold">Status</th>
            <th class="fw-bold">Date</th>
            <th class="fw-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in paginatedPosts" :key="post.id">
            <td>{{ post.title }}</td>
            <td>{{ post.category }}</td>
            <td>
              <span
                class="badge"
                :class="post.post_status_name === 'Published' ? 'bg-success' : 'bg-info'"
                >{{ post.post_status_name }}</span
              >
            </td>
            <td>{{ post.created_at }}</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="openViewPostModal(post)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-outline-success btn-sm me-1"
                  @click="openEditPostModal(post)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(post.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedPosts.length === 0">
            <td colspan="5" class="text-center">
              <i class="bi bi-exclamation-circle me-2"></i> No post(s) available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginatedPosts.length > 0" class="d-flex justify-content-between align-items-center mt-3">
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
    <CreatePost
      v-if="(currentModal === 'create' || currentModal === 'edit') && showModal"
      :post="modalData"
      @close="closeModal"
    />
    <ReadPost
      v-if="currentModal === 'view' && showModal"
      :post="modalData"
      @close="closeModal"
    />
  </div>
</template>

<style scoped></style>

<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, onMounted } from "vue";
import ReadPost from "./modals/ReadPost.vue";
import CreatePost from "./modals/CreatePost.vue";
import Alert from "@/components/Alert.vue";
import { usePostStore } from "@/stores/post";
import { useDashboardStore } from "@/stores/dashboard";

const store = useDashboardStore();
// const { bet_ } = storeToRefs(store)

const postStore = usePostStore();
const currentPage = ref(1);
const itemsPerPage = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

const posts = computed(() => postStore.posts);

const categories = computed(() => [
  ...new Set(posts.value.map((post) => post.category)),
]);

const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / itemsPerPage)
);

const filteredPosts = computed(() => {
  let filtered = posts.value;

  if (searchQuery.value) {
    filtered = filtered.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (post) => post.category === selectedCategory.value
    );
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

const all_bets = ref([]);

onMounted(() => {
  const betsData = sessionStorage.getItem("bet_info");
  if (betsData) {
    try {
      const parsedData = JSON.parse(betsData);
      all_bets.value = parsedData.createbets || [];
    } catch (error) {
      console.error("Invalid", error);
    }
  }
});



const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

const filteredBets = computed(() => {
  let filtered = all_bets.value;

  if (searchQuery.value) {
    filtered = filtered.filter((bet) =>
      bet.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (bet) => bet.category === selectedCategory.value
    );
  }

  return filtered;
});

//Only open bets
const postponedBets = computed(() => {
  return all_bets.value.filter((bet) => bet.status === "suspended");
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
    <h2 class="mb-3">All Suspended Bets</h2>

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
                <option value="">All bets</option>
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
            <th class="fw-bold">Bet ID</th>
            <th class="fw-bold">Game Type</th>
            <th class="fw-bold">Status</th>
            <th class="fw-bold">Created at</th>
            <th class="fw-bold">Closed at</th>
            <th class="fw-bold">Stake</th>
            <th class="fw-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bet, index) in postponedBets" :key="index">
            <td>{{ bet.bet_id }}</td>
            <td>{{ bet.title }}</td>
            <td>
              <span class="badge bg-success">{{ bet.status }}</span>
            </td>

            <td>{{ formatDateTime(bet.created_at) }}</td>
            <td>{{ formatDateTime(bet.closed_at) }}</td>

            <td>
              <span class="badge bg-primary">{{ bet.total_stake }}</span>
            </td>
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
          <tr v-if="postponedBets.length === 0">
            <td colspan="5" class="text-center">
              <i class="bi bi-exclamation-circle me-2"></i>
              No post(s) available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="paginatedPosts.length > 0"
      class="d-flex justify-content-between align-items-center mt-3"
    >
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

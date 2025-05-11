<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from "vue";
import PieChart from "@/components/PieChart.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";
import { useDashboardStore } from "@/stores/dashboard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const store = useDashboardStore();

const { allbets,bets } = storeToRefs(store)
console.log("all",allbets.value)


const stats = ref({
  totalPosts: 120,
  totalComments: 500,
  totalUsers: 25,
  totalViews: 8500,
});


const recentComments = ref([
  { id: 1, user: "Mike", post: "Vue.js 3: The Future", date: "2025-02-25" },
  { id: 2, user: "Emily", post: "Bootstrap vs Tailwind", date: "2025-02-24" },
  { id: 3, user: "David", post: "SEO Best Practices", date: "2025-02-23" },
]);

const chartData = ref({
  posts: {
    labels: ["Tech", "Design", "Marketing", "Finance", "Health"],
    datasets: [
      {
        label: "Posts per category",
        data: [30, 25, 20, 15, 10],
        backgroundColor: "#5d6acc",
      },
    ],
  },
  monthly: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Posts Per Month",
        data: [105, 300, 200, 150, 120, 250, 175, 320, 280, 190, 250, 295],
        borderColor: "#4d9abc",
      },
    ],
  },
});

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + ".." : text;
};

const getTimeAgo = (dateString) => {
  return dayjs(dateString).fromNow();
};

onMounted(() => {
  // store.fetchTotalUsers();
  // store.fetchTotalPosts();
  // store.fetchRecentPosts();
   store.getAllPostedBets();
});
</script>

<template>
  <div class="card p-3 border border-1 border-primary">
    <!-- Page Title -->
    <h2 class="mb-3">Overall Stats</h2>

    <!-- Stats Overview -->
    <div class="row g-3">
      <div class="col-md-3">
        <div class="card bg-primary text-white shadow">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-journals fs-3 me-3"></i>
              <div>
                <h5>Total Posted Bets</h5>
                <h2>{{bets}}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white shadow">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-chat-left-text fs-3 me-3"></i>
              <div>
                <h5>Total Bets</h5>
                <h2>{{ stats.totalComments }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-secondary text-white shadow">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-person fs-3 me-3"></i>
              <div>
                <h5>Total Bet Users</h5>
                <h2>{{ store.totalUsers }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-info text-white shadow">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-eye fs-3 me-3"></i>
              <div>
                <h5>Amount Gained</h5>
                <h2>{{ stats.totalViews }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row mt-4">
      <div class="col-md-6">
        <BarChart :data="chartData.posts" title="Posts Per Category" />
      </div>
      <div class="col-md-6">
        <LineChart :data="chartData.monthly" title="Posts per Month" />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="row g-3 mt-4">
      <div class="col-md-6">
        <div class="card shadow border border-1 border-primary">
          <div class="card-header text-primary fw-bold">Recent Posts</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="post in store.recentPosts"
              :key="post.id"
              class="list-group-item d-flex justify-content-between"
            >
              <span
                >{{ truncateText(post.title, 45) }} -
                <small class="text-muted">{{ post.writer }}</small></span
              >
              <small class="text-primary">{{ getTimeAgo(post.created_at) }}</small>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow border border-1 border-success">
          <div class="card-header text-success fw-bold">Recent Comments</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="comment in recentComments"
              :key="comment.id"
              class="list-group-item d-flex justify-content-between"
            >
              <span
                >{{ comment.user }} commented on <b>{{ comment.post }}</b></span
              >
              <small class="text-success">{{ getTimeAgo(comment.date) }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

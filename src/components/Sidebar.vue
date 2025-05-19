<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia'

defineProps(["isSidebarOpen", "onCloseSidebar"]);

const activeDropdown = ref(null);
const router = useRouter();
const isAdmin = ref(false);

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

onMounted(() => {
  //   userStore.fetchLoggedInUser();
  //   if (userStore.username === "admin") {
  //     isAdmin.value = true;
  //   }
});
</script>

<template>
  <aside
    class="sidebar d-flex flex-column bg-primary text-white vh-100 fs-5 p-2"
    :class="{ 'sidebar-hidden': !isSidebarOpen }"
  >
    <!-- Close Button for Small Screens -->
    <button
      class="btn btn-light text-primary align-self-end d-lg-none"
      @click="onCloseSidebar"
    >
      <i class="bi bi-x-lg"></i>
    </button>

    <ul class="nav flex-column mt-3">
      <li class="nav-item fs-3 ms-4 mb-3 fw-bold" id="logo">The.Bet<span id="mark" class="fw-bold">&trade; Panel</span></li>
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/dashboard">
          <i class="bi bi-graph-up-arrow me-2"></i> Dashboard
        </router-link>
      </li>
      <li><hr class="bg-light" /></li>

      <!-- Posts Dropdown -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('posts')"
        >
          <span> <i class="bi bi-journals me-2"></i>Bet Posts </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'posts' ? 'bi-chevron-up' : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul v-if="activeDropdown === 'posts'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/posts">
              All Posts
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/published">
             Open Bets
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/closed">
             Closed Bets
            </router-link>
          </li>

          <li>
            <router-link class="nav-link text-white" to="/postPonedPost">
             Postponed Bets
            </router-link>
          </li>

           <li>
            <router-link class="nav-link text-white" to="/suspendedPost">
             Suspended Bets
            </router-link>
          </li>
        </ul>
      </li>
      <li><hr class="bg-light" /></li>

      <!-- Categories Dropdown -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('categories')"
        >
          <span> <i class="bi bi-columns-gap me-2"></i> Bets </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'categories' ? 'bi-chevron-up' : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul v-if="activeDropdown === 'categories'" class="nav flex-column bg-secondary ms-3">
          <li>
            <router-link class="nav-link text-white" to="/categories">
              All bets
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/categories">
              won
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/categories">
             lost
            </router-link>
          </li>  
          
           <li>
            <router-link class="nav-link text-white" to="/categories">
             Draw
            </router-link>
          </li> 
        </ul>
      </li>

      <li><hr class="bg-light" /></li>

      <!-- Users Dropdown -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('users')"
        >
          <span> <i class="bi bi-people me-2"></i> Users </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'users' ? 'bi-chevron-up' : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul v-if="activeDropdown === 'users'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/users">
              All Users
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
#logo {
  font-family: "UnifrakturCook", cursive;
  font-weight: 700;
  font-size: 1.5rem;
}

#mark {
  font-family: "Saira", sans-serif;
}

.sidebar {
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1050;
  transition: transform 0.3s ease-in-out;
}
.sidebar-hidden {
  transform: translateX(-100%);
}
.nav-link:hover {
  background-color: #30a2ee;
}
</style>

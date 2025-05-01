<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show"
      tabindex="-1"
      aria-labelledby="postModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Header Section -->
          <div class="modal-header bg-primary text-white">
            <h3 class="modal-title text-capitalize" id="postModalLabel">
              <i class="bi bi-person-check me-2"></i>
              User details
            </h3>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Body Section -->
          <div class="modal-body fs-5">
            <div class="row text-secondary">
              <!-- ID, user, Author, Status -->
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">First Name</p>
                <p class="text-dark fw-bold">{{ props.user.first_name }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Last Name</p>
                <p class="text-dark fw-bold">{{ props.user.last_name }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Username</p>
                <p class="text-dark fw-bold">{{ props.user.username }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Status</p>
                <p class="text-dark fw-bold text-uppercase">
                  <span
                    class="badge"
                    :class="
                      props.user.status_name === 'Active'
                        ? 'bg-success'
                        : 'bg-info'
                    "
                    >{{ props.user.status_name }}</span
                  >
                </p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Role</p>
                <p class="text-dark fw-bold text-uppercase">
                  <span
                    class="badge"
                    :class="
                      props.user.role  === 'Admin'
                        ? 'bg-dark'
                        : 'bg-primary'
                    "
                    >{{ props.user.role }}</span
                  >
                </p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Posts</p>
                <p class="text-dark fw-bold">{{ props.user.post_count }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Added on</p>
                <p class="text-dark fw-bold">{{ props.user.date_joined }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>

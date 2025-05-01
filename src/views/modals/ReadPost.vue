<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  post: {
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
              <i class="bi bi-journal-text me-2"></i>
              Post ID: {{ props.post.post_id }}
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
              <!-- ID, Category, Author, Status -->
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Status</p>
                <p class="text-dark fw-bold text-uppercase">
                  <span
                    class="badge"
                    :class="
                      props.post.post_status_name === 'Published'
                        ? 'bg-success'
                        : 'bg-info'
                    "
                    >{{ props.post.post_status_name }}</span
                  >
                </p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Category</p>
                <p class="text-dark fw-bold">{{ props.post.category }}</p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Writer</p>
                <p class="text-dark fw-bold">{{ props.post.writer }}</p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Written</p>
                <p class="text-dark fw-bold">{{ props.post.created_at }}</p>
              </div>
            </div>

            <!-- Content Section -->
            <div class="row">
              <div class="col-12">
                <div class="card bg-light p-2 border border-1 border-primary">
                  <div class="card-header">
                    <p class="mb-1 text-primary fw-bold text-uppercase">{{ props.post.title }}</p>
                  </div>
                  
                   <div class="card-content">
                    <p
                    v-for="paragraph in props.post.content.split('\n')"
                    :key="paragraph"
                  >
                    {{ paragraph }}
                  </p>
                   </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>

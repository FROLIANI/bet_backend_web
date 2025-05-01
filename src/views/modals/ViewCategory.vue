<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  category: {
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
              <i class="bi bi-bookmark-check me-1"></i>
              Category Details
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
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Name</p>
                <p class="text-dark fw-bold">{{ props.category.category_name }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Status</p>
                <p class="text-dark fw-bold text-uppercase">
                  <span
                    class="badge"
                    :class="
                      props.category.category_status_name === 'Active'
                        ? 'bg-success'
                        : 'bg-info'
                    "
                    >{{ props.category.category_status_name }}</span
                  >
                </p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Posts related</p>
                <p class="text-dark fw-bold">{{ props.category.post_count }}</p>
              </div>
              <div class="col-md-4 mb-1">
                <p class="mb-1 text-muted small">Added on</p>
                <p class="text-dark fw-bold">
                  {{ props.category.category_inserted }}
                </p>
              </div>
            </div>

            <!-- Content Section -->
            <div class="row">
              <div class="col-12">
                <div class="card bg-light p-2 border border-1 border-primary">
                  <p class="mb-1 text-muted small">Description</p>
                  <p class="text-dark mb-0">
                    {{ props.category.description }}
                  </p>
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

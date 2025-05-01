<script setup>
import { useField, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import * as yup from "yup";
import { useCategoryStore } from "@/stores/category";

const categoryStore = useCategoryStore();
const props = defineProps({
  category: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);
const statuses = ref(["Active", "Inactive"]);

const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup
      .string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters long"),
    description: yup
      .string()
      .required("Description is required")
      .min(20, "Description must be at least 20 characters long"),
    status: yup
      .string()
      .required("Status is required")
      .oneOf(
        ["Active", "Inactive"],
        "Status must be either 'Active' or 'Inactive'"
      ),
  }),
});

// Bind form fields to Vee-Validate
const { value: name, errorMessage: nameError } = useField("name");
const { value: description, errorMessage: descriptionError } = useField("description");
const { value: status, errorMessage: statusError } = useField("status");

onMounted(async () => {
  if (props.category) {
    resetForm({
      values: {
        name: props.category.category_name,
        description: props.category.category_description,
        status: props.category.category_status_name,
      },
    });
  }
});

// Handle form submission
const saveCategory = handleSubmit(async (values) => {
  const categoryData = {
    id: props.category?.category_id || null,
    name: values.name,
    description: values.description,
    status: values.status,
  };
  console.log("Category details", categoryData);

  try {
    if (props.category) {
      await categoryStore.editCategory(categoryData);
    } else {
      await categoryStore.addNewCategory(categoryData);
    }
    await categoryStore.fetchAllCategories();
    emit("close");
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

const closeModal = () => {
  emit("close");
};
</script>


<template>
  <teleport to="body">
    <div
      class="modal fade show"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header bg-primary text-white">
            <h3 class="modal-title">
              <i
                class="bi"
                :class="category ? 'bi-bookmark-plus-fill' : 'bi-bookmark-plus'"
              ></i>
              {{ category ? "Edit Category" : "Add New Category" }}
            </h3>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body fs-5">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  type="text"
                  v-model="name"
                  class="form-control"
                  :class="{ 'is-invalid': nameError }"
                />
                <div v-if="nameError" class="invalid-feedback">
                  {{ nameError }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="description"
                  class="form-control"
                  rows="3"
                  :class="{ 'is-invalid': descriptionError }"
                ></textarea>
                <div v-if="descriptionError" class="invalid-feedback">
                  {{ descriptionError }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Status</label>
                <select
                  v-model="status"
                  class="form-select"
                  :class="{ 'is-invalid': statusError }"
                >
                  <option value="" disabled>Select a status</option>
                  <option
                    v-for="stat in statuses"
                    :key="stat"
                    :value="stat"
                  >
                    {{ stat }}
                  </option>
                </select>
                <div v-if="statusError" class="invalid-feedback">
                  {{ statusError }}
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="saveCategory">
              <i class="bi bi-send-check"></i>
              {{ category ? "Save Changes" : "Add Category" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>


<style scoped></style>

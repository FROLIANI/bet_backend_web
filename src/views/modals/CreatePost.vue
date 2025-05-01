<script setup>
import { useField, useForm } from "vee-validate";
import { onMounted, ref, computed } from "vue";
import * as yup from "yup";
import { usePostStore } from "@/stores/post";
import { useCategoryStore } from "@/stores/category";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const categoryStore = useCategoryStore();
const postStore = usePostStore();
const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);
const statuses = ref(["Published", "Drafted"]);
const categories = computed(() => categoryStore.categories);
const imagePreview = ref(null);
const imageError = ref("");

const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    // image: yup
    //   .mixed()
    //   .test("fileSize", "Image size should not exceed 2MB", (value) => {
    //     return value ? value.size <= 2 * 1024 * 1024 : true;
    //   })
    //   .test("fileType", "Only image files are allowed", (value) => {
    //     return value
    //       ? ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
    //           value.type
    //         )
    //       : true;
    //   })
    //   .required("Image is required"),
    title: yup
      .string()
      .required("Title is required")
      .min(12, "Title must be at least 12 characters long"),
    content: yup
      .string()
      .required("Content is required")
      .min(200, "Content must be at least 200 characters long"),
    summary: yup
      .string()
      .required("Summary is required")
      .min(150, "Summary must be at least 150 characters long"),
    category: yup.string().required("Category is required"),
    status: yup
      .string()
      .required("Status is required")
      .oneOf(
        ["Published", "Drafted"],
        "Status must be either 'Published' or 'Drafted'"
      ),
  }),
});

// Bind form fields to Vee-Validate
const { value: image } = useField("image");
const { value: category, errorMessage: categoryError } = useField("category");
const { value: status, errorMessage: statusError } = useField("status");
const { value: title, errorMessage: titleError } = useField("title");
const { value: summary, errorMessage: summaryError } = useField("summary");
const { value: content, errorMessage: contentError } = useField("content");

const onImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      imageError.value = "Invalid file type. Please upload an image.";
      return;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      imageError.value = "File size exceeds 2MB.";
      return;
    }

    // Set preview and value
    imageError.value = "";
    imagePreview.value = URL.createObjectURL(file);
    image.value = file;
  }
};

onMounted(() => {
  categoryStore.fetchAllCategories();
  if (props.post) {
    resetForm({
      values: {
        title: props.post.title,
        summary: props.post.summary,
        content: props.post.content,
        category: props.post.category,
        status: props.post.post_status_name,
      },
    });
  }
});

// Handle form submission
const savePost = handleSubmit(async (values) => {
  const postData = {
    id: props.post?.post_id || null,
    image: values.image,
    title: values.title,
    user_id: userStore.userId,
    content: values.content,
    summary: values.summary,
    category_id: values.category,
    status: values.status,
  };
  try {
    if (props.post) {
      await postStore.editPost(postData);
    } else {
      await postStore.writeNewPost(postData);
    }
    await postStore.fetchAllPosts();
    emit("close");
  } catch (error) {
    console.error("Error saving post:", error);
  }
  // console.log("Post details", postData);
  emit("close");
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
                :class="post ? 'bi-journal-arrow-up' : 'bi-journal-plus'"
              ></i>
              {{ post ? "Edit Post" : "Add New Post" }}
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
            <form @submit.prevent="savePost">
              <div class="mb-2 text-center">
                <!-- Circle Image Preview -->
                <div class="profile-image-wrapper">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    class="profile-image"
                    alt="Profile Preview"
                  />
                  <img
                    v-else
                    src="/images/images.png?url"
                    class="profile-image"
                    alt="Default Profile"
                  />
                  <!-- Hidden Input -->
                  <input
                    type="file"
                    class="file-input"
                    @change="onImageChange"
                    accept="image/*"
                  />
                </div>

                <!-- Validation Error -->
                <div v-if="imageError" class="invalid-feedback">
                  {{ imageError }}
                </div>
              </div>

              <div class="row g-3 mt-2">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Written by</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="userStore.username"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select
                      v-model="category"
                      class="form-select"
                      :class="{ 'is-invalid': categoryError }"
                    >
                      <option value="" disabled>Select a category</option>
                      <option
                        v-for="cat in categories"
                        :key="cat.category_id"
                        :value="cat.category_id"
                      >
                        {{ cat.category_name }}
                      </option>
                    </select>
                    <div v-if="categoryError" class="invalid-feedback">
                      {{ categoryError }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
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
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  type="text"
                  v-model="title"
                  class="form-control"
                  :class="{ 'is-invalid': titleError }"
                />
                <div v-if="titleError" class="invalid-feedback">
                  {{ titleError }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Summary</label>
                <textarea
                  v-model="summary"
                  class="form-control"
                  rows="2"
                  :class="{ 'is-invalid': summaryError }"
                ></textarea>
                <div v-if="summaryError" class="invalid-feedback">
                  {{ summaryError }}
                </div>
              </div>

              <div class="mb-1">
                <label class="form-label">Content</label>
                <textarea
                  v-model="content"
                  class="form-control"
                  rows="4"
                  :class="{ 'is-invalid': contentError }"
                ></textarea>
                <div v-if="contentError" class="invalid-feedback">
                  {{ contentError }}
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="savePost">
              <i class="bi bi-send-check"></i>
              {{ post ? "Save Changes" : "Add Post" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.profile-image-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #0d6efd;
  border-radius: 8px;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>

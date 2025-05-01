<script setup>
import { useField, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import * as yup from "yup";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);
const roles = ref(["Admin", "Author", "User"]);
const statuses = ref(["Active", "Inactive"]);
const imagePreview = ref(null);
const profileImageError = ref("");

const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    firstName: yup
      .string()
      .required("First Name is required")
      .min(3, "First Name must be at least 3 characters"),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(3, "Last Name must be at least 3 characters"),
    username: yup
      .string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters"),
      password: props.user
      ? yup.string().min(8, "Password must be at least 8 characters")
      : yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    role: yup.string().required("Role is required"),
    status: yup.string().required("Status is required"),
  }),
});

const { value: profileImage } = useField("profileImage");
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: role, errorMessage: roleError } = useField("role");
const { value: status, errorMessage: statusError } = useField("status");

const onImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      profileImageError.value = "Only image files are allowed";
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      profileImageError.value = "Image size should not exceed 2MB";
      return;
    }

    profileImageError.value = "";
    profileImage.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};



const saveUser = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append("id", props.user?.id || "");
  formData.append("first_name", values.firstName);
  formData.append("last_name", values.lastName);
  formData.append("username", values.username);
  formData.append("role", values.role);
  formData.append("status", values.status);

  // Append password only if it's provided
  if (!props.user || values.password) {
    formData.append("password", values.password);
  }

  // Append the image only if it's selected
  if (profileImage.value instanceof File) {
    formData.append("profile_image", profileImage.value);
  }

  try {
    if (props.user) {
      await userStore.updateUser(formData);
    } else {
      await userStore.createUser(formData);
    }
    await userStore.fetchUsers();
    emit("close");
  } catch (error) {
    console.error("Error saving user:", error);
  }
});

const closeModal = () => {
  emit("close");
};

onMounted(() => {
  userStore.fetchUsers();

  if (props.user) {
    resetForm({
      values: {
        profileImage: props.user.profileImage,
        firstName: props.user.first_name,
        lastName: props.user.last_name,
        username: props.user.username,
        password: props.user.password,
        role: props.user.role,
        status: props.user.status_name,
      },
    });

    // Set image preview if editing an existing user with a profile image
    if (props.user.profileImage) {
      imagePreview.value = props.user.profileImage;
    }
  }
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h3 class="modal-title">
              <i
                class="bi"
                :class="user ? 'bi-person-plus-fill' : 'bi-person-plus'"
              ></i>
              {{ user ? "Edit User" : "Add New User" }}
            </h3>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body fs-5">
            <form @submit.prevent="saveUser" enctype="multipart/form-data">
              <div class="mb-3 text-center">
                <div class="profile-image-wrapper">
                  <img
                    v-if="imagePreview"
                    ref="fileInput"
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

                  <input
                    type="file"
                    name="profileImage"
                    class="file-input"
                    @change="onImageChange"
                    accept="image/*"
                  />
                </div>

                <div v-if="profileImageError" class="invalid-feedback">
                  {{ profileImageError }}
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">First Name</label>
                    <input
                      type="text"
                      v-model="firstName"
                      class="form-control"
                      :class="{ 'is-invalid': firstNameError }"
                    />
                    <div v-if="firstNameError" class="invalid-feedback">
                      {{ firstNameError }}
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Last Name</label>
                    <input
                      type="text"
                      v-model="lastName"
                      class="form-control"
                      :class="{ 'is-invalid': lastNameError }"
                    />
                    <div v-if="lastNameError" class="invalid-feedback">
                      {{ lastNameError }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input
                      type="text"
                      v-model="username"
                      class="form-control"
                      :class="{ 'is-invalid': usernameError }"
                    />
                    <div v-if="usernameError" class="invalid-feedback">
                      {{ usernameError }}
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input
                      type="password"
                      v-model="password"
                      class="form-control"
                      :class="{ 'is-invalid': passwordError }"
                    />
                    <div v-if="passwordError" class="invalid-feedback">
                      {{ passwordError }}
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Role</label>
                    <select
                      v-model="role"
                      class="form-select"
                      :class="{ 'is-invalid': roleError }"
                    >
                      <option value="" disabled>Select a role</option>
                      <option v-for="r in roles" :key="r" :value="r">
                        {{ r }}
                      </option>
                    </select>
                    <div v-if="roleError" class="invalid-feedback">
                      {{ roleError }}
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select
                      v-model="status"
                      class="form-select"
                      :class="{ 'is-invalid': statusError }"
                    >
                      <option value="" disabled>Select a role</option>
                      <option v-for="s in statuses" :key="s" :value="s">
                        {{ s }}
                      </option>
                    </select>
                    <div v-if="statusError" class="invalid-feedback">
                      {{ statusError }}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="saveUser">
              <i class="bi bi-save"></i>
              {{ user ? "Save Changes" : "Add User" }}
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
  width: 145px;
  height: 145px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d6efd;
  opacity: 0.8;
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



<!-- // const saveUser = handleSubmit(async (values) => {
  //   const userData = {
  //     id: props.user?.id || null,
  //     profile_image: values.profileImage,
  //     first_name: values.firstName,
  //     last_name: values.lastName,
  //     username: values.username,
  //     password: values.password,
  //     role: values.role,
  //     status: values.status,
  //   };
  
  //   if (props.user) {
  //     await userStore.updateUser(userData);
  //   } else {
  //     await userStore.createUser(userData);
  //   }
  
  //   emit("close");
  // }); -->
  
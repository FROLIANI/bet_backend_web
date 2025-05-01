<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import Alert from "@/components/Alert.vue";
import dataService from "@/services/dataService";

const router = useRouter();
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("danger");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Forgot Password Placeholder
const forgotPassword = () => {
  alertMessage.value = "Forgot password functionality is under construction.";
  alertType.value = "info";
  showAlert.value = true;
};

// Vee-Validate Schema
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

// Vee-Validate Form and Fields
const { handleSubmit } = useForm({
  validationSchema,
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

// Handle Form Submission
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await dataService.login({
      username: values.username,
      password: values.password,
    });

    if (response.data.success) {
      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ username: values.username, id: response.data.id, firstName: response.data.name })
      );
        router.push("/dashboard");
    } else {
      alertMessage.value = response.data.error || "Invalid credentials";
      alertType.value = "danger";
      showAlert.value = true;
    }
  } catch (error) {
    console.error("Login request failed:", error);
    alertMessage.value = "An error occurred. Please try again later.";
    alertType.value = "danger";
    showAlert.value = true;
  }
});
</script>

<template>
  <Alert
    :message="alertMessage"
    :type="alertType"
    :show="showAlert"
    @close="showAlert = false"
  />
  <div
    class="d-flex justify-content-center align-items-center vh-100"
    style="
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.7),
          rgba(35, 110, 230, 0.7)
        ),
        url('/images/news-bg.jpg');
      background-size: cover;
      background-position: center;
    "
  >
    <div
      class="card shadow-lg text-primary"
      style="width: 550px; background-color: rgba(240, 240, 240, 0.8)"
    >
      <div class="card-header text-center">
        <h2 id="logo">The.Blog<span id="mark" class="fw-bold">&trade; Panel</span></h2>
      </div>
      <div class="card-body fs-5">
        <form @submit.prevent="onSubmit">
          <!-- Username Field -->
          <div class="mb-3">
            <label for="username" class="form-label text-primary">
              <i class="bi bi-person me-2"></i>Username
            </label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="form-control form-control-lg"
              :class="{ 'is-invalid': usernameError }"
              style="background-color: rgba(25, 25, 25, 0.3)"
            />
            <div v-if="usernameError" class="text-danger mt-1">
              {{ usernameError }}
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-3">
            <label for="password" class="form-label text-primary">
              <i class="bi bi-key me-2"></i>Password
            </label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-control form-control-lg"
                :class="{ 'is-invalid': passwordError }"
                style="background-color: rgba(25, 25, 25, 0.3)"
              />
              <button
                type="button"
                class="btn btn-primary"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="passwordError" class="text-danger mt-1">
              {{ passwordError }}
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="d-flex justify-content-end mb-3">
            <a
              href="#"
              @click.prevent="forgotPassword"
              class="text-decoration-none text-primary"
              >Forgot Password?</a
            >
          </div>

          <!-- Login Button -->
          <button type="submit" class="btn btn-primary fs-5 w-100 shadow">
            <i class="bi bi-box-arrow-in-right me-2"></i> Login
          </button>
        </form>
        <p class="text-center text-primary mt-4 fs-6 fw-bold">
          Powered by: <br />
          <img
            src="/images/rahisi.png?url"
            alt="Company Logo"
            class="img-fluid"
            style="height: 27px"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 20px;
}

#logo {
  font-family: "UnifrakturCook", cursive;
  font-weight: 700;
}

#mark {
  font-family: "Saira", sans-serif;
}
</style>

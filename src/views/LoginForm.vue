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
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Vee-Validate Form and Fields
const { handleSubmit } = useForm({
  validationSchema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

// Handle Form Submission
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await dataService.login({
      email: values.email,
      password: values.password,
    });

    console.log("Login response:", response);

    let code = response.data.code;
    console.log("Code:", code);
    let message = response.data.message;
    console.log("Message:", message);

    if (code === 200) {
      const superAdmin = response.data.superAdmin;

      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem(
        "superAdmin",
        JSON.stringify({
          email: superAdmin.email,
          full_name: superAdmin.full_name,
          mobile: superAdmin.phone_number,
          role: superAdmin.role,
          token: response.data.token,
        })
      );
      router.push("/dashboard");
    } else {
      alertMessage.value = message;
      alertType.value = "danger";
      showAlert.value = true;
    }
  } catch (error) {
    alertMessage.value = error.response?.data?.message ;
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
        <h2 id="logo">
          The.Blog<span id="mark" class="fw-bold">&trade; Panel</span>
        </h2>
      </div>
      <div class="card-body fs-5">
        <form @submit.prevent="onSubmit">
          <!-- Email Field -->
          <div class="mb-3">
            <label for="email" class="form-label text-primary">
              <i class="bi bi-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control form-control-lg"
              :class="{ 'is-invalid': emailError }"
              style="background-color: rgba(25, 25, 25, 0.3)"
            />
            <div v-if="emailError" class="text-danger mt-1">
              {{ emailError }}
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

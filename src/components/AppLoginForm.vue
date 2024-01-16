<template>
  <!-- Login Form -->
  <div
    v-if="loginStatus.showAlert"
    class="text-white text-center font-bold p-4 rounded mb-4 transition"
    :class="loginStatus.alertVariant"
  >
    {{ loginStatus.alertMessage }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        autocomplete="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message class="text-red-600 text-sm" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-6">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        autocomplete="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <error-message class="text-red-600 text-sm" name="password" />
    </div>
    <button
      :disabled="loginStatus.inProgress"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Login
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "AppLoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required",
      },
      loginStatus: {
        inProgress: false,
        showAlert: false,
        alertVariant: "bg-blue-500",
        alertMessage: "Logging in...",
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      authenticate: "login",
    }),
    async login(values) {
      this.loginStatus = {
        inProgress: true,
        showAlert: true,
        alertVariant: "bg-blue-500",
        alertMessage: "Logging in...",
      };

      try {
        await this.authenticate(values);
      } catch (error) {
        this.loginStatus = {
          inProgress: false,
          showAlert: true,
          alertVariant: "bg-red-500",
          alertMessage: "Something went wrong! Please try again later.",
        };
        console.error(error);
        return;
      }

      this.loginStatus = {
        inProgress: true,
        showAlert: true,
        alertVariant: "bg-green-500",
        alertMessage: "Success! You are now logged in!",
      };

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  },
};
</script>

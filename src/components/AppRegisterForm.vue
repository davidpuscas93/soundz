<template>
  <!-- Registration Form -->
  <div
    v-if="registration.showAlert"
    class="text-white text-center font-bold p-4 rounded mb-4 transition"
    :class="registration.alertVariant"
  >
    {{ registration.alertMessage }}
  </div>
  <vee-form
    :validation-schema="registerSchema"
    @submit="register"
    :initial-values="initialUserData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        type="text"
        autocomplete="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <error-message class="text-red-600 text-sm" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        autocomplete="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <error-message class="text-red-600 text-sm" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          autocomplete="off"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600 text-sm" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirmPassword"
        autocomplete="off"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <error-message class="text-red-600 text-sm" name="confirmPassword" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        name="country"
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
      </vee-field>
      <error-message class="text-red-600 text-sm" name="country" />
    </div>
    <!-- Artist or Listener -->
    <div class="mb-3">
      <label class="inline-block mb-2">Artist or Listener</label>
      <vee-field
        name="artistOrListener"
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Artist">Artist</option>
        <option value="Listener">Listener</option>
      </vee-field>
      <error-message class="text-red-600 text-sm" name="artistOrListener" />
    </div>
    <!-- TOS -->
    <div class="pl-6 mt-6">
      <i18n-t class="inline-block" keypath="register.accept" tag="label">
        <a href="#">
          {{ $t("register.tos") }}
        </a>
      </i18n-t>
      <vee-field
        name="tos"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        value="1"
      />
    </div>
    <div class="mb-6">
      <error-message class="text-red-600 text-sm" name="tos" />
    </div>
    <button
      :disabled="registration.inProgress"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Register
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "RegisterForm",
  data() {
    return {
      registerSchema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|max:100|email",
        age: "required|min_value:18|max_value:130",
        password: "required|min:9|max:100|excluded:password",
        confirmPassword: "passwords_mismatch:@password",
        country: "required|country_excluded:France",
        tos: "tos",
      },
      initialUserData: {
        country: "Germany",
        artistOrListener: "Artist",
      },
      registration: {
        inProgress: false,
        showAlert: false,
        alertVariant: "bg-blue-500",
        alertMessage: "Please wait! Your account is being created.",
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),
    async register(values) {
      this.registration = {
        inProgress: true,
        showAlert: true,
        alertVariant: "bg-blue-500",
        alertMessage: "Please wait! Your account is being created.",
      };

      try {
        await this.createUser(values);
      } catch (error) {
        this.registration = {
          inProgress: false,
          showAlert: true,
          alertVariant: "bg-red-500",
          alertMessage: "Something went wrong! Please try again later.",
        };
        console.error(error);
        return;
      }

      this.registration = {
        inProgress: true,
        showAlert: true,
        alertVariant: "bg-green-500",
        alertMessage: "Your account has been created successfully.",
      };

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  },
};
</script>

<template>
  <div
    class="container mx-auto pt-5 px-3 sm:px-10 mb-32 flex flex-col justify-center items-center"
  >
    <div class="w-full sm:w-1/4 mx-auto relative h-48">
      <div class="absolute left-0 right-0">
        <img class="w-full" :src="login_img" alt="login_img" />
      </div>
      <div class="absolute left-0 right-0 top-0 bottom-0 flex">
        <img class="w-1/2 m-auto" :src="logo1337" alt="login_img" />
      </div>
    </div>
    <div class="mt-7" v-if="!$route.query.code">
      <button
        class="rounded-xl bg-green-500 text-white text-xl px-8 py-2 shadow-md hover:shadow-none transition-all"
        :disbled="!!$route.query.code"
        @click="signin"
        :disabled="loading"
      >
        <template v-if="loading">
          <i-fa class="text-white" icon="circle-notch" spin />
          Loading..
        </template>
        <template v-else> Sign in with intra </template>
      </button>
    </div>
  </div>
</template>

<script>
import login_img from "@/assets/login.svg";
import logo_1337 from "@/assets/1337.svg";

export default {
  data() {
    return {
      loading: false,
      login_img: login_img,
      logo1337: logo_1337,
    };
  },
  created() {
    if (this.currentUser) this.$router.push("/");
    if (this.$route.query.code) this.accessData();
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    async signin() {
      this.loading = true;
      if (!this.currentUser)
        window.location.href = import.meta.env.VITE_AUTH_42;
      else login(this.currentUser.user);
      this.loading = false;
      this.$router.push("/");
    },
    async accessData() {
      this.loading = true;
      await this.$store.dispatch("createUser", this.$route.query.code + "");
      this.loading = false;
      this.$router.push("/");
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

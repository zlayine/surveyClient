<template>
  <div
    class="container mx-auto pt-5 px-10 mb-32 flex flex-col justify-center items-center"
  >
    <div class="w-1/3 mx-auto">
      <img class="w-full" :src="login_img" alt="login_img" />
    </div>
    <div class="mt-7" v-if="!$route.query.code">
      <button class="rounded-xl bg-green-500 text-white text-xl px-8 py-2" :disbled="!!$route.query.code" @click="signin">
        Sign in with intra
      </button>
    </div>
  </div>
</template>

<script>
import login_img from "@/assets/login_img.svg";

export default {
  data() {
    return {
      login_img: login_img,
    };
  },
};
</script>

<style>
</style>
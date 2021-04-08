<template>
  <div class="lg:container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <div class="w-full sm:w-1/4 mx-auto">
      <img class="w-full" :src="empty_img" alt="empty image" />
      <div class="text-center mt-2 text-xl">
        No surveys in this corner..
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "@/assets/empty_img.svg";
export default {
  data() {
    return {
      empty_img: emptyImage,
    };
  },
};
</script>

<style>
</style>
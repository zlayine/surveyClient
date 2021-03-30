<template>
  <div class="flex">
    <div
      class="w-1/3 p-3 relative flex flex-col"
      v-for="(name, index) in names"
      :key="index"
    >
      <img
        class="w-auto m-auto object-contain max-h-80 overflow-hidden rounded-lg ring ring-indigo-300 ring-opacity-50 transition-all"
        :src="url_host + name"
        alt="image survey"
      />
      <div class="text-center mt-2">{{ data[index] }} answers</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", "names"],
  data() {
    return {
      url_host: import.meta.env.VITE_API_HOST,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
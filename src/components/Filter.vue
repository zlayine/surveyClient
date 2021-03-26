<template>
  <div class="flex justify-between w-full px-4">
    <h1 class="text-2xl font-bold my-auto">{{ titles[selected] }}</h1>
    <div class="flex justify-center rounded-lg text-lg" role="group">
      <button
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-r-0 border-indigo-500 rounded-l-lg px-4 py-2 mx-0 outline-none focus:shadow-outline transition-all"
        :class="{
          'bg-indigo-500': selected == 0,
          'text-white': selected == 0,
          'text-indigo-500': selected != 0,
        }"
        @click="selected = 0"
      >
        New
      </button>
      <button
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-indigo-500 px-4 py-2 mx-0 outline-none focus:shadow-outline transition-all"
        :class="{
          'bg-indigo-500': selected == 1,
          'text-white': selected == 1,
          'text-indigo-500': selected != 1,
        }"
        @click="selected = 1"
      >
        My Surveys
      </button>
      <button
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-l-0 border-indigo-500 rounded-r-lg px-4 py-2 mx-0 outline-none focus:shadow-outline transition-all"
        :class="{
          'bg-indigo-500': selected == 2,
          'text-white': selected == 2,
          'text-indigo-500': selected != 2,
        }"
        @click="selected = 2"
      >
        Completed
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
  data() {
    return {
      selected: 0,
			titles: ["New Surveys", "My Surveys", "Completed Surveys"]
    };
  },
};
</script>

<style scoped>
</style>
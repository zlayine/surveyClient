<template>
  <div class="flex flex-col-reverse sm:flex-row justify-between w-full px-4">
    <!-- <h1 class="text-lg hidden sm:block sm:text-2xl font-bold my-auto">
      {{ titles[selected] }}
    </h1> -->
    <router-link
      class="text-xl justify-center mt-3 sm:mt-0 flex my-auto sm:px-4 py-2 rounded-xl text-white bg-indigo-500 shadow-lg hover:shadow-none transition-all"
      to="/addsurvey"
    >
      <i-fa class="text-white mr-2 my-auto" icon="plus" />
      <span class=""> Create Survey</span>
    </router-link>
    <div class="flex justify-center rounded-lg text-lg" role="group">
      <button
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-r-0 border-indigo-500 rounded-l-lg px-4 py-1 sm:py-2 mx-0 outline-none focus:shadow-outline transition-all"
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
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-indigo-500 px-4 py-1 sm:py-2 mx-0 outline-none focus:shadow-outline transition-all"
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
        class="focus:outline-none hover:bg-indigo-500 hover:text-white border border-l-0 border-indigo-500 rounded-r-lg px-4 py-1 sm:py-2 mx-0 outline-none focus:shadow-outline transition-all"
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
  props: ["current"],
  emits: ["change"],
  mounted() {
    if (this.current) this.selected = this.filters.indexOf(this.current);
  },
  data() {
    return {
      selected: 0,
      titles: ["New Surveys", "My Surveys", "Completed Surveys"],
      filters: ["new", "mine", "completed"],
    };
  },
  watch: {
    selected(val) {
      this.$emit("change", this.filters[val]);
    },
  },
};
</script>

<style scoped>
</style>
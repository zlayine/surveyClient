<template>
  <div class="w-3/5 mx-auto py-5 px-10 flex flex-row mb-32">
    <div class="flex flex-col p-2 mr-4 bg-white rounded-lg mb-auto shadow-md">
      <div
        class="hover:bg-indigo-300 hover:bg-opacity-50 rounded-lg py-3 px-4 mb-2 text-xl transition-all text-gray-500 cursor-pointer"
        @click="page = 0"
        :class="{ 'bg-indigo-300': page == 0, 'bg-opacity-50': page == 0 }"
      >
        <i-fa icon="list" />
      </div>
      <div
        class="hover:bg-indigo-300 hover:bg-opacity-50 rounded-lg py-3 px-4 text-xl transition-all text-gray-500 cursor-pointer"
        @click="page = 1"
        :class="{ 'bg-indigo-300': page == 1, 'bg-opacity-50': page == 1 }"
      >
        <i-fa icon="cogs" />
      </div>
    </div>
    <div class="main flex-1">
      <create-questions v-show="page == 0" />
      <create-settings v-show="page == 1" />
    </div>
  </div>
</template>

<script>
import CreateQuestions from "../components/CreateQuestions.vue";
import CreateSettings from "../components/CreateSettings.vue";
import CreateOrganization from "../components/CreateOrganization.vue";
export default {
  data() {
    return {
      page: 0,
      show: false,
    };
  },
  components: { CreateQuestions, CreateSettings, CreateOrganization },
};
</script>

<style>
</style>
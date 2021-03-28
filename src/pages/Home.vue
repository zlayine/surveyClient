<template>
  <div class="container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <filter-layout title="Surveys" />
    <div class="flex flex-row justify-between mt-3 flex-wrap">
      <survey-item v-for="item in surveys" :key="item._id" :survey="item" />
    </div>
  </div>
</template>

<script>
import FilterLayout from "@/components/Filter.vue";
import SurveyItem from "../components/SurveyItem.vue";
export default {
  async created() {
    if (!this.surveys.length) await this.$store.dispatch("getSurveys");
  },
  computed: {
    
    surveys() {
      return this.$store.getters.surveys;
    },
  },
  components: {
    FilterLayout,
    SurveyItem,
  },
};
</script>

<style>
</style>
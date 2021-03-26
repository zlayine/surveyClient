<template>
  <div class="container mx-auto pt-5 px-10 mb-32">
    <filter-layout title="Surveys" />
    <div class="flex flex-row justify-between mt-3 flex-wrap">
      <survey-item />
      <survey-item />
      <survey-item />
    </div>
  </div>
</template>

<script>
import FilterLayout from "@/components/Filter.vue";
import SurveyItem from "../components/SurveyItem.vue";
export default {
  components: {
    FilterLayout,
    SurveyItem,
  },
};
</script>

<style>
</style>
<template>
  <div
    class="bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <div class="text-xl">Title</div>
    <div class="text-sm text-gray-700">2 answers</div>
    <pie-chart />
  </div>
  <div
    class="bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <div class="text-xl">Title</div>
    <div class="text-sm text-gray-700">2 answers</div>
    <bar-chart />
  </div>
</template>

<script>
import BarChart from "@/components/Charts/BarChart.vue";
import PieChart from "../components/Charts/PieChart.vue";
export default {
  components: {
    BarChart,
    PieChart,
  },
};
</script>

<style>
</style>
<template>
  <div class="flex justify-center">
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  props: ["data", "names"],
  data() {
    return {
      series: this.data ? this.data : [],
      chartOptions: {
        chart: {
          width: 380,
          type: "pie",
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
        labels: this.names ? this.names : [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
};
</script>

<style>
</style>
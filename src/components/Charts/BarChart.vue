<template>
  <div class="">
    <apexchart
      type="bar"
      height="300"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      series: [
        {
          data: [5, 2],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 300,
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ["Yes", "No"],
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
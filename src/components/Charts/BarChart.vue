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
  props: ["data", "names"],
  data() {
    return {
      series: [
        {
          data: this.data ? this.data : [],
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
          categories: this.names ? this.names : [],
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
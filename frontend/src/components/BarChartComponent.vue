<template>
  <canvas ref="myChart"></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
export default {
  props: {
    label: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
  },
  async mounted() {
    console.log(this.chartData);
    await new Chart(this.$refs.myChart, {
      type: "bar",
      data: {
        labels: this.label,
        datasets: [
          {
            label: "Attendees",
            backgroundColor: "rgba(255, 0, 0, 0.6)",
            data: this.chartData,
          },
        ],
      },
    });
  },
};
</script>
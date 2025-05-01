<script setup>
import { defineProps } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
  PointElement
);

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

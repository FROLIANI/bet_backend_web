<script setup>
import { defineProps } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Filler);

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

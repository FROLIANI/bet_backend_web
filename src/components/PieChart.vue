<script setup>
import { defineProps } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

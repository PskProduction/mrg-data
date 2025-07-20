<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: number;
}>();

const percentText = computed(() => {
  return `${props.value.toFixed(2).replace('.', ',')}%`;
});

const color = computed(() => {
  if (props.value < 40) return '#59C6A5';
  if (props.value < 80) return '#FF782D';
  return '#D9534F';
});
</script>

<template>
  <div class="progress-bar">
    <div
      class="progress-bar__fill"
      :style="{ width: value + '%', backgroundColor: color }"
    ></div>
    <div class="progress-bar__text">
      {{ percentText }}
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100px;
  height: 24px;
  position: relative;
  background-color: #fff;
  border: 1px solid #E4E4E4;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
}

.progress-bar__fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-bar__text {
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  bottom: 0;
  color: #000;
  font-weight: bold;
  z-index: 1;
}
</style>
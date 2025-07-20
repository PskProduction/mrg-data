<script setup lang="ts">
import type {MRGData} from "@/types";
import {ref} from "vue";
import ModalChart from "@/components/ModalChart.vue";
import api from "@/axios.ts";
import ProgressBar from "@/components/ProgressBar.vue";

const data = ref<MRGData[]>([]);
const selectedMRGData = ref<MRGData[]>([])
const isChartModalOpen = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const fetchData = async () => {
  try {
    const response = await api.get('/data');
    data.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  try {
    await api.post(`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    await fetchData();
  } catch (error) {
    console.error(error);
  }
};

const formatNumber = (value: number) => {
  return value.toFixed(2).replace('.', ',');
};

const formatDate = (dateStr: string) => {
  const [, month, year] = dateStr.split('/');
  const months = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

const openChartModal = (mrgName: string) => {
  selectedMRGData.value = data.value.filter(d => d.name === mrgName);
  isChartModalOpen.value = true;
}

const toggleChartModal = () => {
  isChartModalOpen.value = !isChartModalOpen.value;
};

</script>

<template>
  <div class="table__container">
    <button @click="triggerFileInput" class="table__button">Загрузить данные</button>
    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none">

    <table class="table">
      <thead class="table__thead">
      <tr>
        <th class="table__thead-th" rowspan="2">Магистральный распределительный газопровод</th>
        <th class="table__thead-th" colspan="2">Точка подключения</th>
        <th class="table__thead-th" rowspan="2">Период</th>
        <th class="table__thead-th" rowspan="2">Уровень загрузки</th>
        <th class="table__thead-th" rowspan="2">Факт. среднесут. расход (qср.ф) млн.м3/сут</th>
        <th class="table__thead-th" rowspan="2">Технич. возм. проп. способн. (qср.р) млн. м3/сут</th>
        <th class="table__thead-th" rowspan="2">График</th>
      </tr>
      <tr>
        <th class="table__thead-th">МГ (РГ, КС, УРГ)</th>
        <th class="table__thead-th">км</th>
      </tr>
      </thead>
      <tbody class="table__tbody">
      <tr v-for="row in data" :key="`${row.name}-${row.period}`">
        <td class="table__tbody-td">{{ row.name }}</td>
        <td class="table__tbody-td">{{ row.mg }}</td>
        <td class="table__tbody-td">{{ row.km !== null ? row.km : '-' }}</td>
        <td class="table__tbody-td">{{ formatDate(row.period) }}</td>
        <td class="table__tbody-td">
          <ProgressBar :value="row.loadLevel"/>
        </td>
        <td class="table__tbody-td">{{ formatNumber(row.actualFlow) }}</td>
        <td class="table__tbody-td">{{ formatNumber(row.technicalFlow) }}</td>
        <td class="table__tbody-td">
          <button @click="openChartModal(row.name)">
            <img src="@/assets/images/svg/chart.svg" alt="Chart icon" class="table__icon">
          </button>
        </td>
      </tr>
      <tr v-if="data.length === 0">
        <td class="table__tbody-td empty" colspan="8">Нет данных для отображения</td>
      </tr>
      </tbody>
    </table>
    <ModalChart
        @toggle="toggleChartModal"
        :is-open="isChartModalOpen"
        :chart-data="selectedMRGData"
    />
  </div>
</template>

<style scoped>
.table__container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 27px 26px;
  border-radius: 16px;
  background-color: #FFFFFF;
  box-shadow: 0 4px 4px 0 #00000040;
}

.table__button {
  width: 200px;
  height: 48px;
  padding: 13px 15px;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  border: 2px solid #0A8FDC;
  border-radius: 8px;
  color: #0A8FDC;
  background-color: #FFFFFF;
  box-shadow: 0 3px 6px 0 #0000001A;
  text-transform: uppercase;
}

.table {
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  border: 2px solid #C4C4C4;
}

.table__thead-th,
.table__tbody-td {
  font-size: 15px;
  text-align: center;
  border: 2px solid #C4C4C4;
  padding: 10px;
  vertical-align: middle;
}

.table__thead-th {
  padding: 13px;
  line-height: 22px;
}

.table__thead-th:nth-child(1) {
  width: 300px;
}

.table__tbody-td:nth-child(1) {
  width: 15%;
}

.table__tbody-td:nth-child(2) {
  width: 20%;
}

.table__tbody-td:nth-child(3) {
  width: 5%;
}

.table__tbody-td:nth-child(4) {
  width: 15%;
}

.table__tbody-td:nth-child(5) {
  padding: 15px 45px;
  width: 10%;
}

.table__tbody-td:nth-child(6) {
  width: 15%;
}

.table__tbody-td:nth-child(7) {
  width: 15%;
}

.table__tbody-td:nth-child(8) {
  width: 5%;
}

.table__icon {
  width: 16px;
  height: 16px;
  text-align: center;
}

.empty {
  text-align: center;
  color: #212121
}
</style>
<script setup lang="ts">
import {computed, ref, watch} from "vue";
import VueApexCharts from "vue3-apexcharts";
import type {IModalChartData} from "@/types";


const props = defineProps<IModalChartData>();
const emit = defineEmits<{ (e: "toggle"): void }>();

const toggleModal = () => {
  emit("toggle");
};

const series = ref<ApexAxisChartSeries>([]);
const options = ref({});


const minKm = computed(() => {
  const validKms = props.chartData
    .map((d) => d.km)
    .filter((km): km is number => km != null);
  return validKms.length > 0 ? Math.min(...validKms) : null;
});

watch(
    () => props.isOpen,
    (newVal) => {
      if (newVal && props.chartData.length) {
        const factFlow = props.chartData.map((d) => d.actualFlow);
        const techFlow = props.chartData.map((d) => d.technicalFlow);
        const labels = props.chartData.map((d) => {
          const [, month] = d.period.split("/");
          const months = [
            "янв", "фев", "мар", "апр", "май", "июн",
            "июл", "авг", "сен", "окт", "ноя", "дек"
          ];
          return `${months[parseInt(month) - 1]}`;
        });

        series.value = [
          {
            name: "Факт. среднесут. расход (qср.ф) млн.м3/сут",
            data: factFlow,
          },
          {
            name: "Технич. возм. проп. способн. (qср.р) млн. м3/сут",
            data: techFlow,
          },
        ];

        options.value = {
          chart: {
            type: "line",
            height: 500,
            zoom: {enabled: false},
            toolbar: {show: false},
          },
          stroke: {curve: "smooth", width: 2},
          markers: {
            size: 3,
            colors: ["#fff"],
            strokeColors: ["#007DF0", "#F04F47"],
            strokeWidth: 3,
            hover: {size: 4},
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "14px",
            lineHeight: "17px",
            markers: {
              radius: 3,
              offsetX: -5,
            },
            itemMargin: {
              horizontal: 20,
              vertical: 5,
            },
            formatter: function (seriesName: string) {
              const words = seriesName.split(" ");
              const mid = Math.ceil(words.length / 2);
              const firstLine = words.slice(0, mid).join(" ");
              const secondLine = words.slice(mid).join(" ");
              return `${firstLine}<br>${secondLine}`;
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            x: {
              show: false,
            },
            y: {
              formatter: (val: number) => `${val.toFixed(2)}`,
              title: {
                formatter: () => ''
              }
            },
          },
          xaxis: {
            categories: labels,
            labels: {
              style: {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
              }
            }
          },
          yaxis: {
            show: false,
          },
          colors: ["#007DF0", "#F04F47"],
          grid: {
            show: false
          }
        };
      }
    }
);
</script>

<template>
  <div class="modal">
    <div @click="toggleModal" :class="['modal__overlay', {'modal__overlay-active': isOpen}]"></div>
    <div :class="['modal__dialog', {'modal__dialog-active': isOpen}]">
      <h2 class="modal__title">Загрузка МРГ</h2>
      <p v-if="props.chartData.length" class="modal__name">
        {{ props.chartData[0]["name"] }}. Подача газа от {{ minKm ?? '-'}} км
        {{ props.chartData[0]["mg"] }}
      </p>
      <p class="modal__units">млн м³/сут.</p>
      <VueApexCharts
          v-if="isOpen && series.length"
          type="line"
          width="100%"
          height="500"
          :options="options"
          :series="series"
      />
    </div>
  </div>
</template>

<style scoped>
.modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  visibility: hidden;
  opacity: 0;
  transition: 0.3s ease;
}

.modal__overlay-active {
  visibility: visible;
  opacity: 1;
}

.modal__dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 11;
  width: 1200px;
  max-width: 95%;
  height: auto;
  padding: 17px 25px;
  border-radius: 16px;
  visibility: hidden;
  opacity: 0;
  background-color: #FFFFFF;
  box-shadow: 0 1px 10px 0 #0000001F;
  transform: translate(-50%, -50%);
  transition: 0.3s ease;
}

.modal__dialog-active {
  visibility: visible;
  opacity: 1;
}

.modal__title {
  font-family: "Poppins", sans-serif;
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  margin-bottom: 20px;
}

.modal__name {
  font-family: "Roboto", sans-serif;
  font-size: 19px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0;
  margin-bottom: 13px;
}

.modal__units {
  font-family: "Roboto", sans-serif;
  font-size: 19px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0;
}

</style>
<template>
  <div class="info-grid">
    <div v-for="item in items" :key="item.label" class="info-item">
      <div class="info-label">{{ item.label }}</div>
      <div class="info-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { label: string; value: string | number }[]
}>()
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 20px 30px;
}

.info-item {
  min-height: 68px;
}

.info-label {
  font-weight: 700;
  color: #1d1d1d;
  margin-bottom: 8px;
  font-size: 18px;
}

.info-value {
  color: #222;
  font-size: 18px;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>
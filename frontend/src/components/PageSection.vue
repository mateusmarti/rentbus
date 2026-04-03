<template>
  <div class="section-card">
    <div v-if="title" class="section-header">
      <h2>{{ title }}</h2>
      <slot name="actions" />
    </div>

    <div class="section-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.section-card {
  background: transparent;
  border-radius: 14px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #bfc3cf;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  color: #1f1f1f;
}

.section-body {
  background: transparent;
}
</style>
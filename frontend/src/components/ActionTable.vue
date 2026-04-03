<template>
  <div class="table-responsive">
    <table class="table custom-table align-middle">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
          <th v-if="$slots.actions || hasActions">Ações</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    headers: string[]
    hasActions?: boolean
  }>(),
  {
    hasActions: true
  }
)
</script>

<style scoped>
.custom-table {
  margin-bottom: 0;
  background: #f7f7fa;
  min-width: 760px;
}

.custom-table thead th {
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
  border-bottom: 1px solid #3a3a3a;
  background: transparent;
  white-space: nowrap;
}

.custom-table tbody td {
  background: #dfe1e8;
  border-top: 1px solid #cfd3dc;
  color: #222;
  white-space: nowrap;
}

.custom-table tbody tr:nth-child(even) td {
  background: #e7e9ef;
}
</style>
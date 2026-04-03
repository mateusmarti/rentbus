<template>
  <div class="container py-4">
    <h2 class="mb-4" style="color: #5907DD;">Corridas</h2>

    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Cliente</th>
              <th>Empresa</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trip in trips" :key="trip._id">
              <td>{{ trip.title }}</td>
              <td>{{ trip.origin }}</td>
              <td>{{ trip.destination }}</td>
              <td>{{ trip.clientUser?.name }}</td>
              <td>{{ trip.companyUser?.name || '-' }}</td>
              <td>{{ trip.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '../services/api'

const trips = ref<any[]>([])
const errorMessage = ref('')

async function loadTrips() {
  try {
    const response = await api.get('/admin/trips')
    trips.value = response.data
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao carregar corridas'
  }
}

onMounted(loadTrips)
</script>
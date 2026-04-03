<template>
  <div class="container py-4">
    <h2 class="mb-4" style="color: #5907DD;">Empresas cadastradas</h2>

    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Fantasia</th>
              <th>Razão social</th>
              <th>CNPJ</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companies" :key="company._id">
              <td>{{ company.tradeName }}</td>
              <td>{{ company.legalName }}</td>
              <td>{{ company.cnpj }}</td>
              <td>{{ company.user?.email }}</td>
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

const companies = ref<any[]>([])
const errorMessage = ref('')

async function loadCompanies() {
  try {
    const response = await api.get('/admin/companies')
    companies.value = response.data
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao carregar empresas'
  }
}

onMounted(loadCompanies)
</script>
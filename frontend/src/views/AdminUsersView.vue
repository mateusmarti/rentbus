<template>
  <div class="container py-4">
    <h2 class="mb-4" style="color: #5907DD;">Usuários cadastrados</h2>

    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.status }}</td>
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

const users = ref<any[]>([])
const errorMessage = ref('')

async function loadUsers() {
  try {
    const response = await api.get('/admin/users')
    users.value = response.data
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao carregar usuários'
  }
}

onMounted(loadUsers)
</script>
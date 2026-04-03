<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="mb-4 text-center" style="color: #5907DD;">Login RentBus</h2>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">E-mail</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>

              <button class="btn w-100 text-white" style="background-color: #5907DD;">
                Entrar
              </button>
            </form>

            <p class="mt-3 text-center">
              Não tem conta?
              <router-link to="/register">Cadastre-se</router-link>
            </p>

            <p v-if="errorMessage" class="text-danger mt-3 text-center">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  try {
    errorMessage.value = ''

    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer login'
  }
}
</script>
<template>
  <div class="container py-5">
    <div class="card shadow">
      <div class="card-body">
        <p>Redirecionando...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const userString = localStorage.getItem('user')

  if (!userString) {
    router.push('/login')
    return
  }

  const user = JSON.parse(userString)

  if (user.role === 'client') {
    router.push('/dashboard/client')
    return
  }

  if (user.role === 'company') {
    router.push('/dashboard/company')
    return
  }

  if (user.role === 'admin') {
    router.push('/dashboard/admin')
    return
  }

  router.push('/login')
})
</script>
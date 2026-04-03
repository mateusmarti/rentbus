<template>
  <div class="container py-4">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="mb-4" style="color:#5907DD;">Comprovante ilustrativo</h2>

        <div v-if="trip && payment">
          <p><strong>Viagem:</strong> {{ trip.title }}</p>
          <p><strong>Tipo:</strong> {{ getBusTypeLabel(trip.busType) }}</p>
          <p><strong>Origem:</strong> {{ trip.originLabel }}</p>
          <p><strong>Destino:</strong> {{ trip.destinationLabel }}</p>
          <p><strong>Valor:</strong> R$ {{ payment.amount }}</p>
          <p><strong>Forma de pagamento:</strong> {{ getPaymentMethodLabel(payment.paymentMethod) }}</p>
          <p><strong>Status:</strong> {{ getPaymentStatusLabel(payment.status) }}</p>
          <p><strong>CPF do pagador:</strong> {{ payment.payerCpf || '-' }}</p>
          <p><strong>Endereço de cobrança:</strong> {{ payment.billingAddress || '-' }}</p>
          <p><strong>Enviado em:</strong> {{ formatDate(payment.submittedAt || payment.createdAt) }}</p>
          <p><strong>Validado em:</strong> {{ payment.paidAt ? formatDate(payment.paidAt) : 'Aguardando validação' }}</p>

          <div v-if="payment.paymentMethod === 'card'">
            <p><strong>Cartão:</strong> **** {{ payment.cardLast4 || '0000' }}</p>
            <p><strong>Portador:</strong> {{ payment.cardHolderName || '-' }}</p>
          </div>
        </div>

        <div v-else class="text-muted">
          Carregando comprovante...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { getBusTypeLabel, getPaymentStatusLabel } from '../utils/labels'

const route = useRoute()
const trip = ref<any | null>(null)
const payment = ref<any | null>(null)

function formatDate(date: string) {
  return new Date(date).toLocaleString('pt-BR')
}

function getPaymentMethodLabel(method: string) {
  const labels: Record<string, string> = {
    pix: 'PIX',
    card: 'Cartão',
    bank_slip: 'Boleto'
  }

  return labels[method] || method
}

async function loadData() {
  const [tripResponse, paymentResponse] = await Promise.all([
    api.get(`/trips/${route.params.tripId}`),
    api.get(`/trips/${route.params.tripId}/payment`)
  ])

  trip.value = tripResponse.data
  payment.value = paymentResponse.data
}

onMounted(loadData)
</script>
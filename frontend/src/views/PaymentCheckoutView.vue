<template>
  <div class="container py-4">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="mb-4" style="color:#5907DD;">Pagamento provisório</h2>

        <div v-if="trip" class="mb-4">
          <p><strong>Viagem:</strong> {{ trip.title }}</p>
          <p><strong>Tipo:</strong> {{ getBusTypeLabel(trip.busType) }}</p>
          <p><strong>Origem:</strong> {{ trip.originLabel }}</p>
          <p><strong>Destino:</strong> {{ trip.destinationLabel }}</p>
          <p><strong>Valor:</strong> R$ {{ trip.acceptedProposal?.amount || 0 }}</p>
        </div>

        <form @submit.prevent="submitPayment">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Forma de pagamento</label>
              <select v-model="form.paymentMethod" class="form-select">
                <option value="pix">PIX</option>
                <option value="bank_slip">Boleto</option>
                <option value="card">Cartão</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">CPF do pagador</label>
              <input v-model="form.payerCpf" class="form-control" />
            </div>

            <div class="col-md-4">
              <label class="form-label">Endereço de cobrança</label>
              <input v-model="form.billingAddress" class="form-control" />
            </div>
          </div>

          <div class="row g-3 mt-1" v-if="form.paymentMethod === 'card'">
            <div class="col-md-4">
              <label class="form-label">Nome no cartão</label>
              <input v-model="form.cardHolderName" class="form-control" />
            </div>

            <div class="col-md-4">
              <label class="form-label">Número do cartão</label>
              <input v-model="form.cardNumber" class="form-control" />
            </div>

            <div class="col-md-2">
              <label class="form-label">Validade</label>
              <input v-model="form.cardExpiry" class="form-control" placeholder="MM/AA" />
            </div>

            <div class="col-md-2">
              <label class="form-label">CVV</label>
              <input v-model="form.cardCvv" class="form-control" />
            </div>
          </div>

          <div class="mt-4 d-flex gap-2 flex-wrap">
            <button class="btn text-white" style="background:#5907DD;">Enviar pagamento</button>
            <button type="button" class="btn btn-outline-secondary" @click="openGoogleMapsRoute">
              Ver trajeto no mapa
            </button>
          </div>
        </form>

        <p v-if="message" class="text-success mt-3">{{ message }}</p>
        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { getBusTypeLabel } from '../utils/labels'

const route = useRoute()
const trip = ref<any | null>(null)
const message = ref('')
const errorMessage = ref('')

const form = ref({
  paymentMethod: 'pix',
  payerCpf: '',
  billingAddress: '',
  cardHolderName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: ''
})

function buildGoogleMapsRouteUrl(tripData: any) {
  const origin = encodeURIComponent(tripData.originLabel || '')
  const destination = encodeURIComponent(tripData.destinationLabel || '')
  const waypoints = (tripData.stops || [])
    .map((stop: any) => stop.label)
    .filter(Boolean)
    .join('|')

  const base = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

  if (waypoints) {
    return `${base}&waypoints=${encodeURIComponent(waypoints)}`
  }

  return base
}

function openGoogleMapsRoute() {
  if (!trip.value) return
  window.open(buildGoogleMapsRouteUrl(trip.value), '_blank')
}

async function loadTrip() {
  const response = await api.get(`/trips/${route.params.tripId}`)
  trip.value = response.data
}

async function submitPayment() {
  try {
    await api.patch(`/trips/${route.params.tripId}/pay`, form.value)
    message.value = 'Pagamento enviado para validação do administrador.'
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao enviar pagamento'
    message.value = ''
  }
}

onMounted(loadTrip)
</script>
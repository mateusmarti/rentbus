<template>
  <AppSidebar title="RentBus" v-model="activeSection" :items="menuItems" @logout="logout">
    <template v-if="activeSection === 'profile'">
      <PageSection :title="`Perfil do Usuário - ${profileForm.name || 'cliente'}`">
        <PanelCard>
          <div class="d-flex flex-column flex-lg-row align-items-start gap-4 mb-4">
            <div class="profile-avatar">👤</div>

            <div class="w-100">
              <InfoGrid :items="profileItems" />
            </div>
          </div>

          <hr />

          <div class="mt-3">
            <button v-if="!isEditingProfile" class="btn btn-primary me-2" @click="isEditingProfile = true">
              Editar Perfil
            </button>
          </div>

          <div v-if="isEditingProfile" class="mt-3">
            <div class="row g-3">
              <div class="col-12 col-md-6 col-lg-4">
                <label class="form-label">Nome</label>
                <input v-model="profileForm.name" class="form-control" />
              </div>

              <div class="col-12 col-md-6 col-lg-4">
                <label class="form-label">E-mail</label>
                <input v-model="profileForm.email" class="form-control" />
              </div>

              <div class="col-12 col-md-6 col-lg-4">
                <label class="form-label">Telefone</label>
                <input v-model="profileForm.phone" class="form-control" />
              </div>

              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Tipo</label>
                <select v-model="profileForm.personType" class="form-select">
                  <option value="pf">Pessoa Física</option>
                  <option value="pj">Pessoa Jurídica</option>
                </select>
              </div>

              <div class="col-12 col-md-6 col-lg-4" v-if="profileForm.personType === 'pf'">
                <label class="form-label">CPF</label>
                <input v-model="profileForm.cpf" class="form-control" />
              </div>

              <div class="col-12 col-md-6 col-lg-4" v-if="profileForm.personType === 'pj'">
                <label class="form-label">CNPJ</label>
                <input v-model="profileForm.cnpj" class="form-control" />
              </div>
            </div>

            <div class="mt-3 d-flex gap-2 flex-wrap">
              <button class="btn btn-primary" @click="updateProfile">
                Salvar alterações
              </button>

              <button type="button" class="btn btn-outline-secondary" @click="isEditingProfile = false">
                Cancelar
              </button>
            </div>
          </div>

          <hr class="my-4" />

          <h5 class="mb-3">Alterar senha</h5>

          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label">Senha atual</label>
              <input v-model="passwordForm.currentPassword" type="password" class="form-control" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label">Nova senha</label>
              <input v-model="passwordForm.newPassword" type="password" class="form-control" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label">Confirmar nova senha</label>
              <input v-model="passwordForm.confirmPassword" type="password" class="form-control" />
            </div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="changePassword">
              Alterar senha
            </button>
          </div>

          <p v-if="message" class="text-success mt-3 mb-0">{{ message }}</p>
          <p v-if="errorMessage" class="text-danger mt-3 mb-0">{{ errorMessage }}</p>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'request'">
      <PageSection title="Solicitar Orçamento">
        <PanelCard>
          <form @submit.prevent="createTrip">
            <div class="section-title-mini">Local de Partida</div>

            <div class="row g-3 mb-4">
              <div class="col-12 col-md-3">
                <label class="form-label">Nº *</label>
                <input v-model="tripForm.originNumber" class="form-control" />
              </div>

              <div class="col-12 col-md-5">
                <label class="form-label">Endereço *</label>
                <input v-model="tripForm.originStreet" class="form-control" />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label">CEP *</label>
                <input v-model="tripForm.originCep" class="form-control" @blur="fillAddressByCep('origin')" />
              </div>

              <div class="col-12">
                <label class="form-label">Complemento</label>
                <input v-model="tripForm.originComplement" class="form-control" />
              </div>
            </div>

            <div class="section-title-mini">Local de Destino</div>

            <div class="row g-3 mb-4">
              <div class="col-12 col-md-3">
                <label class="form-label">Nº *</label>
                <input v-model="tripForm.destinationNumber" class="form-control" />
              </div>

              <div class="col-12 col-md-5">
                <label class="form-label">Endereço *</label>
                <input v-model="tripForm.destinationStreet" class="form-control" />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label">CEP *</label>
                <input v-model="tripForm.destinationCep" class="form-control" @blur="fillAddressByCep('destination')" />
              </div>

              <div class="col-12">
                <label class="form-label">Complemento</label>
                <input v-model="tripForm.destinationComplement" class="form-control" />
              </div>
            </div>

            <div class="section-title-mini">Mais informações</div>

            <div class="row g-3">
              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Dia e Horário de partida *</label>
                <input v-model="tripForm.tripDate" type="datetime-local" class="form-control" />
              </div>

              <div class="col-6 col-md-3 col-lg-2">
                <label class="form-label">Qtd. Paradas *</label>
                <input :value="tripForm.stops.length" class="form-control" readonly />
              </div>

              <div class="col-6 col-md-3 col-lg-2">
                <label class="form-label">Horas Estimadas *</label>
                <input v-model="tripForm.notes" class="form-control" />
              </div>

              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Tipo de ônibus *</label>
                <select v-model="tripForm.busType" class="form-select">
                  <option value="van">Van</option>
                  <option value="micro_urbano">Micro urbano</option>
                  <option value="midi_urbano">Midi urbano</option>
                  <option value="urbano">Urbano</option>
                  <option value="executivo">Executivo</option>
                  <option value="semileito">Semileito</option>
                  <option value="leito">Leito</option>
                </select>
              </div>

              <div class="col-12 col-md-6 col-lg-2">
                <label class="form-label">Núm. de pessoas *</label>
                <input v-model.number="tripForm.maxPassengers" type="number" class="form-control" />
              </div>
            </div>

            <div class="mt-3">
              <button type="button" class="btn btn-outline-secondary me-2" @click="addStop">Adicionar Parada</button>
            </div>

            <div v-for="(stop, index) in tripForm.stops" :key="index" class="border rounded p-3 mt-3">
              <div class="row g-2">
                <div class="col-12 col-md-3">
                  <label class="form-label">CEP da parada</label>
                  <input v-model="stop.cep" class="form-control" @blur="fillStopByCep(Number(index))" />
                </div>

                <div class="col-12 col-md-2">
                  <label class="form-label">Número</label>
                  <input v-model="stop.number" class="form-control" />
                </div>

                <div class="col-12 col-md-5">
                  <label class="form-label">Endereço da parada</label>
                  <input v-model="stop.label" class="form-control" />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-end">
                  <button type="button" class="btn btn-outline-danger w-100" @click="removeStop(Number(index))">
                    Remover
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <h5 style="color:#5907DD;">Mapa da viagem</h5>
              <TripMapPreview :markers="mapMarkers" />
            </div>

            <div class="mt-4">
              <button class="btn btn-primary me-3">Solicitar</button>
              <button type="button" class="btn btn-link text-dark text-decoration-none" @click="resetTripForm">
                Cancelar
              </button>
            </div>
          </form>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'quotes'">
      <PageSection title="Solicitações de orçamento">
        <div class="quote-grid">
          <div v-for="trip in requestedTrips" :key="trip._id" class="quote-card">
            <div class="quote-name">{{ profileForm.name || 'Cliente' }}</div>

            <div class="quote-row">
              <div class="quote-date-circle">
                <div>{{ formatDay(trip.tripDate) }}</div>
                <small>{{ formatMonth(trip.tripDate) }}</small>
              </div>

              <div>
                <div class="quote-route">{{ trip.originLabel }} - {{ trip.destinationLabel }}</div>
                <div class="quote-date-time">{{ formatDate(trip.tripDate) }}</div>
              </div>
            </div>

            <div class="quote-address mt-3">
              <div><strong>De:</strong> {{ trip.originLabel }}</div>
              <div><strong>Para:</strong> {{ trip.destinationLabel }}</div>
              <div><strong>Tipo:</strong> {{ getBusTypeLabel(trip.busType) }}</div>
              <div>Capacidade máxima: {{ trip.maxPassengers }} passageiros.</div>
              <div><strong>Status:</strong> {{ getTripStatusLabel(trip.status) }}</div>
              <div><strong>Pagamento:</strong> {{ getPaymentStatusLabel(trip.paymentStatus) }}</div>
            </div>

            <div class="mt-3 d-flex gap-2 flex-wrap">
              <button class="btn btn-sm text-white" style="background:#5907DD;" @click="loadTripProposals(trip._id)">
                Ver mais
              </button>

              <button v-if="trip.acceptedProposal && trip.paymentStatus === 'not_paid'" class="btn btn-sm text-dark"
                style="background:#FBA504;" @click="payTrip(trip._id)">
                Pagar
              </button>

              <button v-if="trip.acceptedProposal && trip.paymentStatus === 'not_paid'"
                class="btn btn-sm btn-outline-primary" @click="openRouteInGoogleMaps(trip)">
                Ver rota
              </button>

              <button v-if="trip.paymentStatus === 'paid'" class="btn btn-sm btn-outline-success"
                @click="openPassengerModal(trip)">
                Passageiros
              </button>

              <button v-if="trip.status !== 'cancelled' && trip.status !== 'completed'"
                class="btn btn-sm btn-outline-danger" @click="cancelTrip(trip._id)">
                Cancelar
              </button>
            </div>

            <div v-if="openedTripId === trip._id" class="mt-3">
              <div v-for="proposal in tripProposals" :key="proposal._id" class="proposal-box">
                <div><strong>Empresa:</strong> {{ proposal.companyUser?.name }}</div>
                <div><strong>Valor:</strong> R$ {{ proposal.amount }}</div>
                <div><strong>Obs:</strong> {{ proposal.notes || '-' }}</div>

                <button v-if="trip.status !== 'accepted' && trip.status !== 'paid'" class="btn btn-sm text-white mt-2"
                  style="background:#5907DD;" @click="acceptProposal(proposal._id)">
                  Aceitar orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'trips'">
      <PageSection title="Minhas viagens">
        <ActionTable :headers="['Título', 'Origem', 'Destino', 'Status', 'Pagamento']">
          <tr v-for="trip in trips" :key="trip._id">
            <td>{{ trip.title }}</td>
            <td>{{ trip.originLabel }}</td>
            <td>{{ trip.destinationLabel }}</td>
            <td>{{ getTripStatusLabel(trip.status) }}</td>
            <td>{{ getPaymentStatusLabel(trip.paymentStatus) }}</td>
            <td>
              <button class="btn btn-primary btn-sm me-1" @click="openPassengerModal(trip)">Visualizar</button>
              <button class="btn btn-outline-primary btn-sm" @click="openRouteInGoogleMaps(trip)">
                Rota
              </button>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'payments'">
      <PageSection title="Pagamentos">
        <ActionTable :headers="['Viagem', 'Status da viagem', 'Pagamento']">
          <tr v-for="trip in trips" :key="trip._id">
            <td>{{ trip.title }}</td>
            <td>{{ getTripStatusLabel(trip.status) }}</td>
            <td>{{ getPaymentStatusLabel(trip.paymentStatus) }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button v-if="trip.paymentStatus !== 'paid'" class="btn btn-success btn-sm"
                  @click="openPaymentWindow(trip)">
                  Pagar viagem
                </button>

                <button v-if="trip.paymentStatus === 'paid'" class="btn btn-outline-primary btn-sm"
                  @click="openReceiptWindow(trip)">
                  Exibir comprovante
                </button>
              </div>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>

    <PanelCard v-if="selectedTripForPassengers" class="mt-4">
      <h5 class="mb-3">Passageiros - {{ selectedTripForPassengers.title }}</h5>

      <div v-for="(passenger, index) in passengerForm" :key="index" class="row g-2 align-items-end mb-2">
        <div class="col-12 col-md-5">
          <label class="form-label">Nome</label>
          <input v-model="passenger.name" class="form-control" />
        </div>

        <div class="col-12 col-md-5">
          <label class="form-label">Documento</label>
          <input v-model="passenger.document" class="form-control" />
        </div>

        <div class="col-12 col-md-2">
          <button class="btn btn-outline-danger w-100" @click="removePassenger(index)">
            Remover
          </button>
        </div>
      </div>

      <div class="d-flex gap-2 mt-3 flex-wrap">
        <button class="btn btn-outline-secondary" @click="addPassenger">Adicionar passageiro</button>
        <button class="btn text-white" style="background:#5907DD;" @click="savePassengers">
          Salvar passageiros
        </button>
      </div>

      <p v-if="message" class="text-success mt-3 mb-0">{{ message }}</p>
      <p v-if="errorMessage" class="text-danger mt-3 mb-0">{{ errorMessage }}</p>
    </PanelCard>
  </AppSidebar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import AppSidebar from '../components/AppSidebar.vue'
import PageSection from '../components/PageSection.vue'
import PanelCard from '../components/PanelCard.vue'
import ActionTable from '../components/ActionTable.vue'
import InfoGrid from '../components/InfoGrid.vue'
import TripMapPreview from '../components/TripMapPreview.vue'
import { getBusTypeLabel, getPaymentStatusLabel, getTripStatusLabel } from '../utils/labels'

type TripStop = {
  cep: string
  number: string
  label: string
  lat: number | null
  lng: number | null
}

type TripForm = {
  title: string
  busType: string
  originCep: string
  originNumber: string
  originStreet: string
  originComplement: string
  originLabel: string
  originLat: number | null
  originLng: number | null
  destinationCep: string
  destinationNumber: string
  destinationStreet: string
  destinationComplement: string
  destinationLabel: string
  destinationLat: number | null
  destinationLng: number | null
  stops: TripStop[]
  maxPassengers: number
  tripDate: string
  notes: string
}

const router = useRouter()
const activeSection = ref('request')
const trips = ref<any[]>([])
const tripProposals = ref<any[]>([])
const openedTripId = ref('')
const selectedTripForPassengers = ref<any | null>(null)
const passengerForm = ref<any[]>([])
const message = ref('')
const errorMessage = ref('')
const isEditingProfile = ref(false)

function openPaymentWindow(trip: any) {
  window.open(`/payment/${trip._id}`, '_blank')
}

function openReceiptWindow(trip: any) {
  window.open(`/payment/${trip._id}/receipt`, '_blank')
}

const menuItems = [
  { key: 'profile', label: 'Perfil', icon: 'house' },
  { key: 'request', label: 'Solicitar', icon: 'file-circle-plus' },
  { key: 'quotes', label: 'Orçamentos', icon: 'clipboard-list' },
  { key: 'trips', label: 'Viagens', icon: 'bus' },
  { key: 'payments', label: 'Pagamentos', icon: 'credit-card' },
]

const profileForm = ref<any>({
  id: '',
  name: '',
  email: '',
  phone: '',
  cpf: '',
  cnpj: '',
  personType: 'pf'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const tripForm = ref<TripForm>({
  title: 'Solicitação de Fretamento',
  busType: 'urbano',
  originCep: '',
  originNumber: '',
  originStreet: '',
  originComplement: '',
  originLabel: '',
  originLat: null,
  originLng: null,
  destinationCep: '',
  destinationNumber: '',
  destinationStreet: '',
  destinationComplement: '',
  destinationLabel: '',
  destinationLat: null,
  destinationLng: null,
  stops: [],
  maxPassengers: 1,
  tripDate: '',
  notes: ''
})

const requestedTrips = computed(() =>
  trips.value.filter((trip) => ['requested', 'quoted', 'accepted', 'paid', 'cancelled'].includes(trip.status))
)

const profileItems = computed(() => [
  { label: 'ID', value: profileForm.value.id || '-' },
  { label: 'Nome do Usuário', value: profileForm.value.name || '-' },
  { label: 'E-mail', value: profileForm.value.email || '-' },
  { label: 'Tipo de conta', value: profileForm.value.personType === 'pj' ? 'Pessoa jurídica' : 'Pessoa física' }
])

const mapMarkers = computed(() => {
  const markers: Array<{ lat: number; lng: number; label: string }> = []

  if (typeof tripForm.value.originLat === 'number' && typeof tripForm.value.originLng === 'number') {
    markers.push({
      lat: tripForm.value.originLat,
      lng: tripForm.value.originLng,
      label: `Partida: ${tripForm.value.originLabel}`
    })
  }

  tripForm.value.stops.forEach((stop: TripStop, index: number) => {
    if (typeof stop.lat === 'number' && typeof stop.lng === 'number') {
      markers.push({
        lat: stop.lat,
        lng: stop.lng,
        label: `Parada ${index + 1}: ${stop.label}`
      })
    }
  })

  if (
    typeof tripForm.value.destinationLat === 'number' &&
    typeof tripForm.value.destinationLng === 'number'
  ) {
    markers.push({
      lat: tripForm.value.destinationLat,
      lng: tripForm.value.destinationLng,
      label: `Destino: ${tripForm.value.destinationLabel}`
    })
  }

  return markers
})

function formatDate(date: string) {
  return new Date(date).toLocaleString('pt-BR')
}

function formatDay(date: string) {
  return new Date(date).getDate().toString().padStart(2, '0')
}

function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
}

function addStop() {
  tripForm.value.stops.push({
    cep: '',
    number: '',
    label: '',
    lat: null,
    lng: null
  })
}

function removeStop(index: number) {
  tripForm.value.stops.splice(index, 1)
}

function resetTripForm() {
  tripForm.value = {
    title: 'Solicitação de Fretamento',
    busType: 'urbano',
    originCep: '',
    originNumber: '',
    originStreet: '',
    originComplement: '',
    originLabel: '',
    originLat: null,
    originLng: null,
    destinationCep: '',
    destinationNumber: '',
    destinationStreet: '',
    destinationComplement: '',
    destinationLabel: '',
    destinationLat: null,
    destinationLng: null,
    stops: [],
    maxPassengers: 1,
    tripDate: '',
    notes: ''
  }
}

async function geocodeAddress(address: string) {
  if (!address) return null

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  )
  const results = await response.json()

  if (!results.length) return null

  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon)
  }
}

async function fillAddressByCep(type: 'origin' | 'destination') {
  const field = type === 'origin' ? 'originCep' : 'destinationCep'
  const cep = String(tripForm.value[field]).replace(/\D/g, '')
  if (cep.length !== 8) return

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
  const data = await response.json()
  if (data.erro) return

  if (type === 'origin') {
    if (!tripForm.value.originStreet) {
      tripForm.value.originStreet = data.logradouro || ''
    }

    const label = [
      tripForm.value.originStreet || data.logradouro,
      tripForm.value.originNumber,
      tripForm.value.originComplement,
      data.bairro,
      data.localidade,
      data.uf,
      cep
    ]
      .filter(Boolean)
      .join(', ')

    tripForm.value.originLabel = label
    const coords = await geocodeAddress(label)
    tripForm.value.originLat = coords?.lat ?? null
    tripForm.value.originLng = coords?.lng ?? null
  } else {
    if (!tripForm.value.destinationStreet) {
      tripForm.value.destinationStreet = data.logradouro || ''
    }

    const label = [
      tripForm.value.destinationStreet || data.logradouro,
      tripForm.value.destinationNumber,
      tripForm.value.destinationComplement,
      data.bairro,
      data.localidade,
      data.uf,
      cep
    ]
      .filter(Boolean)
      .join(', ')

    tripForm.value.destinationLabel = label
    const coords = await geocodeAddress(label)
    tripForm.value.destinationLat = coords?.lat ?? null
    tripForm.value.destinationLng = coords?.lng ?? null
  }
}

async function fillStopByCep(index: number) {
  const stop = tripForm.value.stops[index]
  if (!stop) return

  const cep = String(stop.cep).replace(/\D/g, '')
  if (cep.length !== 8) return

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
  const data = await response.json()
  if (data.erro) return

  stop.label = [data.logradouro, stop.number, data.bairro, data.localidade, data.uf, cep]
    .filter(Boolean)
    .join(', ')

  const coords = await geocodeAddress(stop.label)
  stop.lat = coords?.lat ?? null
  stop.lng = coords?.lng ?? null
}

async function loadMe() {
  const response = await api.get('/auth/me')
  const { user, profile } = response.data

  profileForm.value = {
    id: user._id,
    name: user.name || '',
    email: user.email || '',
    phone: profile?.phone || '',
    cpf: profile?.cpf || '',
    cnpj: profile?.cnpj || '',
    personType: profile?.personType || 'pf'
  }

  localStorage.setItem(
    'user',
    JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
  )
}

async function updateProfile() {
  try {
    message.value = ''
    errorMessage.value = ''

    await api.put('/auth/me', {
      name: profileForm.value.name,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      cpf: profileForm.value.cpf,
      cnpj: profileForm.value.cnpj,
      personType: profileForm.value.personType
    })

    message.value = 'Perfil atualizado com sucesso'
    await loadMe()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar perfil'
  }
}

async function changePassword() {
  try {
    message.value = ''
    errorMessage.value = ''

    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
      errorMessage.value = 'Preencha todos os campos de senha'
      return
    }

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      errorMessage.value = 'A confirmação da senha não confere'
      return
    }

    await api.patch('/auth/change-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    message.value = 'Senha alterada com sucesso'
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao alterar senha'
  }
}

async function loadTrips() {
  const response = await api.get('/trips/client')
  trips.value = response.data
}

async function createTrip() {
  await api.post('/trips', tripForm.value)
  resetTripForm()
  await loadTrips()
  activeSection.value = 'quotes'
}

async function loadTripProposals(tripId: string) {
  openedTripId.value = tripId
  const response = await api.get(`/trips/${tripId}/proposals`)
  tripProposals.value = response.data
}

async function acceptProposal(proposalId: string) {
  await api.patch(`/trips/proposal/${proposalId}/accept`)
  await loadTrips()
}

async function payTrip(tripId: string) {
  await api.patch(`/trips/${tripId}/pay`, { paymentMethod: 'pix' })
  await loadTrips()
}

function buildGoogleMapsRouteUrl(trip: any) {
  const origin = encodeURIComponent(trip.originLabel || '')
  const destination = encodeURIComponent(trip.destinationLabel || '')
  const waypoints = (trip.stops || [])
    .map((stop: any) => stop.label)
    .filter(Boolean)
    .join('|')

  const base = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

  if (waypoints) {
    return `${base}&waypoints=${encodeURIComponent(waypoints)}`
  }

  return base
}

function openRouteInGoogleMaps(trip: any) {
  window.open(buildGoogleMapsRouteUrl(trip), '_blank')
}

function openPassengerModal(trip: any) {
  selectedTripForPassengers.value = trip
  passengerForm.value = trip.passengers?.length
    ? trip.passengers.map((p: any) => ({ ...p }))
    : [{ name: '', document: '' }]
}

function addPassenger() {
  passengerForm.value.push({ name: '', document: '' })
}

function removePassenger(index: number) {
  passengerForm.value.splice(index, 1)
}

async function savePassengers() {
  try {
    if (!selectedTripForPassengers.value) return

    const filtered = passengerForm.value.filter(
      (p: any) => String(p?.name || '').trim() && String(p?.document || '').trim()
    )

    if (!filtered.length) {
      errorMessage.value = 'Adicione pelo menos um passageiro válido'
      message.value = ''
      return
    }

    await api.patch(`/trips/${selectedTripForPassengers.value._id}/passengers`, {
      passengers: filtered
    })

    selectedTripForPassengers.value = null
    passengerForm.value = []
    await loadTrips()
    message.value = 'Passageiros salvos com sucesso'
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao salvar passageiros'
    message.value = ''
  }
}

async function cancelTrip(tripId: string) {
  await api.patch(`/trips/${tripId}/cancel/client`)
  await loadTrips()
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(async () => {
  await loadMe()
  await loadTrips()
})
</script>

<style scoped>
.profile-avatar {
  width: 108px;
  height: 108px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 58px;
  background: #eef0f5;
  border: 1px solid #d6d9e0;
}

.section-title-mini {
  font-size: 24px;
  color: #1f1f1f;
  margin-bottom: 10px;
}

.quote-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: 22px;
}

.quote-card {
  background: #f6f6f8;
  border: 1px solid #d8dbe3;
  border-radius: 14px;
  padding: 18px;
}

.quote-name {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 16px;
}

.quote-row {
  display: flex;
  gap: 14px;
  align-items: center;
}

.quote-date-circle {
  width: 66px;
  height: 66px;
  border-radius: 999px;
  background: #e9edf7;
  color: #5b6ddc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: 700;
}

.quote-date-circle small {
  font-size: 11px;
  margin-top: 4px;
}

.quote-route {
  font-size: 20px;
}

.quote-date-time {
  color: #8a95a6;
}

.quote-address {
  color: #404040;
}

.proposal-box {
  background: #eceef4;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

@media (max-width: 1199px) {
  .quote-grid {
    grid-template-columns: repeat(2, minmax(240px, 1fr));
  }
}

@media (max-width: 767px) {
  .quote-grid {
    grid-template-columns: 1fr;
  }

  .quote-row {
    align-items: flex-start;
  }

  .quote-route {
    font-size: 18px;
  }

  .section-title-mini {
    font-size: 22px;
  }
}
</style>
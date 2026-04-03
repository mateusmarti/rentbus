<template>
  <AppSidebar
    title="RentBus"
    v-model="activeSection"
    :items="menuItems"
    @logout="logout"
  >
    <template v-if="activeSection === 'profile'">
      <PageSection :title="`Minha Empresa - ${profileForm.name || companyName}`">
        <PanelCard>
          <div class="d-flex flex-column flex-lg-row align-items-start gap-4 mb-4">
            <div class="profile-avatar">🏢</div>

            <div class="w-100">
              <InfoGrid :items="profileItems" />
            </div>
          </div>

          <hr />

          <div class="mb-3" v-if="!showProfileForm">
            <button class="btn btn-primary" @click="showProfileForm = true">
              Editar Perfil
            </button>
          </div>

          <div v-if="showProfileForm">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Nome</label>
                <input v-model="profileForm.name" class="form-control" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">E-mail</label>
                <input v-model="profileForm.email" class="form-control" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Telefone</label>
                <input v-model="profileForm.phone" class="form-control" />
              </div>
            </div>

            <div class="mt-3 d-flex gap-2 flex-wrap">
              <button class="btn btn-primary" @click="updateProfile">Salvar</button>
              <button class="btn btn-outline-secondary" @click="cancelProfileEdit">Cancelar</button>
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

    <template v-else-if="activeSection === 'quotes'">
      <PageSection title="Solicitações de orçamento">
        <div class="quote-grid">
          <div v-for="trip in openTrips" :key="trip._id" class="quote-card">
            <div class="quote-name">{{ trip.clientUser?.name }}</div>

            <div class="quote-row">
              <div class="quote-date-circle">
                <div>{{ formatDay(trip.tripDate) }}</div>
                <small>{{ formatMonth(trip.tripDate) }}</small>
              </div>

              <div>
                <div class="quote-route">{{ shortRoute(trip.originLabel, trip.destinationLabel) }}</div>
                <div class="quote-date-time">{{ formatDate(trip.tripDate) }}</div>
              </div>
            </div>

            <div class="quote-address mt-3">
              <div><strong>De:</strong> {{ trip.originLabel }}</div>
              <div><strong>Para:</strong> {{ trip.destinationLabel }}</div>
              <div><strong>Tipo:</strong> {{ getBusTypeLabel(trip.busType) }}</div>
              <div>A viagem comporta {{ trip.maxPassengers }} pessoas.</div>
              <div><strong>Status:</strong> {{ getTripStatusLabel(trip.status) }}</div>
              <div><strong>Pagamento:</strong> {{ getPaymentStatusLabel(trip.paymentStatus) }}</div>
            </div>

            <div class="mt-3">
              <input
                v-model="proposalForms[trip._id].amount"
                type="number"
                class="form-control mb-2"
                placeholder="Valor"
              />
              <input
                v-model="proposalForms[trip._id].notes"
                class="form-control mb-2"
                placeholder="Observações"
              />

              <div class="d-flex gap-2 flex-wrap">
                <button class="btn text-white" style="background:#5907DD;" @click="sendProposal(trip._id)">
                  Enviar orçamento
                </button>

                <button class="btn btn-outline-primary" @click="openRouteInGoogleMaps(trip)">
                  Ver trajeto
                </button>

                <button class="btn btn-outline-secondary" @click="viewMap(trip)">
                  Mapa
                </button>
              </div>
            </div>
          </div>
        </div>

        <PanelCard v-if="mapTrip" class="mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 class="mb-0">Rota da viagem</h5>
            <button class="btn btn-outline-secondary btn-sm" @click="mapTrip = null">
              Fechar mapa
            </button>
          </div>

          <TripMapPreview :markers="companyMapMarkers" />

          <div class="mt-3">
            <button class="btn btn-outline-primary" @click="openRouteInGoogleMaps(mapTrip)">
              Abrir no Google Maps
            </button>
          </div>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'vehicles'">
      <PageSection title="Modelos Cadastrados">
        <template #actions>
          <button class="btn text-white" style="background:#5907DD;" @click="showVehicleForm = !showVehicleForm">
            {{ showVehicleForm ? 'Fechar' : 'Cadastrar Modelos' }}
          </button>
        </template>

        <PanelCard v-if="showVehicleForm" class="mb-4">
          <div class="row g-2">
            <div class="col-md-2"><input v-model="vehicleForm.code" class="form-control" placeholder="Código" /></div>
            <div class="col-md-2"><input v-model="vehicleForm.internalId" class="form-control" placeholder="ID" /></div>
            <div class="col-md-3"><input v-model="vehicleForm.model" class="form-control" placeholder="Nome do Modelo" /></div>
            <div class="col-md-2"><input v-model.number="vehicleForm.seats" type="number" class="form-control" placeholder="Lugares" /></div>
            <div class="col-md-1">
              <select v-model="vehicleForm.vehicleType" class="form-select">
                <option value="van">Van</option>
                <option value="microbus">Micro-ônibus</option>
                <option value="bus">Ônibus</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="vehicleForm.comfortType" class="form-select">
                <option value="urbano">Urbano</option>
                <option value="executivo">Executivo</option>
                <option value="leito">Leito</option>
              </select>
            </div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="saveVehicle">
              {{ vehicleForm._id ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </PanelCard>

        <ActionTable :headers="['ID', 'Nome do Modelo', 'Tipo', 'Qtd. de Lugares', 'Conforto']">
          <tr v-for="vehicle in vehicles" :key="vehicle._id">
            <td>{{ vehicle.internalId }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ getVehicleTypeLabel(vehicle.vehicleType) }}</td>
            <td>{{ vehicle.seats }}</td>
            <td>{{ getComfortTypeLabel(vehicle.comfortType) }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="editVehicle(vehicle)">Visualizar</button>
                <button class="btn btn-warning btn-sm" @click="editVehicle(vehicle)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteVehicle(vehicle._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'drivers'">
      <PageSection title="Motoristas">
        <template #actions>
          <button class="btn text-white" style="background:#5907DD;" @click="showDriverForm = !showDriverForm">
            {{ showDriverForm ? 'Fechar' : 'Cadastrar Motorista' }}
          </button>
        </template>

        <PanelCard v-if="showDriverForm" class="mb-4">
          <div class="row g-2">
            <div class="col-md-3"><input v-model="driverForm.name" class="form-control" placeholder="Nome" /></div>
            <div class="col-md-3"><input v-model="driverForm.cpf" class="form-control" placeholder="CPF" /></div>
            <div class="col-md-3"><input v-model="driverForm.phone" class="form-control" placeholder="Telefone" /></div>
            <div class="col-md-3"><input v-model="driverForm.licenseNumber" class="form-control" placeholder="CNH" /></div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="saveDriver">
              {{ driverForm._id ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </PanelCard>

        <ActionTable :headers="['Nome', 'CPF', 'Telefone', 'CNH']">
          <tr v-for="driver in drivers" :key="driver._id">
            <td>{{ driver.name }}</td>
            <td>{{ driver.cpf }}</td>
            <td>{{ driver.phone }}</td>
            <td>{{ driver.licenseNumber }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="editDriver(driver)">Visualizar</button>
                <button class="btn btn-warning btn-sm" @click="editDriver(driver)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteDriver(driver._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'allocated'">
      <PageSection title="Viagens Pagas / Alocação">
        <ActionTable :headers="['Título', 'Tipo', 'Origem', 'Destino', 'Status', 'Pagamento']">
          <tr v-for="trip in assignedTrips" :key="trip._id">
            <td>{{ trip.title }}</td>
            <td>{{ getBusTypeLabel(trip.busType) }}</td>
            <td>{{ trip.originLabel }}</td>
            <td>{{ trip.destinationLabel }}</td>
            <td>{{ getTripStatusLabel(trip.status) }}</td>
            <td>{{ getPaymentStatusLabel(trip.paymentStatus) }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="selectTrip(trip)">Visualizar</button>
                <button class="btn btn-outline-primary btn-sm" @click="openRouteInGoogleMaps(trip)">Trajeto</button>
                <button class="btn btn-outline-secondary btn-sm" @click="viewMap(trip)">Mapa</button>
                <button class="btn btn-danger btn-sm" @click="cancelCompanyTrip(trip._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>

        <PanelCard v-if="selectedTrip" class="mt-4">
          <h5 class="mb-3">Alocar Veículo e Motorista</h5>

          <div class="row g-2">
            <div class="col-md-5">
              <select v-model="allocationForms[selectedTrip._id].vehicleId" class="form-select">
                <option value="">Selecione veículo</option>
                <option v-for="vehicle in vehicles" :key="vehicle._id" :value="vehicle._id">
                  {{ vehicle.code }} - {{ vehicle.model }}
                </option>
              </select>
            </div>

            <div class="col-md-5">
              <select v-model="allocationForms[selectedTrip._id].driverId" class="form-select">
                <option value="">Selecione motorista</option>
                <option v-for="driver in drivers" :key="driver._id" :value="driver._id">
                  {{ driver.name }}
                </option>
              </select>
            </div>

            <div class="col-md-2">
              <button class="btn text-white w-100" style="background:#5907DD;" @click="allocate(selectedTrip._id)">
                Salvar
              </button>
            </div>
          </div>
        </PanelCard>

        <PanelCard v-if="mapTrip" class="mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 class="mb-0">Rota da viagem</h5>
            <button class="btn btn-outline-secondary btn-sm" @click="mapTrip = null">
              Fechar mapa
            </button>
          </div>

          <TripMapPreview :markers="companyMapMarkers" />

          <div class="mt-3">
            <button class="btn btn-outline-primary" @click="openRouteInGoogleMaps(mapTrip)">
              Abrir no Google Maps
            </button>
          </div>
        </PanelCard>
      </PageSection>
    </template>
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
import {
  getBusTypeLabel,
  getComfortTypeLabel,
  getPaymentStatusLabel,
  getTripStatusLabel,
  getVehicleTypeLabel
} from '../utils/labels'

const router = useRouter()
const activeSection = ref('quotes')
const showVehicleForm = ref(false)
const showDriverForm = ref(false)
const showProfileForm = ref(false)

const openTrips = ref<any[]>([])
const vehicles = ref<any[]>([])
const drivers = ref<any[]>([])
const assignedTrips = ref<any[]>([])
const selectedTrip = ref<any | null>(null)
const mapTrip = ref<any | null>(null)
const proposalForms = ref<Record<string, any>>({})
const allocationForms = ref<Record<string, any>>({})
const currentUser = ref<any>(null)
const message = ref('')
const errorMessage = ref('')

const menuItems = [
  { key: 'profile', label: 'Empresa', icon: 'building' },
  { key: 'quotes', label: 'Solicitações', icon: 'clipboard-list' },
  { key: 'vehicles', label: 'Veículos', icon: 'bus' },
  { key: 'drivers', label: 'Motoristas', icon: 'users' },
  { key: 'allocated', label: 'Alocação', icon: 'road' }
]

const profileForm = ref({
  id: '',
  name: '',
  email: '',
  phone: ''
})

const profileSnapshot = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const vehicleForm = ref<any>({
  _id: '',
  code: '',
  internalId: '',
  model: '',
  seats: '',
  vehicleType: 'bus',
  comfortType: 'urbano'
})

const driverForm = ref<any>({
  _id: '',
  name: '',
  cpf: '',
  phone: '',
  licenseNumber: ''
})

const companyName = computed(() => currentUser.value?.name || 'Empresa')

const profileItems = computed(() => [
  { label: 'ID', value: profileForm.value.id || '-' },
  { label: 'Nome', value: profileForm.value.name || '-' },
  { label: 'E-mail', value: profileForm.value.email || '-' },
  { label: 'Telefone', value: profileForm.value.phone || '-' }
])

const companyMapMarkers = computed(() => {
  if (!mapTrip.value) return []

  const markers: Array<{ lat: number; lng: number; label: string }> = []

  if (typeof mapTrip.value.originLat === 'number' && typeof mapTrip.value.originLng === 'number') {
    markers.push({
      lat: mapTrip.value.originLat,
      lng: mapTrip.value.originLng,
      label: `Origem: ${mapTrip.value.originLabel}`
    })
  }

  ;(mapTrip.value.stops || []).forEach((stop: any, index: number) => {
    if (typeof stop.lat === 'number' && typeof stop.lng === 'number') {
      markers.push({
        lat: stop.lat,
        lng: stop.lng,
        label: `Parada ${index + 1}: ${stop.label}`
      })
    }
  })

  if (
    typeof mapTrip.value.destinationLat === 'number' &&
    typeof mapTrip.value.destinationLng === 'number'
  ) {
    markers.push({
      lat: mapTrip.value.destinationLat,
      lng: mapTrip.value.destinationLng,
      label: `Destino: ${mapTrip.value.destinationLabel}`
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

function shortRoute(origin: string, destination: string) {
  return `${origin.split(',')[0] || origin} - ${destination.split(',')[0] || destination}`
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

function resetVehicleForm() {
  vehicleForm.value = {
    _id: '',
    code: '',
    internalId: '',
    model: '',
    seats: '',
    vehicleType: 'bus',
    comfortType: 'urbano'
  }
}

function resetDriverForm() {
  driverForm.value = {
    _id: '',
    name: '',
    cpf: '',
    phone: '',
    licenseNumber: ''
  }
}

async function loadMe() {
  const response = await api.get('/auth/me')
  const { user, profile } = response.data

  profileForm.value = {
    id: user._id,
    name: user.name || '',
    email: user.email || '',
    phone: profile?.phone || ''
  }

  profileSnapshot.value = {
    name: user.name || '',
    email: user.email || '',
    phone: profile?.phone || ''
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

  currentUser.value = JSON.parse(localStorage.getItem('user') || '{}')
}

function cancelProfileEdit() {
  profileForm.value = {
    ...profileForm.value,
    ...profileSnapshot.value
  }
  showProfileForm.value = false
}

async function updateProfile() {
  try {
    await api.put('/auth/me', {
      name: profileForm.value.name,
      email: profileForm.value.email,
      phone: profileForm.value.phone
    })

    message.value = 'Perfil atualizado com sucesso'
    errorMessage.value = ''
    showProfileForm.value = false
    await loadMe()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar perfil'
    message.value = ''
  }
}

async function changePassword() {
  try {
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
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao alterar senha'
    message.value = ''
  }
}

async function loadOpenTrips() {
  const response = await api.get('/trips/open')
  openTrips.value = response.data

  openTrips.value.forEach((trip) => {
    if (!proposalForms.value[trip._id]) {
      proposalForms.value[trip._id] = { amount: '', notes: '' }
    }
  })
}

async function loadVehicles() {
  const response = await api.get('/vehicles')
  vehicles.value = response.data
}

async function loadDrivers() {
  const response = await api.get('/drivers')
  drivers.value = response.data
}

async function loadAssignedTrips() {
  const response = await api.get('/trips/company')
  assignedTrips.value = response.data

  assignedTrips.value.forEach((trip) => {
    if (!allocationForms.value[trip._id]) {
      allocationForms.value[trip._id] = { vehicleId: '', driverId: '' }
    }
  })
}

async function sendProposal(tripId: string) {
  const form = proposalForms.value[tripId]
  await api.post('/proposals', {
    tripId,
    amount: Number(form.amount),
    notes: form.notes
  })
  await loadOpenTrips()
}

async function saveVehicle() {
  if (vehicleForm.value._id) {
    await api.put(`/vehicles/${vehicleForm.value._id}`, vehicleForm.value)
  } else {
    await api.post('/vehicles', vehicleForm.value)
  }

  resetVehicleForm()
  showVehicleForm.value = false
  await loadVehicles()
}

function editVehicle(vehicle: any) {
  vehicleForm.value = { ...vehicle }
  showVehicleForm.value = true
}

async function deleteVehicle(id: string) {
  await api.delete(`/vehicles/${id}`)
  await loadVehicles()
}

async function saveDriver() {
  if (driverForm.value._id) {
    await api.put(`/drivers/${driverForm.value._id}`, driverForm.value)
  } else {
    await api.post('/drivers', driverForm.value)
  }

  resetDriverForm()
  showDriverForm.value = false
  await loadDrivers()
}

function editDriver(driver: any) {
  driverForm.value = { ...driver }
  showDriverForm.value = true
}

async function deleteDriver(id: string) {
  await api.delete(`/drivers/${id}`)
  await loadDrivers()
}

function selectTrip(trip: any) {
  selectedTrip.value = trip
}

function viewMap(trip: any) {
  mapTrip.value = trip
}

async function allocate(tripId: string) {
  const form = allocationForms.value[tripId]
  await api.patch(`/trips/${tripId}/allocate`, {
    vehicleId: form.vehicleId,
    driverId: form.driverId
  })
  await loadAssignedTrips()
}

async function cancelCompanyTrip(tripId: string) {
  await api.patch(`/trips/${tripId}/cancel/company`)
  await loadAssignedTrips()
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(async () => {
  await loadMe()

  await Promise.all([
    loadOpenTrips(),
    loadVehicles(),
    loadDrivers(),
    loadAssignedTrips()
  ])
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
}
</style>
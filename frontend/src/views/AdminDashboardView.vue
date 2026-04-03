<template>
  <AppSidebar
    title="Admin"
    v-model="activeSection"
    :items="menuItems"
    @logout="logout"
  >
    <template v-if="activeSection === 'users'">
      <PageSection title="Usuários">
        <template #actions>
          <button class="btn text-white" style="background:#5907DD;" @click="showCreateUser = !showCreateUser">
            {{ showCreateUser ? 'Fechar' : 'Cadastrar Usuário' }}
          </button>
        </template>

        <PanelCard v-if="showCreateUser" class="mb-4">
          <div class="row g-2">
            <div class="col-md-3"><input v-model="userForm.name" class="form-control" placeholder="Nome" /></div>
            <div class="col-md-3"><input v-model="userForm.email" class="form-control" placeholder="E-mail" /></div>
            <div class="col-md-2"><input v-model="userForm.password" type="password" class="form-control" placeholder="Senha" /></div>
            <div class="col-md-2">
              <select v-model="userForm.role" class="form-select">
                <option value="admin">Admin</option>
                <option value="company">Empresa</option>
                <option value="client">Contratante</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="userForm.status" class="form-select">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div class="row g-2 mt-2" v-if="userForm.role === 'company'">
            <div class="col-md-4"><input v-model="userForm.legalName" class="form-control" placeholder="Razão social" /></div>
            <div class="col-md-4"><input v-model="userForm.tradeName" class="form-control" placeholder="Nome fantasia" /></div>
            <div class="col-md-4"><input v-model="userForm.cnpj" class="form-control" placeholder="CNPJ" /></div>
          </div>

          <div class="row g-2 mt-2" v-if="userForm.role === 'client'">
            <div class="col-md-3">
              <select v-model="userForm.personType" class="form-select">
                <option value="pf">PF</option>
                <option value="pj">PJ</option>
              </select>
            </div>
            <div class="col-md-4" v-if="userForm.personType === 'pf'">
              <input v-model="userForm.cpf" class="form-control" placeholder="CPF" />
            </div>
            <div class="col-md-4" v-if="userForm.personType === 'pj'">
              <input v-model="userForm.cnpj" class="form-control" placeholder="CNPJ" />
            </div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="createUser">
              Salvar
            </button>
          </div>
        </PanelCard>

        <ActionTable :headers="['ID', 'Nome', 'E-mail', 'Perfil', 'Status']">
          <tr v-for="user in overview.users" :key="user._id">
            <td>{{ user._id.slice(-5) }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="editUser(user)">Visualizar</button>
                <button class="btn btn-warning btn-sm" @click="editUser(user)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteUser(user._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>

        <PanelCard v-if="editingUser" class="mt-4">
          <h5 class="mb-3">Editar Usuário</h5>
          <div class="row g-2">
            <div class="col-md-3"><input v-model="editingUser.name" class="form-control" /></div>
            <div class="col-md-3"><input v-model="editingUser.email" class="form-control" /></div>
            <div class="col-md-3">
              <select v-model="editingUser.role" class="form-select">
                <option value="admin">Admin</option>
                <option value="company">Empresa</option>
                <option value="client">Contratante</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="editingUser.status" class="form-select">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div class="mt-3 d-flex gap-2 flex-wrap">
            <button class="btn text-white" style="background:#5907DD;" @click="updateUser">Salvar</button>
            <button class="btn btn-outline-secondary" @click="editingUser = null">Cancelar</button>
          </div>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'companies'">
      <PageSection title="Empresas">
        <template #actions>
          <button class="btn text-white" style="background:#5907DD;" @click="showCreateCompany = !showCreateCompany">
            {{ showCreateCompany ? 'Fechar' : 'Cadastrar Empresa' }}
          </button>
        </template>

        <PanelCard v-if="showCreateCompany" class="mb-4">
          <div class="row g-2">
            <div class="col-md-3"><input v-model="companyForm.userName" class="form-control" placeholder="Nome do usuário" /></div>
            <div class="col-md-3"><input v-model="companyForm.email" class="form-control" placeholder="E-mail" /></div>
            <div class="col-md-3"><input v-model="companyForm.password" type="password" class="form-control" placeholder="Senha" /></div>
            <div class="col-md-3"><input v-model="companyForm.phone" class="form-control" placeholder="Telefone" /></div>
            <div class="col-md-4"><input v-model="companyForm.legalName" class="form-control" placeholder="Razão social" /></div>
            <div class="col-md-4"><input v-model="companyForm.tradeName" class="form-control" placeholder="Nome fantasia" /></div>
            <div class="col-md-4"><input v-model="companyForm.cnpj" class="form-control" placeholder="CNPJ" /></div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="createCompany">
              Salvar
            </button>
          </div>
        </PanelCard>

        <ActionTable :headers="['ID', 'Fantasia', 'Razão social', 'CNPJ', 'E-mail']">
          <tr v-for="company in overview.companies" :key="company._id">
            <td>{{ company._id.slice(-5) }}</td>
            <td>{{ company.tradeName }}</td>
            <td>{{ company.legalName }}</td>
            <td>{{ company.cnpj }}</td>
            <td>{{ company.user?.email }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="editCompany(company)">Visualizar</button>
                <button class="btn btn-warning btn-sm" @click="editCompany(company)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteCompany(company._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>

        <PanelCard v-if="editingCompany" class="mt-4">
          <h5 class="mb-3">Editar Empresa</h5>
          <div class="row g-2">
            <div class="col-md-3"><input v-model="editingCompany.userName" class="form-control" /></div>
            <div class="col-md-3"><input v-model="editingCompany.email" class="form-control" /></div>
            <div class="col-md-2"><input v-model="editingCompany.tradeName" class="form-control" /></div>
            <div class="col-md-2"><input v-model="editingCompany.cnpj" class="form-control" /></div>
            <div class="col-md-2"><input v-model="editingCompany.phone" class="form-control" /></div>
          </div>

          <div class="mt-3 d-flex gap-2 flex-wrap">
            <button class="btn text-white" style="background:#5907DD;" @click="updateCompany">Salvar</button>
            <button class="btn btn-outline-secondary" @click="editingCompany = null">Cancelar</button>
          </div>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'trips'">
      <PageSection title="Viagens">
        <template #actions>
          <button class="btn text-white" style="background:#5907DD;" @click="showCreateTrip = !showCreateTrip">
            {{ showCreateTrip ? 'Fechar' : 'Cadastrar Viagem' }}
          </button>
        </template>

        <PanelCard v-if="showCreateTrip" class="mb-4">
          <div class="row g-2">
            <div class="col-md-3">
              <select v-model="tripForm.clientUser" class="form-select">
                <option value="">Selecione contratante</option>
                <option v-for="user in clientUsers" :key="user._id" :value="user._id">
                  {{ user.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="tripForm.companyUser" class="form-select">
                <option value="">Sem empresa</option>
                <option v-for="user in companyUsers" :key="user._id" :value="user._id">
                  {{ user.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2"><input v-model="tripForm.title" class="form-control" placeholder="Título" /></div>
            <div class="col-md-2">
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
            <div class="col-md-2"><input v-model="tripForm.tripDate" type="datetime-local" class="form-control" /></div>
            <div class="col-md-6"><input v-model="tripForm.originLabel" class="form-control" placeholder="Origem" /></div>
            <div class="col-md-6"><input v-model="tripForm.destinationLabel" class="form-control" placeholder="Destino" /></div>
            <div class="col-md-3"><input v-model.number="tripForm.maxPassengers" type="number" class="form-control" placeholder="Qtd pessoas" /></div>
            <div class="col-md-3">
              <select v-model="tripForm.status" class="form-select">
                <option value="requested">requested</option>
                <option value="quoted">quoted</option>
                <option value="accepted">accepted</option>
                <option value="paid">paid</option>
                <option value="preparing_trip">preparing_trip</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="tripForm.paymentStatus" class="form-select">
                <option value="not_paid">not_paid</option>
                <option value="paid">paid</option>
              </select>
            </div>
            <div class="col-md-3"><input v-model="tripForm.notes" class="form-control" placeholder="Observações" /></div>
          </div>

          <div class="mt-3">
            <button class="btn text-white" style="background:#5907DD;" @click="createTrip">
              Salvar
            </button>
          </div>
        </PanelCard>

        <ActionTable :headers="['Título', 'Tipo', 'Cliente', 'Empresa', 'Status', 'Pagamento']">
          <tr v-for="trip in overview.trips" :key="trip._id">
            <td>{{ trip.title }}</td>
            <td>{{ getBusTypeLabel(trip.busType) }}</td>
            <td>{{ trip.clientUser?.name }}</td>
            <td>{{ trip.companyUser?.name || '-' }}</td>
            <td>{{ getTripStatusLabel(trip.status) }}</td>
            <td>{{ getPaymentStatusLabel(trip.paymentStatus) }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-primary btn-sm" @click="editTrip(trip)">Visualizar</button>
                <button class="btn btn-warning btn-sm" @click="editTrip(trip)">Editar</button>
                <button class="btn btn-success btn-sm" @click="markTripPaid(trip._id)">Pago</button>
                <button class="btn btn-danger btn-sm" @click="deleteTrip(trip._id)">Excluir</button>
              </div>
            </td>
          </tr>
        </ActionTable>

        <PanelCard v-if="editingTrip" class="mt-4">
          <h5 class="mb-3">Editar Viagem</h5>
          <div class="row g-2">
            <div class="col-md-3"><input v-model="editingTrip.title" class="form-control" /></div>
            <div class="col-md-3">
              <select v-model="editingTrip.busType" class="form-select">
                <option value="van">Van</option>
                <option value="micro_urbano">Micro urbano</option>
                <option value="midi_urbano">Midi urbano</option>
                <option value="urbano">Urbano</option>
                <option value="executivo">Executivo</option>
                <option value="semileito">Semileito</option>
                <option value="leito">Leito</option>
              </select>
            </div>
            <div class="col-md-3"><input v-model="editingTrip.originLabel" class="form-control" /></div>
            <div class="col-md-3"><input v-model="editingTrip.destinationLabel" class="form-control" /></div>
            <div class="col-md-3"><input v-model="editingTrip.tripDate" type="datetime-local" class="form-control" /></div>
            <div class="col-md-3"><input v-model.number="editingTrip.maxPassengers" type="number" class="form-control" /></div>
            <div class="col-md-3">
              <select v-model="editingTrip.status" class="form-select">
                <option value="requested">requested</option>
                <option value="quoted">quoted</option>
                <option value="accepted">accepted</option>
                <option value="paid">paid</option>
                <option value="preparing_trip">preparing_trip</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="editingTrip.paymentStatus" class="form-select">
                <option value="not_paid">not_paid</option>
                <option value="paid">paid</option>
              </select>
            </div>
          </div>

          <div class="mt-3 d-flex gap-2 flex-wrap">
            <button class="btn text-white" style="background:#5907DD;" @click="updateTrip">Salvar</button>
            <button class="btn btn-outline-secondary" @click="editingTrip = null">Cancelar</button>
          </div>
        </PanelCard>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'payments'">
      <PageSection title="Pagamentos">
        <ActionTable :headers="['Viagem', 'Cliente', 'Empresa', 'Valor', 'Status']">
          <tr v-for="payment in overview.payments" :key="payment._id">
            <td>{{ payment.trip?.title }}</td>
            <td>{{ payment.clientUser?.name }}</td>
            <td>{{ payment.companyUser?.name || '-' }}</td>
            <td>R$ {{ payment.amount }}</td>
            <td>{{ getPaymentStatusLabel(payment.status) }}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button
                  v-if="payment.status !== 'paid'"
                  class="btn btn-success btn-sm"
                  @click="validatePayment(payment._id)"
                >
                  Validar pagamento
                </button>

                <button
                  v-if="payment.trip?._id"
                  class="btn btn-outline-primary btn-sm"
                  @click="openReceipt(payment.trip._id)"
                >
                  Comprovante
                </button>
              </div>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>

    <template v-else-if="activeSection === 'vehicles'">
      <PageSection title="Veículos">
        <ActionTable :headers="['Empresa', 'Código', 'ID', 'Modelo', 'Lugares']">
          <tr v-for="vehicle in overview.vehicles" :key="vehicle._id">
            <td>{{ vehicle.companyUser?.name }}</td>
            <td>{{ vehicle.code }}</td>
            <td>{{ vehicle.internalId }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ vehicle.seats }}</td>
            <td>
              <button class="btn btn-primary btn-sm me-1">Visualizar</button>
            </td>
          </tr>
        </ActionTable>
      </PageSection>
    </template>
  </AppSidebar>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import AppSidebar from '../components/AppSidebar.vue'
import PageSection from '../components/PageSection.vue'
import PanelCard from '../components/PanelCard.vue'
import ActionTable from '../components/ActionTable.vue'
import {
  getBusTypeLabel,
  getPaymentStatusLabel,
  getTripStatusLabel
} from '../utils/labels'

const router = useRouter()
const activeSection = ref('users')
const showCreateUser = ref(false)
const showCreateCompany = ref(false)
const showCreateTrip = ref(false)
const editingUser = ref<any | null>(null)
const editingCompany = ref<any | null>(null)
const editingTrip = ref<any | null>(null)

const menuItems = [
  { key: 'users', label: 'Usuários', icon: 'users' },
  { key: 'companies', label: 'Empresas', icon: 'building' },
  { key: 'trips', label: 'Viagens', icon: 'road' },
  { key: 'payments', label: 'Pagamentos', icon: 'credit-card' },
  { key: 'vehicles', label: 'Veículos', icon: 'bus' }
]

const overview = reactive<any>({
  users: [],
  companies: [],
  clients: [],
  trips: [],
  payments: [],
  proposals: [],
  vehicles: [],
  drivers: []
})

const userForm = ref<any>({
  name: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'active',
  personType: 'pf',
  cpf: '',
  cnpj: '',
  legalName: '',
  tradeName: '',
  phone: ''
})

const companyForm = ref<any>({
  userName: '',
  email: '',
  password: '',
  legalName: '',
  tradeName: '',
  cnpj: '',
  phone: ''
})

const tripForm = ref<any>({
  clientUser: '',
  companyUser: '',
  title: '',
  busType: 'urbano',
  originLabel: '',
  destinationLabel: '',
  maxPassengers: 1,
  tripDate: '',
  notes: '',
  status: 'requested',
  paymentStatus: 'not_paid'
})

const clientUsers = computed(() =>
  overview.users.filter((user: any) => user.role === 'client')
)

const companyUsers = computed(() =>
  overview.users.filter((user: any) => user.role === 'company')
)

function normalizeDatetime(value: string) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

async function loadOverview() {
  const response = await api.get('/admin/overview')
  Object.assign(overview, response.data)
}

async function createUser() {
  await api.post('/admin/users', userForm.value)
  showCreateUser.value = false
  await loadOverview()
}

function editUser(user: any) {
  editingUser.value = { ...user }
}

async function updateUser() {
  await api.put(`/admin/users/${editingUser.value._id}`, editingUser.value)
  editingUser.value = null
  await loadOverview()
}

async function deleteUser(id: string) {
  await api.delete(`/admin/users/${id}`)
  await loadOverview()
}

async function createCompany() {
  await api.post('/admin/companies', companyForm.value)
  showCreateCompany.value = false
  await loadOverview()
}

function editCompany(company: any) {
  editingCompany.value = {
    _id: company._id,
    userName: company.user?.name || '',
    email: company.user?.email || '',
    status: company.user?.status || 'active',
    legalName: company.legalName,
    tradeName: company.tradeName,
    cnpj: company.cnpj,
    phone: company.phone || ''
  }
}

async function updateCompany() {
  await api.put(`/admin/companies/${editingCompany.value._id}`, editingCompany.value)
  editingCompany.value = null
  await loadOverview()
}

async function deleteCompany(id: string) {
  await api.delete(`/admin/companies/${id}`)
  await loadOverview()
}

async function createTrip() {
  await api.post('/admin/trips', tripForm.value)
  showCreateTrip.value = false
  await loadOverview()
}

function editTrip(trip: any) {
  editingTrip.value = {
    ...trip,
    tripDate: normalizeDatetime(trip.tripDate)
  }
}

async function updateTrip() {
  await api.put(`/admin/trips/${editingTrip.value._id}`, editingTrip.value)
  editingTrip.value = null
  await loadOverview()
}

async function deleteTrip(id: string) {
  await api.delete(`/admin/trips/${id}`)
  await loadOverview()
}

async function markTripPaid(id: string) {
  await api.patch(`/admin/trips/${id}/mark-paid`)
  await loadOverview()
}

async function validatePayment(paymentId: string) {
  await api.patch(`/admin/payments/${paymentId}/validate`)
  await loadOverview()
}

function openReceipt(tripId: string) {
  window.open(`/payment/${tripId}/receipt`, '_blank')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(loadOverview)
</script>
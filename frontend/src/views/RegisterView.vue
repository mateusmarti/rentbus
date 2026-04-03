<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="mb-4 text-center" style="color: #5907dd">Cadastro</h2>

            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Tipo de cadastro</label>
                <select v-model="role" class="form-select">
                  <option value="company">Empresa</option>
                  <option value="client">Contratante</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Nome</label>
                <input v-model="name" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">E-mail</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>

              <div v-if="role === 'company'">
                <div class="mb-3">
                  <label class="form-label">Razão social</label>
                  <input v-model="legalName" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Nome fantasia</label>
                  <input v-model="tradeName" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">CNPJ</label>
                  <input
                    :value="cnpj"
                    @input="handleCnpjInput"
                    class="form-control"
                    maxlength="18"
                    placeholder="00.000.000/0000-00"
                    required
                  />
                  <small v-if="cnpj && !isCnpjComplete" class="text-danger">
                    Digite um CNPJ válido no formato 00.000.000/0000-00
                  </small>
                </div>
              </div>

              <div v-if="role === 'client'">
                <div class="mb-3">
                  <label class="form-label">Tipo de pessoa</label>
                  <select v-model="personType" class="form-select">
                    <option value="pf">Pessoa Física</option>
                    <option value="pj">Pessoa Jurídica</option>
                  </select>
                </div>

                <div class="mb-3" v-if="personType === 'pf'">
                  <label class="form-label">CPF</label>
                  <input
                    :value="cpf"
                    @input="handleCpfInput"
                    class="form-control"
                    maxlength="14"
                    placeholder="000.000.000-00"
                    required
                  />
                  <small v-if="cpf && !isCpfComplete" class="text-danger">
                    Digite um CPF válido no formato 000.000.000-00
                  </small>
                </div>
                <div class="mb-3" v-if="personType === 'pj'">
                  <label class="form-label">CNPJ</label>
                  <input
                    :value="cnpj"
                    @input="handleCnpjInput"
                    class="form-control"
                    maxlength="18"
                    placeholder="00.000.000/0000-00"
                    required
                  />
                  <small v-if="cnpj && !isCnpjComplete" class="text-danger">
                    Digite um CNPJ válido no formato 00.000.000/0000-00
                  </small>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Telefone</label>
                <input
                  :value="phone"
                  @input="handlePhoneInput"
                  class="form-control"
                  maxlength="15"
                  placeholder="(21) 99999-9999"
                  required
                />
                <small v-if="phone && !isPhoneComplete" class="text-danger">
                  Digite um telefone válido no formato (00) 00000-0000
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label">Endereço</label>
                <input v-model="address" class="form-control" />
              </div>

              <button
                type="submit"
                class="btn w-100 text-white"
                style="background-color: #5907dd"
                :disabled="!isFormValid"
              >
                Cadastrar
              </button>
            </form>

            <p class="mt-3 text-center">
              Já tem conta?
              <router-link to="/login">Faça login</router-link>
            </p>

            <p v-if="message" class="text-success mt-3 text-center">{{ message }}</p>
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
import { computed, ref } from "vue";
import api from "../services/api";

const role = ref("company");
const name = ref("");
const email = ref("");
const password = ref("");
const legalName = ref("");
const tradeName = ref("");
const cnpj = ref("");
const personType = ref("pf");
const cpf = ref("");
const phone = ref("");
const message = ref("");
const errorMessage = ref("");

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function handleCpfInput(event: Event) {
  const target = event.target as HTMLInputElement;
  cpf.value = formatCpf(target.value);
}

function handlePhoneInput(event: Event) {
  const target = event.target as HTMLInputElement;
  phone.value = formatPhone(target.value);
}

function handleCnpjInput(event: Event) {
  const target = event.target as HTMLInputElement
  cnpj.value = formatCnpj(target.value)
}

const isCpfComplete = computed(() => onlyDigits(cpf.value).length === 11);
const isCnpjComplete = computed(() => onlyDigits(cnpj.value).length === 14)
const isPhoneComplete = computed(() => {
  const len = onlyDigits(phone.value).length;
  return len === 10 || len === 11;
});

const isCompanyValid = computed(() => {
  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    legalName.value.trim() !== "" &&
    tradeName.value.trim() !== "" &&
    cnpj.value.trim() !== "" &&
    isPhoneComplete.value
  );
});

const isClientValid = computed(() => {
  if (personType.value === "pf") {
    return (
      name.value.trim() !== "" &&
      email.value.trim() !== "" &&
      password.value.trim() !== "" &&
      cpf.value.trim() !== "" &&
      isCpfComplete.value &&
      isPhoneComplete.value
    );
  }

  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    cnpj.value.trim() !== "" &&
    isPhoneComplete.value
  );
});

const isFormValid = computed(() => {
  if (role.value === "company") return isCompanyValid.value;
  return isClientValid.value;
});

async function handleRegister() {
  try {
    message.value = "";
    errorMessage.value = "";

    if (!isFormValid.value) {
      errorMessage.value = "Preencha corretamente todos os campos obrigatórios.";
      return;
    }

    await api.post("/auth/register", {
      role: role.value,
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      legalName: legalName.value.trim(),
      tradeName: tradeName.value.trim(),
      cnpj: onlyDigits(cnpj.value),
      personType: personType.value,
      cpf: onlyDigits(cpf.value),
      phone: onlyDigits(phone.value),
    });

    message.value = "Cadastro realizado com sucesso";
    errorMessage.value = "";

    name.value = "";
    email.value = "";
    password.value = "";
    legalName.value = "";
    tradeName.value = "";
    cnpj.value = "";
    cpf.value = "";
    phone.value = "";
    personType.value = "pf";
    role.value = "company";
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Erro ao cadastrar";
  }
}
</script>

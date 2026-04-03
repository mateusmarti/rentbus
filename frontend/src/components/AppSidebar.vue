<template>
  <div class="layout-shell">
    <div
      v-if="isMobile && expanded"
      class="sidebar-backdrop"
      @click="expanded = false"
    ></div>

    <aside
      class="sidebar"
      :class="{
        mobile: isMobile,
        mobileOpen: isMobile && expanded,
        desktopCollapsed: !isMobile && !expanded
      }"
    >
      <div class="sidebar-top">
        <div class="brand-circle">
          <font-awesome-icon :icon="['fas', 'bus']" />
        </div>
        <span v-if="expanded || isMobile" class="brand-text">RentBus</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in items"
          :key="item.key"
          class="nav-item-btn"
          :class="{ active: modelValue === item.key }"
          @click="handleSelect(item.key)"
          :title="item.label"
          type="button"
        >
          <span class="nav-icon">
            <font-awesome-icon :icon="['fas', item.icon]" />
          </span>
          <span v-if="expanded || isMobile" class="nav-label">
            {{ item.label }}
          </span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <button class="nav-item-btn" @click="$emit('logout')" title="Sair" type="button">
          <span class="nav-icon">
            <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          </span>
          <span v-if="expanded || isMobile" class="nav-label">Sair</span>
        </button>
      </div>
    </aside>

    <main
      class="content-area"
      :class="{ contentExpanded: !isMobile && expanded, contentCollapsed: !isMobile && !expanded }"
    >
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger-btn" @click="toggleSidebar" type="button">
            <font-awesome-icon :icon="['fas', 'bars']" />
          </button>
          <h1 class="topbar-title">{{ title }}</h1>
        </div>
      </header>

      <section class="content-wrapper">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type SidebarItem = {
  key: string
  label: string
  icon: string
}

defineProps<{
  title: string
  items: SidebarItem[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'logout'): void
}>()

const DESKTOP_EXPANDED_WIDTH = 220
const DESKTOP_COLLAPSED_WIDTH = 78
const MOBILE_WIDTH = 220

const windowWidth = ref(window.innerWidth)
const expanded = ref(true)

const isMobile = computed(() => windowWidth.value <= 991)

function handleResize() {
  windowWidth.value = window.innerWidth

  if (isMobile.value) {
    expanded.value = false
  } else if (expanded.value === false) {
    // mantém o estado atual no desktop se o usuário recolheu manualmente
  } else {
    expanded.value = true
  }
}

function toggleSidebar() {
  expanded.value = !expanded.value
}

function handleSelect(key: string) {
  emit('update:modelValue', key)

  if (isMobile.value) {
    expanded.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  background: #eef0f5;
  position: relative;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 29;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: #5907dd;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 30;
  transition: width 0.25s ease, transform 0.25s ease;
}

.sidebar.desktopCollapsed {
  width: 78px;
}

.sidebar.mobile {
  width: 220px;
  transform: translateX(-100%);
}

.sidebar.mobile.mobileOpen {
  transform: translateX(0);
}

.sidebar-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 18px;
  min-height: 72px;
  flex-shrink: 0;
}

.brand-circle {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff22;
  font-size: 18px;
  flex-shrink: 0;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 10px;
  flex: 1;
  min-height: 0;
}

.sidebar-bottom {
  margin-top: auto;
  padding: 12px 10px 18px;
  flex-shrink: 0;
}

.nav-item-btn {
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 12px;
  transition: 0.2s ease;
  width: 100%;
  text-align: left;
}

.nav-item-btn:hover,
.nav-item-btn.active {
  background: #ffffff20;
}

.nav-icon {
  width: 24px;
  min-width: 24px;
  text-align: center;
  font-size: 18px;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-area {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s ease;
}

.content-area.contentExpanded {
  margin-left: 220px;
}

.content-area.contentCollapsed {
  margin-left: 78px;
}

.topbar {
  min-height: 72px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  background: #eef0f5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hamburger-btn {
  border: 0;
  background: transparent;
  color: #5907dd;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.topbar-title {
  margin: 0;
  color: #5907dd;
  font-size: 24px;
  font-weight: 700;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  padding: 0 18px 24px;
  overflow-x: hidden;
}

@media (max-width: 991px) {
  .content-area,
  .content-area.contentExpanded,
  .content-area.contentCollapsed {
    margin-left: 0;
  }

  .topbar {
    padding: 0 14px;
  }

  .content-wrapper {
    padding: 0 14px 20px;
  }

  .topbar-title {
    font-size: 22px;
  }
}
</style>
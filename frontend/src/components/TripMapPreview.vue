<template>
  <div class="map-wrapper">
    <div ref="mapEl" class="map-box"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'

type MarkerItem = {
  lat: number | string | null
  lng: number | string | null
  label: string
}

const props = defineProps<{
  markers: MarkerItem[]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
let routeLayer: L.GeoJSON | null = null

function toNumber(value: number | string | null): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

async function drawRoute(points: Array<{ lat: number; lng: number }>) {
  if (!map) return

  if (routeLayer) {
    map.removeLayer(routeLayer)
    routeLayer = null
  }

  if (points.length < 2) return

  try {
    const coordinates = points.map((p) => `${p.lng},${p.lat}`).join(';')

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
    )

    const data = await response.json()

    if (!data?.routes?.length) return

    routeLayer = L.geoJSON(data.routes[0].geometry, {
      style: {
        color: '#5907DD',
        weight: 5,
        opacity: 0.9
      }
    }).addTo(map)
  } catch {
    routeLayer = null
  }
}

async function renderMap() {
  if (!map) return

  if (markerLayer) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }

  const validMarkers = props.markers
    .map((m) => ({
      lat: toNumber(m.lat),
      lng: toNumber(m.lng),
      label: m.label
    }))
    .filter(
      (m): m is { lat: number; lng: number; label: string } =>
        m.lat !== null && m.lng !== null
    )

  if (validMarkers.length === 0) {
    map.setView([-22.9068, -43.1729], 10)
    if (routeLayer) {
      map.removeLayer(routeLayer)
      routeLayer = null
    }
    return
  }

  const latlngs: L.LatLngExpression[] = []

  validMarkers.forEach((marker, index) => {
    latlngs.push([marker.lat, marker.lng])

    L.circleMarker([marker.lat, marker.lng], {
      radius: 8,
      color: '#5907DD',
      fillColor: index === 0 ? '#5907DD' : '#FBA504',
      fillOpacity: 0.9,
      weight: 2
    })
      .bindPopup(marker.label)
      .addTo(markerLayer!)
  })

  await drawRoute(validMarkers)

  const bounds = L.latLngBounds(latlngs)
  map.fitBounds(bounds, { padding: [20, 20] })
}

onMounted(async () => {
  await nextTick()

  if (!mapEl.value) return

  map = L.map(mapEl.value).setView([-22.9068, -43.1729], 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  await renderMap()
})

watch(
  () => props.markers,
  async () => {
    await nextTick()
    await renderMap()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
}

.map-box {
  height: 320px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .map-box {
    height: 260px;
  }
}
</style>
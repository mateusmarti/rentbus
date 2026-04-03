export function getTripStatusLabel(status: string) {
  const labels: Record<string, string> = {
    requested: 'Solicitada',
    quoted: 'Com orçamentos',
    accepted: 'Orçamento aceito',
    paid: 'Paga',
    preparing_trip: 'Preparando viagem',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada'
  }

  return labels[status] || status
}

export function getPaymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    not_paid: 'Não pago',
    pending: 'Pendente',
    paid: 'Pago',
    refunded: 'Estornado',
    cancelled: 'Cancelado'
  }

  return labels[status] || status
}

export function getVehicleTypeLabel(type: string) {
  const labels: Record<string, string> = {
    van: 'Van',
    microbus: 'Micro-ônibus',
    bus: 'Ônibus'
  }

  return labels[type] || type
}

export function getComfortTypeLabel(type: string) {
  const labels: Record<string, string> = {
    urbano: 'Urbano',
    executivo: 'Executivo',
    leito: 'Leito'
  }

  return labels[type] || type
}

export function getBusTypeLabel(type: string) {
  const labels: Record<string, string> = {
    van: 'Van',
    micro_urbano: 'Micro urbano',
    midi_urbano: 'Midi urbano',
    urbano: 'Urbano',
    executivo: 'Executivo',
    semileito: 'Semileito',
    leito: 'Leito'
  }

  return labels[type] || type
}
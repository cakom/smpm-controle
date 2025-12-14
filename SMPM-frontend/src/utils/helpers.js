import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Formatar data
export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '-'
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, pattern, { locale: ptBR })
  } catch (error) {
    return '-'
  }
}

// Formatar data e hora
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

// Tempo relativo (há 2 dias)
export const formatRelative = (date) => {
  if (!date) return '-'
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(parsedDate, { locale: ptBR, addSuffix: true })
  } catch (error) {
    return '-'
  }
}

// Formatar moeda
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Obter iniciais do nome
export const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Obter cor do status
export const getStatusColor = (status, type = 'machine') => {
  const statusMap = {
    machine: {
      'Ativa': 'green',
      'Inativa': 'gray',
      'Em Manutenção': 'yellow',
      'Aguardando Peças': 'orange'
    },
    maintenance: {
      'Pendente': 'yellow',
      'Em Andamento': 'blue',
      'Concluída': 'green',
      'Cancelada': 'red'
    }
  }
  
  return statusMap[type]?.[status] || 'gray'
}

// Validar email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Truncar texto
export const truncate = (text, length = 50) => {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Debounce
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Download arquivo
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Formatar data
export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '-'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, pattern, { locale: ptBR })
  } catch {
    return '-'
  }
}

// Formatar data e hora
export const formatDateTime = (date) => formatDate(date, 'dd/MM/yyyy HH:mm')

// Tempo relativo
export const formatRelative = (date) => {
  if (!date) return '-'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { locale: ptBR, addSuffix: true })
  } catch {
    return '-'
  }
}

// Formatar moeda
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

// Iniciais do nome
export const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Debounce
export const debounce = (func, wait = 300) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
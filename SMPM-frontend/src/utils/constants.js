// Status das máquinas
export const MACHINE_STATUS = {
  ATIVA: { value: 'Ativa', label: 'Ativa', color: 'green' },
  INATIVA: { value: 'Inativa', label: 'Inativa', color: 'gray' },
  EM_MANUTENCAO: { value: 'Em Manutenção', label: 'Em Manutenção', color: 'yellow' },
  AGUARDANDO_PECAS: { value: 'Aguardando Peças', label: 'Aguardando Peças', color: 'orange' }
}

// Tipos de máquina
export const MACHINE_TYPES = [
  'Torno',
  'Fresadora',
  'Prensa',
  'Impressora',
  'Empilhadeira',
  'Outro'
]

// Status de manutenção
export const MAINTENANCE_STATUS = {
  PENDENTE: { value: 'Pendente', label: 'Pendente', color: 'yellow' },
  EM_ANDAMENTO: { value: 'Em Andamento', label: 'Em Andamento', color: 'blue' },
  CONCLUIDA: { value: 'Concluída', label: 'Concluída', color: 'green' },
  CANCELADA: { value: 'Cancelada', label: 'Cancelada', color: 'red' }
}

// Tipos de manutenção
export const MAINTENANCE_TYPES = {
  PREVENTIVA: { value: 'Preventiva', label: 'Preventiva', color: 'blue' },
  CORRETIVA: { value: 'Corretiva', label: 'Corretiva', color: 'red' },
  PREDITIVA: { value: 'Preditiva', label: 'Preditiva', color: 'purple' },
  INSPECAO: { value: 'Inspeção', label: 'Inspeção', color: 'green' }
}

// Prioridades
export const PRIORITIES = {
  BAIXA: { value: 'Baixa', label: 'Baixa', color: 'gray' },
  MEDIA: { value: 'Média', label: 'Média', color: 'yellow' },
  ALTA: { value: 'Alta', label: 'Alta', color: 'orange' },
  CRITICA: { value: 'Crítica', label: 'Crítica', color: 'red' }
}

// Roles de usuário
export const USER_ROLES = {
  ADMIN: { value: 'admin', label: 'Administrador' },
  TECNICO: { value: 'tecnico', label: 'Técnico' },
  OPERADOR: { value: 'operador', label: 'Operador' }
}
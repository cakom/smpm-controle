// Status das máquinas
export const MACHINE_STATUS = {
  ATIVA: { value: 'Ativa', label: 'Ativa' },
  INATIVA: { value: 'Inativa', label: 'Inativa' },
  EM_MANUTENCAO: { value: 'Em Manutenção', label: 'Em Manutenção' },
  AGUARDANDO_PECAS: { value: 'Aguardando Peças', label: 'Aguardando Peças' }
}

// Tipos de máquina
export const MACHINE_TYPES = ['Torno', 'Fresadora', 'Prensa', 'Impressora', 'Empilhadeira', 'Outro']

// Status de manutenção
export const MAINTENANCE_STATUS = ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada']

// Tipos de manutenção
export const MAINTENANCE_TYPES = ['Preventiva', 'Corretiva', 'Preditiva', 'Inspeção']

// Prioridades
export const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica']

// Roles de usuário
export const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'operador', label: 'Operador' }
]
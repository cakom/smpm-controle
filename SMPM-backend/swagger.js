const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SMPM - API Documentation',
      version: '1.0.0',
      description: `
# Sistema de Manutenção Preventiva de Máquinas

API RESTful para gerenciamento de manutenção preventiva em ambientes industriais.

## Funcionalidades Principais

- 🔐 **Autenticação JWT**: Login seguro com tokens
- 🏭 **Gestão de Máquinas**: CRUD completo
- 🔧 **Gestão de Manutenções**: Registro e acompanhamento
- 📊 **KPIs e Relatórios**: Indicadores de desempenho
- 📅 **Histórico**: Rastreamento completo de atividades

## Como usar

1. Registre um usuário em \`/api/auth/register\`
2. Faça login em \`/api/auth/login\` e copie o token
3. Clique no botão "Authorize" e insira: \`Bearer SEU_TOKEN\`
4. Teste as rotas protegidas

## Códigos de Status

- \`200\`: Sucesso
- \`201\`: Criado com sucesso
- \`400\`: Requisição inválida
- \`401\`: Não autorizado
- \`403\`: Sem permissão
- \`404\`: Não encontrado
- \`500\`: Erro no servidor
      `,
      contact: {
        name: 'Gabriela - SENAI Roberto Mange',
        email: 'seu-email@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de Desenvolvimento Local'
      },
      {
        url: 'https://seu-app.railway.app',
        description: 'Servidor de Produção (Railway)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@example.com' },
            role: { 
              type: 'string', 
              enum: ['admin', 'tecnico', 'operador'],
              example: 'admin'
            },
            criadoEm: { type: 'string', format: 'date-time' }
          }
        },
        Machine: {
          type: 'object',
          required: ['nome', 'tipo', 'setor', 'proximaManutencao'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nome: { type: 'string', example: 'Torno CNC 1000' },
            tipo: { 
              type: 'string',
              enum: ['Torno', 'Fresadora', 'Prensa', 'Impressora', 'Empilhadeira', 'Outro'],
              example: 'Torno'
            },
            setor: { type: 'string', example: 'Usinagem' },
            status: { 
              type: 'string',
              enum: ['Ativa', 'Inativa', 'Em Manutenção', 'Aguardando Peças'],
              example: 'Ativa'
            },
            fabricante: { type: 'string', example: 'Romi' },
            modelo: { type: 'string', example: 'CNC-1000' },
            numeroSerie: { type: 'string', example: 'TRN-2024-001' },
            dataAquisicao: { type: 'string', format: 'date' },
            ultimaManutencao: { type: 'string', format: 'date' },
            proximaManutencao: { type: 'string', format: 'date', example: '2024-12-20' },
            frequenciaManutencao: { type: 'number', example: 30, description: 'Em dias' },
            observacoes: { type: 'string', example: 'Máquina de alta precisão' }
          }
        },
        Maintenance: {
          type: 'object',
          required: ['maquina', 'tipo', 'dataAgendada', 'descricao'],
          properties: {
            _id: { type: 'string' },
            maquina: { type: 'string', description: 'ID da máquina' },
            tipo: { 
              type: 'string',
              enum: ['Preventiva', 'Corretiva', 'Preditiva', 'Inspeção'],
              example: 'Preventiva'
            },
            status: { 
              type: 'string',
              enum: ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada'],
              example: 'Pendente'
            },
            prioridade: { 
              type: 'string',
              enum: ['Baixa', 'Média', 'Alta', 'Crítica'],
              example: 'Média'
            },
            dataAgendada: { type: 'string', format: 'date-time' },
            dataInicio: { type: 'string', format: 'date-time' },
            dataConclusao: { type: 'string', format: 'date-time' },
            duracao: { type: 'number', description: 'Em horas' },
            tecnicoResponsavel: { type: 'string', description: 'ID do usuário' },
            descricao: { type: 'string', example: 'Lubrificação geral' },
            pecasUtilizadas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  quantidade: { type: 'number' },
                  custo: { type: 'number' }
                }
              }
            },
            custoTotal: { type: 'number', example: 150.00 },
            observacoes: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erro ao processar requisição' },
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticação e autorização de usuários'
      },
      {
        name: 'Machines',
        description: 'Operações CRUD de máquinas'
      },
      {
        name: 'Maintenances',
        description: 'Gestão de manutenções preventivas'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

// Customização da interface Swagger
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 20px }
  `,
  customSiteTitle: 'SMPM API Docs',
  customfavIcon: '/favicon.ico'
};

module.exports = { swaggerUi, specs, swaggerOptions };
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
- 🏭 **Gestão de Máquinas**: CRUD completo com validações
- 🔧 **Gestão de Manutenções**: Registro e acompanhamento detalhado
- 📊 **KPIs e Relatórios**: Indicadores de desempenho em tempo real
- 📅 **Histórico**: Rastreamento completo de atividades
- 🔔 **Alertas**: Manutenções atrasadas e próximas

## Como usar

1. Registre um usuário em \`/api/auth/register\`
2. Faça login em \`/api/auth/login\` e copie o token
3. Clique no botão "Authorize" 🔒 e insira: \`Bearer SEU_TOKEN\`
4. Teste as rotas protegidas

## Códigos de Status

- \`200\`: Sucesso
- \`201\`: Criado com sucesso
- \`400\`: Requisição inválida ou erro de validação
- \`401\`: Não autorizado (token ausente ou inválido)
- \`403\`: Sem permissão (role inadequada)
- \`404\`: Recurso não encontrado
- \`500\`: Erro interno do servidor
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
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticação e autorização de usuários'
      },
      {
        name: 'Machines',
        description: 'Operações CRUD de máquinas industriais'
      },
      {
        name: 'Maintenances',
        description: 'Gestão de manutenções preventivas e corretivas'
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
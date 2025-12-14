# 🏭 SMPM - Sistema de Manutenção Preventiva de Máquinas

Sistema web completo para gerenciamento de manutenção preventiva em ambientes industriais, desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas - SENAI Roberto Mange.

## 📋 Sobre o Projeto

O SMPM automatiza o planejamento, acompanhamento e registro de manutenções preventivas, permitindo que indústrias:
- Reduzam falhas inesperadas
- Otimizem recursos
- Aumentem a vida útil dos equipamentos
- Garantam segurança operacional

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Banco de dados NoSQL em nuvem
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação segura
- **Bcrypt.js** - Criptografia de senhas
- **Swagger** - Documentação da API

### Frontend (em desenvolvimento)
- **Vue.js 3** - Framework progressivo
- **Vue Router** - Roteamento SPA
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- Conta no MongoDB Atlas (gratuita)
- Git instalado

### Passo 1: Clonar o repositório
```bash
git clone <url-do-repositorio>
cd SMPM-backend
```

### Passo 2: Instalar dependências
```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.exemplo .env

# Edite o arquivo .env e adicione suas credenciais
```

**Variáveis necessárias:**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/smpm-controle
JWT_SECRET=sua_chave_secreta_forte
```

### Passo 4: Testar conexão
```bash
npm run test
```

### Passo 5: Iniciar servidor
```bash
npm run dev
```

Servidor disponível em: http://localhost:4000

## 📚 Documentação da API

Acesse a documentação interativa Swagger:
```
http://localhost:4000/api-docs
```

## 🧪 Testes

### Com Insomnia
1. Importe o arquivo `insomnia_collection.json`
2. Siga o guia em `GUIA_TESTES_INSOMNIA.md`

### Com Postman
- Importe a collection disponível na pasta `/docs`

## 🗂️ Estrutura do Projeto
```
SMPM-backend/
├── src/
│   ├── config/
│   │   └── database.js         # Configuração MongoDB
│   ├── models/
│   │   ├── User.js             # Schema de usuários
│   │   ├── Machine.js          # Schema de máquinas
│   │   └── Maintenance.js      # Schema de manutenções
│   ├── controllers/
│   │   ├── authController.js   # Lógica de autenticação
│   │   ├── machineController.js
│   │   └── maintenanceController.js
│   ├── routes/
│   │   ├── authRoutes.js       # Rotas de autenticação
│   │   ├── machineRoutes.js    # Rotas de máquinas
│   │   └── maintenanceRoutes.js
│   └── middleware/
│       └── auth.js             # Middleware JWT
├── .env                        # Variáveis de ambiente
├── .gitignore
├── package.json
├── server.js                   # Entry point
├── swagger.js                  # Config Swagger
├── Test.connection.js          # Teste de conexão
└── insomnia_collection.json    # Collection de testes
```

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Fluxo de autenticação:
1. Registre um usuário: `POST /api/auth/register`
2. Faça login: `POST /api/auth/login`
3. Use o token retornado em todas as requisições protegidas:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário logado

### Máquinas
- `GET /api/machines` - Listar máquinas
- `POST /api/machines` - Criar máquina
- `GET /api/machines/:id` - Buscar máquina
- `PUT /api/machines/:id` - Atualizar máquina
- `DELETE /api/machines/:id` - Deletar máquina

### Manutenções
- `GET /api/maintenances` - Listar manutenções
- `POST /api/maintenances` - Criar manutenção
- `GET /api/maintenances/:id` - Buscar manutenção
- `PUT /api/maintenances/:id` - Atualizar manutenção
- `GET /api/maintenances/kpis` - Obter KPIs
- `GET /api/maintenances/machine/:id` - Histórico da máquina

## 🎯 Funcionalidades

### ✅ Implementado (Backend)
- [x] Autenticação JWT
- [x] CRUD de usuários
- [x] CRUD de máquinas
- [x] CRUD de manutenções
- [x] KPIs e relatórios
- [x] Histórico por máquina
- [x] Filtros e buscas
- [x] Documentação Swagger
- [x] Validações de dados
- [x] Tratamento de erros

### 🚧 Em Desenvolvimento (Frontend)
- [ ] Dashboard com KPIs
- [ ] Calendário de manutenções
- [ ] Lista de manutenções
- [ ] Formulários de cadastro
- [ ] Interface responsiva
- [ ] Temas claro/escuro

## 🚀 Deploy

### Railway
```bash
# Instalar CLI do Railway
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Vercel (Frontend)
```bash
# Instalar CLI do Vercel
npm i -g vercel

# Deploy
vercel
```

## 📖 Documentação Adicional

- [Guia de Testes](./GUIA_TESTES_INSOMNIA.md)
- [Swagger Docs](http://localhost:4000/api-docs)
- [Requisitos do Projeto](./docs/requisitos.md)

## 👨‍💻 Desenvolvedor

**Gabriela**  
Estudante de Análise e Desenvolvimento de Sistemas  
SENAI Roberto Mange - 2º Semestre


## 🤝 Contribuições

Este é um projeto acadêmico, mas sugestões são bem-vindas!


---

**Desenvolvido com ❤️ para o projeto final de Desenvolvimento Back e Front - SENAI Roberto Mange**
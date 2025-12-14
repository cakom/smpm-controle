# 🧪 GUIA DE TESTES COM INSOMNIA - SMPM

## 📥 Importar Collection

1. Abra o Insomnia
2. Clique em "Application" > "Preferences" > "Data"
3. Clique em "Import Data" > "From File"
4. Selecione o arquivo `insomnia_collection.json`
5. A collection "SMPM - Sistema de Manutenção Preventiva" será importada

## 🎯 FLUXO DE TESTES COMPLETO

### Passo 1: Registrar Usuário
**Request:** `1. Register User`
- Método: POST
- Endpoint: `/api/auth/register`
- Body:
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "role": "admin"
}
```
**Resultado esperado:** Status 201, retorna dados do usuário e token

### Passo 2: Fazer Login
**Request:** `2. Login`
- Método: POST
- Endpoint: `/api/auth/login`
- Body:
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```
**Ação importante:** Copie o `token` do response e cole no Environment ({{ token }})

### Passo 3: Verificar Usuário Logado
**Request:** `3. Get Current User`
- Método: GET
- Endpoint: `/api/auth/me`
- Header: `Authorization: Bearer {{ token }}`
**Resultado esperado:** Status 200, retorna dados do usuário logado

### Passo 4: Criar Máquina
**Request:** `4. Create Machine`
- Método: POST
- Endpoint: `/api/machines`
- Header: `Authorization: Bearer {{ token }}`
- Body: JSON com dados da máquina
**Ação importante:** Copie o `_id` da máquina criada

### Passo 5: Listar Máquinas
**Request:** `5. List All Machines`
- Método: GET
- Endpoint: `/api/machines`
**Resultado esperado:** Array com todas as máquinas

### Passo 6: Buscar Máquina por ID
**Request:** `6. Get Machine by ID`
- Substitua `MACHINE_ID_HERE` pelo ID copiado
**Resultado esperado:** Dados completos da máquina

### Passo 7: Atualizar Máquina
**Request:** `7. Update Machine`
- Substitua `MACHINE_ID_HERE` pelo ID da máquina
- Altere o status ou outros campos
**Resultado esperado:** Status 200, máquina atualizada

### Passo 8: Criar Manutenção
**Request:** `8. Create Maintenance`
- Substitua `MACHINE_ID_HERE` pelo ID da máquina
- Body: JSON com dados da manutenção
**Resultado esperado:** Status 201, manutenção criada

### Passo 9: Listar Manutenções
**Request:** `9. List All Maintenances`
**Resultado esperado:** Array com todas as manutenções

### Passo 10: Obter KPIs
**Request:** `10. Get KPIs`
**Resultado esperado:** Objeto com estatísticas:
- Total de manutenções
- Pendentes, em andamento, concluídas
- Atrasadas
- Próximos 7 dias
- Custo total

### Passo 11: Histórico da Máquina
**Request:** `11. Get Machine History`
- Substitua `MACHINE_ID_HERE` pelo ID da máquina
**Resultado esperado:** Array com todas as manutenções daquela máquina

## 🚫 TESTES DE ERRO (Cenários Negativos)

### Teste 12: Token Inválido
**Request:** `12. Test Invalid Token (Error)`
**Resultado esperado:** Status 401, mensagem de erro

### Teste 13: Sem Token
**Request:** `13. Test No Token (Error)`
**Resultado esperado:** Status 401, mensagem de erro

### Teste 14: Deletar Máquina Inexistente
**Request:** `14. Delete Nonexistent Machine (Error)`
**Resultado esperado:** Status 404, máquina não encontrada

### Teste 15: Dados Incompletos
**Request:** `15. Create Machine Incomplete Data (Error)`
**Resultado esperado:** Status 500, erro de validação

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Registro de usuário funciona
- [ ] Login retorna token válido
- [ ] Token expira após 30 dias
- [ ] Rotas protegidas bloqueiam acesso sem token
- [ ] CRUD de máquinas funciona
- [ ] CRUD de manutenções funciona
- [ ] KPIs calculam corretamente
- [ ] Filtros funcionam (status, tipo, setor)
- [ ] Histórico por máquina funciona
- [ ] Erros retornam mensagens claras

## 🔧 DICAS

1. **Token expirado?** Faça login novamente
2. **Erro 401?** Verifique se o token está no header
3. **Erro 500?** Verifique os campos obrigatórios no body
4. **IDs inválidos?** Use IDs reais do banco (24 caracteres hexadecimais)
# Documento de Estratégia de Testes — Barbearia System

## 1. Visão Geral

Este documento apresenta a estratégia de testes do projeto Barbearia System, um sistema web desenvolvido com frontend em React, backend em FastAPI, banco PostgreSQL, Docker e Kubernetes/Minikube.

O objetivo é validar as principais funcionalidades do sistema, garantindo que o cadastro, login e gerenciamento de agendamentos funcionem corretamente.

---

## 2. Funcionalidades Principais

As três principais funcionalidades do projeto são:

1. Login do administrador
2. Cadastro de agendamentos
3. Gerenciamento de agendamentos

---

## 3. Funcionalidade 1 — Login do Administrador

### Regras de Negócio

- O sistema deve permitir acesso apenas ao usuário administrador.
- O usuário correto é `admin`.
- A senha correta é `1234`.
- Caso usuário ou senha estejam incorretos, o sistema deve negar o acesso.
- Após login correto, o administrador deve acessar o painel principal.

### Caso de Teste 1 — Login com dados corretos

- **Tipo:** Integração
- **Objetivo:** Verificar se o backend autentica corretamente o administrador.
- **Entrada:**
  - Usuário: `admin`
  - Senha: `1234`
- **Resultado Esperado:**
  - A API retorna status 200.
  - O sistema libera acesso ao painel administrativo.

### Caso de Teste 2 — Login com senha incorreta

- **Tipo:** Integração
- **Objetivo:** Verificar se o sistema bloqueia login inválido.
- **Entrada:**
  - Usuário: `admin`
  - Senha: `0000`
- **Resultado Esperado:**
  - A API retorna erro 401.
  - O sistema exibe mensagem de usuário ou senha inválidos.

---

## 4. Funcionalidade 2 — Cadastro de Agendamentos

### Regras de Negócio

- O nome do cliente é obrigatório.
- O serviço deve ser informado.
- A data do agendamento é obrigatória.
- O horário do agendamento é obrigatório.
- O status inicial deve ser `Agendado`.
- O agendamento deve ser salvo no banco de dados.

### Caso de Teste 3 — Cadastro válido de agendamento

- **Tipo:** Integração
- **Objetivo:** Verificar se um agendamento válido é salvo corretamente.
- **Entrada:**
  - Nome: Arthur
  - Serviço: Corte + Barba
  - Data: 2026-05-02
  - Horário: 18:00
  - Status: Agendado
- **Resultado Esperado:**
  - A API retorna status 200.
  - O agendamento é salvo no banco.
  - O agendamento aparece na listagem.

### Caso de Teste 4 — Cadastro com campo obrigatório vazio

- **Tipo:** Unitário
- **Objetivo:** Verificar se o sistema rejeita dados incompletos.
- **Entrada:**
  - Nome vazio
  - Serviço: Corte de cabelo
  - Data: 2026-05-02
  - Horário: 18:00
- **Resultado Esperado:**
  - O sistema não permite o cadastro.
  - O formulário exige preenchimento do campo obrigatório.

---

## 5. Funcionalidade 3 — Gerenciamento de Agendamentos

### Regras de Negócio

- O administrador pode listar todos os agendamentos cadastrados.
- O administrador pode editar nome, serviço, data, horário e status.
- O administrador pode excluir um agendamento.
- A pesquisa deve filtrar agendamentos pelo nome do cliente.
- Os status possíveis são:
  - Agendado
  - Concluído
  - Cancelado

### Caso de Teste 5 — Editar agendamento existente

- **Tipo:** Integração
- **Objetivo:** Verificar se um agendamento pode ser atualizado.
- **Pré-condição:** Deve existir um agendamento cadastrado.
- **Entrada:**
  - Alterar status de `Agendado` para `Concluído`.
- **Resultado Esperado:**
  - A API retorna status 200.
  - O status atualizado aparece no frontend.
  - A informação é persistida no banco.

### Caso de Teste 6 — Fluxo completo do usuário

- **Tipo:** E2E
- **Objetivo:** Validar o fluxo completo do sistema pela interface.
- **Passos:**
  1. Acessar o frontend.
  2. Fazer login com usuário `admin` e senha `1234`.
  3. Cadastrar um novo agendamento.
  4. Pesquisar o cliente cadastrado.
  5. Editar o status do agendamento.
  6. Excluir o agendamento.
- **Resultado Esperado:**
  - O login funciona.
  - O agendamento é cadastrado.
  - A pesquisa encontra o cliente.
  - A edição é aplicada.
  - A exclusão remove o agendamento da tela.

---

## 6. Classificação dos Testes

| Caso de Teste | Funcionalidade | Classificação |
|---|---|---|
| Caso 1 | Login com dados corretos | Integração |
| Caso 2 | Login com senha incorreta | Integração |
| Caso 3 | Cadastro válido | Integração |
| Caso 4 | Cadastro com campo vazio | Unitário |
| Caso 5 | Editar agendamento | Integração |
| Caso 6 | Fluxo completo pela interface | E2E |

---

## 7. Conclusão

A estratégia de testes cobre as principais partes do sistema Barbearia System, validando autenticação, cadastro, edição, exclusão, listagem e fluxo completo pela interface. Com esses testes, é possível garantir maior confiabilidade no funcionamento do sistema.
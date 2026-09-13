# 🐾 VetFlow - MobileApp

## 🚀 Sobre os Projetos
Este projeto foi desenvolvido como parte de um desafio acadêmico (FIAP), com foco em oferecer uma interface intuitiva, persistência de dados local e navegação fluida, utilizando as tecnologias mais modernas do ecossistema React Native/Expo.

Este repositório contém a entregas referente à Sprint 3 para a disciplina Mobile Development, contendo uma pasta com todos os arquivos do aplicativo mobile (Front-End) e dentro desta, outra pasta contendo todos os arquivos da API de Java (Back-End).

## Problema e Solução
Muitas clínicas veterinárias enfrentam dificuldades com a desorganização no agendamento de consultas e na gestão do histórico médico dos animais, o que gera ineficiência e perda de tempo. O Vet-Flow soluciona esse problema ao oferecer uma plataforma centralizada e intuitiva que organiza o fluxo de atendimento, integrando prontuários e agendamentos para otimizar a rotina dos profissionais e melhorar a experiência dos tutores.

## 🚀 Sobre o Projeto
Este projeto foi desenvolvido como parte de um desafio acadêmico (FIAP), com foco em oferecer uma interface intuitiva, persistência de dados local e navegação fluida, utilizando as tecnologias mais modernas do ecossistema React Native/Expo.

👥 Integrantes da Equipe

Nomes:

Andrei de Paiva Gibbini RM: 563061 (2TDSPF)

Pedro Sakai Silva Zambaca RM: 565956 (2TDSPF)

Pedro Santos Pequini RM: 561842 (2TDSPF)

Arthur Câmara RM: 562310 (2TDSPG)

Diogo Cunha RM: 563654 (2TDSPF)

---

## Aplicativo mobile (React Native + Expo) para acompanhamento de saúde de pets: cadastro de pets, histórico de vacinas e lembretes de próximas doses. Desenvolvido para o Challenge FIAP 2026 — disciplina **Mobile Application Development**.

## Demonstração (App Mobile)
🎥 **Vídeo de Apresentação:** [https://youtu.be/2-OrjDLP7Ag]

Integrado de ponta a ponta com a **API VetFlow em Java (Spring Boot)** do grupo.

## Índice

- [Stack utilizada](#stack-utilizada)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Formato de comunicação com a API](#formato-de-comunicação-com-a-api)
- [Como executar](#como-executar)
- [Contas de teste](#contas-de-teste)
- [Endpoints da API consumidos](#endpoints-da-api-consumidos)
- [Telas do aplicativo](#telas-do-aplicativo)
- [Checklist de requisitos avaliativos (Sprint 3)](#checklist-de-requisitos-avaliativos-sprint-3)
- [Fora do escopo desta sprint](#fora-do-escopo-desta-sprint)

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navegação | React Navigation (native-stack + bottom-tabs) |
| Dados remotos | TanStack Query (`useQuery` / `useMutation`) |
| HTTP client | Axios (sessão via cookie, `withCredentials`) |
| Autenticação | Sessão Spring Security (cookie `JSESSIONID`) — sem JWT |
| Persistência local | AsyncStorage (cache do perfil do usuário) |
| Ícones | `@expo/vector-icons` (Feather) |

## Arquitetura do projeto

```
vetflow-mobile/
├── App.js                        # Providers (QueryClient, Auth) + Routes
├── app.json / babel.config.js
├── assets/                       # icon.png, splash.png
└── src/
    ├── config/
    │   └── env.js                 # ÚNICO lugar para trocar a URL da API
    ├── constants/
    │   └── theme.js                # Cores, tipografia, espaçamento
    ├── services/                   # Camada de acesso à API (nenhuma tela chama axios direto)
    │   ├── api.js                  # Instância axios + interceptor de sessão expirada
    │   ├── authService.js
    │   ├── petsService.js
    │   ├── vaccinesService.js
    │   └── queryClient.js
    ├── contexts/
    │   └── AuthContext.js          # Sessão, login/registro/logout, restauração via /auth/me
    ├── hooks/                      # TanStack Query — isola fetch/mutation da UI
    │   ├── usePets.js
    │   └── useVaccines.js
    ├── components/                 # Componentes reutilizáveis (Header, Cards, Inputs...)
    ├── routes/
    │   ├── index.js                 # Decide AuthRoutes x AppRoutes (proteção de rotas real)
    │   ├── auth.routes.js
    │   ├── app.routes.js
    │   └── tab.routes.js
    └── screens/
        ├── auth/       (Login, Cadastro)
        ├── pets/        (ListaPets, PetForm, PetDetalhe)
        ├── vaccines/    (VaccineForm)
        ├── Home.js, Lembretes.js, Perfil.js
```

**Separação de responsabilidades**: telas nunca chamam `axios`/`fetch` diretamente — sempre por meio de um hook (`usePets`, `useVaccines`), que por sua vez chama um `service`. Isso mantém a lógica de rede isolada da camada visual e evita duplicação entre telas.

## Formato de comunicação com a API

Toda a comunicação entre o app e a API é em **JSON**. A API do grupo já
inclui seu próprio `AuthApiController` (`/api/auth/login`, `/register`,
`/me`, `/logout`) expondo autenticação por sessão (cookie `JSESSIONID`) em
JSON — nenhuma alteração é necessária no projeto Java, o app mobile já está
ajustado ao contrato exato desses endpoints, incluindo as particularidades
de nomenclatura da API real:

- `POST /api/auth/login` espera `{ email, senha }` (senha em português) e
  responde `{ id, nome, email, role, tutorId }`.
- `POST /api/auth/register` espera `{ name, email, phone, password }`
  (em inglês) e responde no mesmo formato acima.
- `tutorId` pode vir como `""` (string vazia) quando o usuário não tem tutor
  vinculado (ex.: role `VET`) — o app trata isso como `null`.

## Como executar

### 1. Suba a API Java primeiro
```bash
cd vetflow-java-final
mvn spring-boot:run
# Aplicação em http://localhost:8080 (H2 em arquivo, Flyway aplica as migrations automaticamente)
```

### 2. Configure a URL da API no app mobile
Edite **`src/config/env.js`** (único lugar que precisa mudar):

```js
export const BASE_URL = 'http://localhost:8080/api';          // Web/simulador iOS
// export const BASE_URL = 'http://10.0.2.2:8080/api';         // Emulador Android
// export const BASE_URL = 'http://192.168.0.X:8080/api';      // Dispositivo físico (IP da sua máquina)
```

### 3. Instale e rode o app
```bash
npm install
npx expo start
```
Abra no emulador (`a` para Android, `i` para iOS) ou escaneie o QR Code com o app Expo Go no seu celular (nesse caso, use o IP da sua máquina na rede local, não `localhost`).

## Contas de teste

As mesmas contas seed da API (senha `senha123` para todas):

| Perfil | E-mail |
|---|---|
| Tutor | `carlos.mendes@email.com` |
| Veterinário | `vet@vetflow.com` |

Ou crie uma nova conta pela tela **Criar Conta** do próprio app.

## Endpoints da API consumidos

| Ação | Método | Endpoint |
|---|---|---|
| Login | POST | `/api/auth/login` |
| Cadastro | POST | `/api/auth/register` |
| Restaurar sessão | GET | `/api/auth/me` |
| Logout | POST | `/api/auth/logout` |
| Listar pets do tutor | GET | `/api/pets/by-tutor/{tutorId}` |
| Detalhe do pet | GET | `/api/pets/{id}` |
| Criar pet | POST | `/api/pets` |
| Editar pet | PUT | `/api/pets/{id}` |
| Remover pet | DELETE | `/api/pets/{id}` |
| Vacinas de um pet | GET | `/api/vaccines/by-pet/{petId}` |
| Vacinas vencidas (lembretes) | GET | `/api/vaccines/expired` |
| Vacinas a vencer (lembretes) | GET | `/api/vaccines/due-soon?days=30` |
| Criar vacina | POST | `/api/vaccines` |
| Editar vacina | PUT | `/api/vaccines/{id}` |
| Remover vacina | DELETE | `/api/vaccines/{id}` |

> Os endpoints `/expired` e `/due-soon` retornam vacinas de **todos** os pets do sistema — o app cruza esse resultado com a lista de pets do tutor logado (`usePets`) antes de exibir, para cada tutor só ver os lembretes dos próprios pets.

## Telas do aplicativo

1. **Login** — autenticação real via API
2. **Cadastro** — criação de conta (Tutor + User)
3. **Início** — dashboard com estatísticas e próximos lembretes
4. **Meus Pets** — listagem com busca (CRUD de Pets)
5. **Detalhe do Pet** — dados do pet + histórico de vacinas
6. **Form de Pet** — criar/editar pet
7. **Form de Vacina** — criar/editar vacina
8. **Lembretes** — vacinas atrasadas/a vencer, com filtro
9. **Perfil** — dados do usuário + logout

## Fora do escopo desta sprint

A API Java também expõe `Tutor`, `Clinic`, `Appointment` e `Medication`. Para manter o app focado e com CRUD completo e bem testado em duas entidades centrais (Pets + Vacinas), essas demais entidades não foram integradas ao mobile nesta sprint — ficam como evolução natural para a Sprint 4 (ex.: agendamento de consultas com `Appointment`/`Clinic`).

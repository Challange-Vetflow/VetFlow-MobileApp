# 🐾 VetFlow — MobileApp

Aplicativo mobile (React Native + Expo) para **acompanhamento de saúde de pets**: cadastro de pets, histórico de **vacinas**, **consultas** agendadas e **lembretes por notificação** para o tutor. Desenvolvido para o Challenge FIAP 2026 (Clyvo Vet) — disciplina **Mobile Application Development**, integrado de ponta a ponta com a **API VetFlow em Java (Spring Boot)** do grupo.

Este repositório contém as entregas das **Sprints 3 e 4** de Mobile. A Sprint 4 consolida o app: todas as telas funcionais, **tema claro/escuro**, **notificações locais reais**, tela **Sobre o App** com o hash do commit e publicação via **Firebase App Distribution**.

## 👥 Integrantes da Equipe

| Nome | RM | Turma |
|---|---|---|
| Andrei de Paiva Gibbini | 563061 | 2TDSPF |
| Pedro Sakai Silva Zambaca | 565956 | 2TDSPF |
| Pedro Santos Pequini | 561842 | 2TDSPF |
| Arthur Câmara | 562310 | 2TDSPG |
| Diogo Cunha | 563654 | 2TDSPF |

## 🎯 Problema e Solução

Muitas clínicas veterinárias e tutores sofrem com a desorganização no agendamento de consultas e na gestão do histórico médico dos animais — vacinas esquecidas, consultas perdidas e prontuários espalhados. O VetFlow centraliza essas informações: o tutor cadastra seus pets, registra vacinas e consultas e **recebe lembretes automáticos** antes de cada compromisso, com o histórico sempre à mão.

## 🎥 Vídeos de Apresentação

- **Sprint 4 (final):** _[COLE AQUI O LINK DO YOUTUBE]_
- Sprint 3: https://youtu.be/2-OrjDLP7Ag

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack utilizada](#stack-utilizada)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Tema claro/escuro](#tema-claroescuro)
- [Notificações](#notificações)
- [Tela "Sobre o App" e hash do commit](#tela-sobre-o-app-e-hash-do-commit)
- [Publicação no Firebase App Distribution](#publicação-no-firebase-app-distribution)
- [Como executar (desenvolvimento)](#como-executar-desenvolvimento)
- [Contas de teste](#contas-de-teste)
- [Endpoints da API consumidos](#endpoints-da-api-consumidos)
- [Telas do aplicativo](#telas-do-aplicativo)
- [Checklist de requisitos (Sprint 4)](#checklist-de-requisitos-sprint-4)

## Funcionalidades

- **Autenticação real** (API Java, sessão Spring Security): login, cadastro, persistência de sessão, rotas protegidas e logout.
- **Dois perfis**, com as mesmas regras da API: **Tutor** (gerencia os próprios pets e consultas, acompanha vacinas e recebe lembretes) e **Veterinário/clínica** (vê todos os pets, registra vacinas e conclui consultas).
- **Pets** — CRUD completo (listar com busca, detalhar, criar, editar, remover).
- **Vacinas** — CRUD completo vinculado ao pet (registro pelo perfil Veterinário; o tutor acompanha), com status (em dia / esta semana / atrasada).
- **Consultas** — agendar, editar e cancelar (tutor) e **concluir** (veterinário), vinculadas ao pet e a uma clínica parceira.
- **Início e Lembretes** — painel com pets, vacinas atrasadas e consultas; lista unificada de lembretes com filtro.
- **Notificações locais** de vacinas e consultas (ver [Notificações](#notificações)).
- **Tema claro/escuro** (Perfil > Aparência).
- **Sobre o App** com versão e hash do commit.
- Estados de carregamento (`isLoading`/`isFetching`), *pull-to-refresh* e atualização automática da interface após cada operação (invalidação de cache do TanStack Query).

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navegação | React Navigation (native-stack + bottom-tabs) |
| Dados remotos | TanStack Query (`useQuery` / `useMutation`) + Axios |
| Autenticação | Sessão Spring Security (cookie `JSESSIONID`) via API Java |
| Notificações | `expo-notifications` (notificações locais agendadas e imediatas) |
| Persistência local | AsyncStorage (cache do perfil, tema, preferências) |
| Build/publicação | EAS Build (APK) / Gradle + Firebase App Distribution |

## Arquitetura do projeto

```
src/
├── config/        env.js (URL da API por variável de ambiente), buildInfo.js (versão/commit)
├── constants/     theme.js (paletas clara/escura), appointmentTypes.js
├── contexts/      AuthContext.js (sessão), ThemeContext.js (tema)
├── services/      Acesso a dados e regras de lembretes
│   ├── api.js, authService.js, petsService.js, vaccinesService.js,
│   │   appointmentsService.js, clinicsService.js, queryClient.js
│   ├── reminderPlanner.js   → REGRAS (quando/o que notificar) — funções puras
│   ├── notificationService.js → wrapper do expo-notifications
│   └── reminderService.js   → orquestra regras + execução
├── hooks/         TanStack Query isolado da UI: usePets, useVaccines, useAppointments,
│                  useClinics, useLembretes, useNotificacoes, useNotificacoesPreferencia,
│                  useThemedStyles
├── utils/         dateUtils, statusUtils, validators, lembretes, notificationNavigation
├── components/    Header, CustomInput, PrimaryButton, cards (Pet, Vaccine, Appointment, Stat)...
├── routes/        index (proteção de rotas), auth/app/tab routes, navigationRef
└── screens/       auth/, pets/, vaccines/, appointments/, Home, Lembretes, Perfil, SobreApp
```

**Separação de responsabilidades:** as telas só compõem interface. Nenhuma tela chama `axios`/`fetch` nem contém regra de negócio — dados passam por **hooks** (TanStack Query) → **services** (HTTP); validações, datas e status ficam em **utils**; regras de notificação ficam em **reminderPlanner**.

## Tema claro/escuro

Paletas `LIGHT_COLORS`/`DARK_COLORS` em `src/constants/theme.js`, fornecidas por `ThemeContext`. Em **Perfil > Aparência** o usuário escolhe *Sistema* (acompanha o celular), *Claro* ou *Escuro*; a escolha é persistida em AsyncStorage. Todos os componentes usam `useTheme()`/`useThemedStyles()`, e o React Navigation, a barra de status e o splash (`splash.dark`) também acompanham o tema.

## Notificações

Notificações **locais** (`expo-notifications`), disparadas por eventos reais do app e da API:

Os lembretes são do **tutor** (dono do pet) — no aparelho do veterinário não são agendados.

| Evento | Notificação (no app do tutor) |
|---|---|
| Tutor **agenda/edita uma consulta** | Imediata: "✅ Consulta agendada"; agendadas: 24 h e 1 h antes |
| **Ao abrir o app** (dados da API) | Resumo do dia: "⚠️ N vacinas atrasadas" / "🗓️ Lembretes da semana" (uma vez por dia por conteúdo) e agendamento dos lembretes das próximas doses (véspera e dia, às 09:00) e consultas |
| Clínica **registra uma vacina** (app do veterinário ou web) | Na próxima abertura/atualização do app do tutor, os lembretes da nova dose são agendados |
| Consulta cancelada/concluída, pet removido, logout | Lembretes agendados correspondentes são **cancelados** |

- **Funcionam com o app em primeiro plano, em segundo plano ou fechado** (as agendadas são do sistema operacional).
- **Tocar na notificação** leva o usuário à tela relevante: detalhe do pet (vacina/consulta) ou aba Lembretes (resumo) — inclusive com o app fechado.
- Permissão solicitada ao entrar no app (Android 13+); liga/desliga em **Perfil > Notificações de lembrete**.
- Canal Android dedicado: "Lembretes de saúde do pet".

## Tela "Sobre o App" e hash do commit

Em **Perfil > Sobre o app** são exibidos versão, **hash do commit de referência** (curto e completo), branch, data do build, ambiente e URL da API. O hash é injetado no build por `app.config.js` (`EAS_BUILD_GIT_COMMIT_HASH` no EAS, ou `git rev-parse HEAD` em build local). Se houver alterações não commitadas, o hash recebe o sufixo `-dirty` — **sempre faça o commit antes de gerar o APK** para que o app publicado corresponda exatamente ao código do repositório.

Para conferir o que será embutido: `npm run info:build`.

## Publicação no Firebase App Distribution

O app é distribuído como **APK** pelo Firebase App Distribution, com o e-mail institucional do professor cadastrado como *tester*.

### 1. API acessível pela internet
O APK instalado no celular do professor **não alcança `localhost`/`10.0.2.2`**. Publique a API Java na nuvem (Azure, conforme a disciplina de DevOps) e informe a URL em `eas.json` (`EXPO_PUBLIC_API_URL`, terminando em `/api`). O app já permite tráfego HTTP (`usesCleartextTraffic`), caso a API não use HTTPS.

### 2. Gerar o APK (a partir de um commit já feito e enviado ao GitHub)
**Opção A — EAS Build (nuvem):**
```bash
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # gera o APK; baixe o .apk ao final
```
**Opção B — build local (Android Studio + JDK 17):**
```bash
npm install
EXPO_PUBLIC_API_URL="https://SUA-API/api" npx expo prebuild --platform android
cd android && ./gradlew assembleRelease          # APK em android/app/build/outputs/apk/release/
```

### 3. Publicar no Firebase
1. No [console do Firebase](https://console.firebase.google.com) crie/abra um projeto → **Adicionar app Android** com o pacote `com.fiap.vetflow`.
2. **Release & Monitor > App Distribution > Começar** → envie o `.apk`.
3. Em **Testadores e grupos**, adicione o **e-mail institucional do professor** e distribua.
4. Confirme que o convite chegou e que o app instala e abre.

Pela CLI (opcional): `firebase appdistribution:distribute app-release.apk --app <ID_DO_APP_ANDROID> --testers "professor@fiap.com.br" --release-notes "Sprint 4 — commit <hash>"`.

## Como executar (desenvolvimento)

1. Suba a API Java (repositório `vetflow-java`). Ela usa o **Oracle da FIAP** e precisa das variáveis `ORACLE_USER` e `ORACLE_PASSWORD` (no IntelliJ: *Edit Configurations → Environment variables* `ORACLE_USER=rmXXXXX;ORACLE_PASSWORD=...`), com o banco já preparado pelos scripts do grupo (`01_ddl`, pacotes `02_*` e `06_seed`). Confira em `http://localhost:8080/actuator/health`.
2. A URL de desenvolvimento é escolhida automaticamente: emulador Android → `http://10.0.2.2:8080/api`; iOS/web → `http://localhost:8080/api`. Para celular físico ou outra URL, defina `EXPO_PUBLIC_API_URL` (ex.: arquivo `.env` com `EXPO_PUBLIC_API_URL=http://IP-DO-PC:8080/api`).
3. Instale e rode:
```bash
npm install
npx expo start
```
> **Expo Go (Android, SDK 53+):** notificações *remotas/push* não são suportadas no Expo Go, mas as **notificações locais** usadas aqui funcionam. Um aviso do `expo-notifications` no console do Expo Go é esperado. No APK publicado não há essa limitação.

## Contas de teste

Contas do seed do banco (senha `senha123`):

| Perfil | Nome | E-mail |
|---|---|---|
| Tutor | Carlos Mendes | `carlos.mendes@email.com` |
| Tutor | Ana Paula Silva | `ana.silva@email.com` |
| Veterinário | Dra. Fernanda Alves | `vet@vetflow.com` |

Ou crie uma conta na tela **Criar Conta**.

## Endpoints da API consumidos

| Ação | Método | Endpoint |
|---|---|---|
| Login / Cadastro / Sessão / Logout | POST/POST/GET/POST | `/api/auth/login`, `/register`, `/me`, `/logout` |
| Pets do tutor / todos (VET) | GET | `/api/pets/by-tutor/{tutorId}`, `/api/pets?page&size` |
| Detalhe / Criar / Editar / Remover pet | GET/POST/PUT/DELETE | `/api/pets[/{id}]` |
| Vacinas do pet | GET | `/api/vaccines/by-pet/{petId}` |
| Vacinas vencidas / a vencer | GET | `/api/vaccines/expired`, `/api/vaccines/due-soon?days=30` |
| Criar / Editar / Remover vacina (VET) | POST/PUT/DELETE | `/api/vaccines[/{id}]` |
| Consultas do pet / pendentes | GET | `/api/appointments/by-pet/{petId}`, `/api/appointments/pending` |
| Agendar / Editar / Cancelar consulta | POST/PUT/DELETE | `/api/appointments[/{id}]` |
| Concluir consulta (VET) | PUT | `/api/appointments/{id}/complete` |
| Clínicas | GET | `/api/clinics` |

> Todos os ids são **UUID**. Os endpoints `expired`, `due-soon` e `pending` já devolvem só o que o usuário logado pode ver (filtro no servidor). Erros chegam no formato `ApiError` (`mensagem`, `campos`) e o app mostra a mensagem original — incluindo as das procedures Oracle (ex.: "E-mail já cadastrado").

## Telas do aplicativo

1. **Login** · 2. **Cadastro** · 3. **Início** (painel) · 4. **Meus Pets** · 5. **Detalhe do Pet** (vacinas + consultas) · 6. **Form de Pet** · 7. **Form de Vacina** · 8. **Form de Consulta** · 9. **Lembretes** · 10. **Perfil** (tema, notificações, logout) · 11. **Sobre o App**

## Checklist de requisitos (Sprint 4)

| Requisito | Onde |
|---|---|
| Todas as telas funcionais; fluxo completo; funcionalidades das Sprints 1–3 concluídas | 11 telas, CRUD de pets/vacinas/consultas integrados à API |
| Publicação no Firebase App Distribution + professor como tester | [Publicação](#publicação-no-firebase-app-distribution) |
| Versão publicada = código do repositório | Hash do commit embutido no build (`app.config.js`) |
| Tela "Sobre o App" com hash do commit | `src/screens/SobreApp.js` |
| Notificações reais (cenário, disparo/recepção, integração ao fluxo, demonstração) | [Notificações](#notificações) |
| Arquitetura: UI × lógica × dados; hooks isolados; sem HTTP/regra nas telas | [Arquitetura](#arquitetura-do-projeto) |
| Tema claro/escuro | [Tema](#tema-claroescuro) |
| Vídeo de apresentação | Link no topo deste README |

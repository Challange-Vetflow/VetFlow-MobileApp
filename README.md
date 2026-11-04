# 🐾 VetFlow — MobileApp

Aplicativo mobile em React Native com Expo para acompanhar a saúde de pets. O tutor cadastra seus animais, acompanha o histórico de vacinas, agenda consultas e recebe lembretes no celular. A clínica registra as vacinas e conclui as consultas.

Projeto do Challenge FIAP 2026 (Clyvo Vet), disciplina Mobile Application Development. O app consome a API VetFlow, desenvolvida pelo grupo em Java com Spring Boot.

Este repositório reúne as entregas das Sprints 3 e 4 de Mobile.

## 👥 Integrantes

| Nome | RM | Turma |
|---|---|---|
| Andrei de Paiva Gibbini | 563061 | 2TDSPF |
| Pedro Sakai Silva Zambaca | 565956 | 2TDSPF |
| Pedro Santos Pequini | 561842 | 2TDSPF |
| Arthur Câmara | 562310 | 2TDSPG |
| Diogo Cunha | 563654 | 2TDSPF |

## 🎥 Vídeos

- Sprint 4: https://youtu.be/ViIrOPn66bU
  
- Sprint 3: https://youtu.be/2-OrjDLP7Ag

## 🎯 Problema e solução

Tutores esquecem a data das vacinas, perdem consultas e não têm o histórico do animal em um só lugar. Do lado da clínica, os registros ficam espalhados e o contato com o tutor depende de ligações e mensagens.

O VetFlow reúne essas informações em um app. O tutor cadastra seus pets, acompanha vacinas e consultas e recebe lembretes antes de cada compromisso, com o histórico sempre à mão.

## ✨ Funcionalidades

- Login e cadastro de tutor, com a sessão mantida ao reabrir o app e logout
- Pets: listagem com busca, detalhe, cadastro, edição e remoção
- Vacinas: histórico por pet com status (em dia, vence esta semana, atrasada); o registro e a edição são feitos pelo veterinário
- Consultas: agendamento, edição e cancelamento pelo tutor e conclusão pelo veterinário, sempre ligadas a um pet e a uma clínica parceira
- Início: resumo com os pets, as vacinas atrasadas e as próximas consultas
- Lembretes: lista única de vacinas e consultas, com filtro
- Notificações de lembrete para vacinas e consultas
- Tema claro e escuro
- Tela Sobre o App com a versão e o hash do commit
- Pull-to-refresh e atualização automática das listas depois de cada alteração

### Perfis de acesso

O app segue as mesmas regras de permissão da API.

| Perfil | O que pode fazer |
|---|---|
| Tutor | Gerencia os próprios pets e consultas, acompanha as vacinas e recebe os lembretes |
| Veterinário | Vê todos os pets, registra e edita vacinas e conclui consultas |

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navegação | React Navigation (native-stack e bottom-tabs) |
| Dados remotos | TanStack Query + Axios |
| Autenticação | Sessão da API (cookie `JSESSIONID`) |
| Notificações | expo-notifications |
| Armazenamento local | AsyncStorage (perfil em cache, tema e preferências) |
| Build e distribuição | EAS Build + Firebase App Distribution |

## 📁 Estrutura do projeto

```
src/
├── components/   componentes reutilizáveis (Header, inputs, botões e cards)
├── config/       URL da API e informações da versão
├── constants/    cores dos temas e tipos de consulta
├── contexts/     autenticação (AuthContext) e tema (ThemeContext)
├── hooks/        hooks de dados (usePets, useVaccines, useAppointments...) e de notificações
├── routes/       navegação: login, abas e telas internas
├── screens/      telas do app (auth, pets, vaccines, appointments, Home, Lembretes, Perfil, SobreApp)
├── services/     chamadas à API e agendamento das notificações
└── utils/        datas, validações e status
```

As telas cuidam apenas da interface. Os dados chegam por hooks do TanStack Query, que usam os services para falar com a API. Validações, datas e status ficam em `utils`, e as regras dos lembretes ficam em `services/reminderPlanner.js`.

## 🌗 Tema claro e escuro

As cores dos dois temas estão em `src/constants/theme.js`. Em Perfil > Aparência dá para escolher entre seguir o sistema, claro ou escuro, e a escolha fica salva no aparelho. A navegação, a barra de status e a tela de abertura também acompanham o tema.

## 🔔 Notificações

As notificações são locais, agendadas no próprio aparelho com o expo-notifications. Os lembretes são do tutor; no aparelho do veterinário eles não são agendados.

| Quando | O que acontece |
|---|---|
| O tutor agenda ou edita uma consulta | Confirmação na hora e lembretes 24 horas e 1 hora antes |
| Uma vacina tem próxima dose prevista | Lembretes na véspera e no dia, às 9h |
| O app é aberto | Resumo com as vacinas atrasadas e os compromissos da semana (uma vez por dia) |
| Consulta cancelada ou concluída, pet removido ou logout | Os lembretes correspondentes são cancelados |

- Funcionam com o app aberto, em segundo plano ou fechado.
- Tocar na notificação abre o pet correspondente ou, no caso do resumo, a aba Lembretes.
- A permissão é pedida ao entrar no app, e os lembretes podem ser desligados em Perfil.

> No Expo Go aparece um aviso do expo-notifications no console, porque ele não suporta notificações push. As notificações locais usadas aqui funcionam normalmente, e no APK o aviso não aparece.

## ℹ️ Sobre o App

Em Perfil > Sobre o app aparecem a versão, o hash do commit (curto e completo), a branch, a data do build e a URL da API. O hash é gravado no momento do build pelo `app.config.js`. Se o build for feito com alterações não commitadas, o hash recebe o sufixo `-dirty`.

Para ver o que será gravado no build: `npm run info:build`.

## 🌐 API

O app usa a API publicada em `https://vetflow-java.onrender.com`. A autenticação é por sessão: o login cria a sessão no servidor e as requisições seguintes usam o mesmo cookie.

O servidor está em um plano gratuito e fica inativo quando passa um tempo sem uso, então a primeira requisição pode levar até um minuto.

### Endpoints usados

| Ação | Método | Endpoint |
|---|---|---|
| Login, cadastro, sessão e logout | POST / POST / GET / POST | `/api/auth/login`, `/register`, `/me`, `/logout` |
| Pets do tutor / todos (veterinário) | GET | `/api/pets/by-tutor/{tutorId}`, `/api/pets` |
| Detalhe, cadastro, edição e remoção de pet | GET / POST / PUT / DELETE | `/api/pets/{id}` |
| Vacinas do pet | GET | `/api/vaccines/by-pet/{petId}` |
| Vacinas vencidas e a vencer | GET | `/api/vaccines/expired`, `/api/vaccines/due-soon?days=30` |
| Cadastro, edição e remoção de vacina | POST / PUT / DELETE | `/api/vaccines/{id}` |
| Consultas do pet e pendentes | GET | `/api/appointments/by-pet/{petId}`, `/api/appointments/pending` |
| Agendar, editar e cancelar consulta | POST / PUT / DELETE | `/api/appointments/{id}` |
| Concluir consulta | PUT | `/api/appointments/{id}/complete` |
| Clínicas | GET | `/api/clinics` |

Os ids são UUID. Quando a API retorna um erro, o app mostra a mensagem enviada por ela (por exemplo, "E-mail já cadastrado").

## ▶️ Como executar

Pré-requisitos: Node.js 18 ou superior e o Expo Go no celular (ou um emulador Android).

```bash
npm install
npx expo start
```

Depois é só ler o QR Code com o Expo Go ou apertar `a` para abrir no emulador.

Por padrão o app usa a API publicada. Para usar a API rodando no seu computador, crie um arquivo `.env` a partir do `.env.example`:

```
EXPO_PUBLIC_API_URL=http://IP-DO-SEU-COMPUTADOR:8080/api
```

### Contas de teste

Senha de todas: `senha123`

| Perfil | Nome | E-mail |
|---|---|---|
| Tutor | Carlos Mendes | `carlos.mendes@email.com` |
| Tutor | Ana Paula Silva | `ana.silva@email.com` |
| Veterinário | Dra. Fernanda Alves | `vet@vetflow.com` |

Também é possível criar uma conta de tutor pela tela de cadastro.

## 📱 Telas

1. Login
2. Cadastro
3. Início
4. Meus Pets
5. Detalhe do Pet (vacinas e consultas)
6. Cadastro/edição de pet
7. Cadastro/edição de vacina
8. Agendamento/edição de consulta
9. Lembretes
10. Perfil (tema, notificações e logout)
11. Sobre o App

## 📦 Publicação

O APK é gerado com o EAS Build e distribuído pelo Firebase App Distribution.

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

A URL da API usada no APK fica no `eas.json` (`EXPO_PUBLIC_API_URL`). Ao fim do build, o arquivo `.apk` é baixado e enviado ao Firebase App Distribution, com o hash do commit nas notas da versão. Esse é o mesmo hash que aparece na tela Sobre o App.

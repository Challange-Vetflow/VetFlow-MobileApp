🐾 VetFlow - MobileApp

O VetFlow é uma solução mobile desenvolvida para facilitar o acompanhamento de saúde de pets, permitindo o cadastro de informações essenciais, controle de histórico de vacinas/consultas e gestão de lembretes importantes para o tutor.

🚀 Sobre o ProjetoEste projeto foi desenvolvido como parte de um desafio acadêmico (FIAP), com foco em oferecer uma interface intuitiva, persistência de dados local e navegação fluida, utilizando as tecnologias mais modernas do ecossistema React Native/Expo.

🛠 Tecnologias Utilizadas

Linguagem: JavaScript / React Native

Framework: ExpoNavegação: React Navigation (Stack & Bottom Tabs)

Persistência de Dados: AsyncStorage

Utilitários: react-native-mask-text (máscaras de input), @expo/vector-icons (ícones).

👥 Integrantes da Equipe 

Nomes:

Andrei de Paiva Gibbini RM: 563061 (2TDSPF)

Pedro Sakai Silva Zambaca RM: 565956 (2TDSPF)

Pedro Santos Pequini RM: 561842 (2TDSPF)

Arthur Câmara RM: 562310 (2TDSPG)

Diogo Cunha RM: 563654 (2TDSPF)

⚙️ Como Rodar o ProjetoPara executar o projeto localmente, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter o Node.js instalado e o Expo CLI configurado.

Instalação

Clone este repositório:Bashgit clone https://github.com/Challange-Vetflow/VetFlow-MobileApp.git
Entre na pasta do projeto:Bashcd VetFlow-MobileApp
Instale as dependências:Bashnpm install
Inicie o projeto:Bashnpx expo start

📂 Estrutura de Pastas (Principais)

src/routes/: Configuração da navegação (Stack e Tabs)
.src/screens/: Telas principais do aplicativo (Cadastro, Perfil, Historico, Lembretes)
.src/components/: Componentes reutilizáveis de interface (Header, CustomInput, PetCard)
.assets/: Imagens e arquivos estáticos.

💡 Funcionalidades Principais

Cadastro Simplificado: Registro rápido do pet com validação de dados. Acesso a histórico, recebe lembretes de vacinas e consultas, acompanha medicações
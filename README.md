# Daily Diet
Daily Diet é uma aplicação para o gerenciamento das suas refeições diárias. Com ela, você pode cadastrar refeições, especificar horários e indicar se estão dentro da sua dieta ou não. Além disso, o sistema fornece métricas detalhadas para ajudá-lo a acompanhar seu progresso.

### 📝 Funcionalidades
* Cadastro de refeições com horário e status (dentro ou fora da dieta).
* Métricas detalhadas:
  - Total de refeições cadastradas.
  -  Quantidade de refeições dentro e fora da dieta.
  -   Número de refeições consecutivas dentro da dieta.
* Sistema de autenticação:
  - Criação de usuário.
  - Login seguro.
### 🚀 Tecnologias Utilizadas
* Node.js: Plataforma de desenvolvimento.
* Knex: Query builder para interações com o banco de dados.
* Fastify: Framework web rápido e eficiente.
* Zod: Validação de dados.
* Vitest: Testes unitários.
### 📦 Instalação
1. Clone o repositório:
   ```
   gh repo clone edilaine-as/NodeJS-Daily-Diet
   ```
2. Navegue até o projeto
   ```
   cd NodeJS-Daily-Diet
   ```
3. Instale as dependências
   ```
   npm i
   ```
4. Configure o arquivo .env
    ```
   NODE_ENV=development
   DATABASE_CLIENT=sqlite
   DATABASE_URL="./db/app.db"
   ```
6. Execute as migrações do banco de dados
   ```
   npm run knex migrate:lastest
   ```
7. Inicie o servidor
   ```
   npm run dev
   ```
### 🧪 Testes
Para rodar os testes unitários:
1. Configure o arquivo .env.test
   ```
   NODE_ENV="test"
   DATABASE_CLIENT=sqlite
   DATABASE_URL="./db/test.db"
   ```
2. Execute os testes unitários
   ```
   npm run test
   ```
### 🤝 Contribuição
Sinta-se à vontade para contribuir! Abra uma issue ou envie um pull request.
### 📄 Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

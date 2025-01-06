# Daily Diet

[Leia em Português](#português) | [Read in English](#english)

## English
Daily Diet is an application for managing your daily meals. With it, you can register meals, specify times, and indicate whether they are within your diet or not. Additionally, the system provides detailed metrics to help you track your progress.

### 📝 Features
* Meal registration with time and status (inside or outside the diet).
* Detailed metrics:
  - Total number of registered meals.
  - Number of meals inside and outside the diet.
  - Number of consecutive meals inside the diet.
* Authentication system:
  - User creation.
  - Secure login.

### 🚀 Technologies Used
* Node.js: Development platform.
* Knex: Query builder for database interactions.
* Fastify: Fast and efficient web framework.
* Zod: Data validation.
* Vitest: Unit testing.

### 📦 Installation
1. Clone the repository
   ```
   gh repo clone edilaine-as/NodeJS-Daily-Diet
   ```
2. Navigate to the project
   ```
   cd NodeJS-Daily-Diet
   ```
3. Install dependencies
   ```
   npm i
   ```
4. Configure the .env file
    ```
   NODE_ENV=development
   DATABASE_CLIENT=sqlite
   DATABASE_URL="./db/app.db"
   ```
5. Run database migrations
   ```
   npm run knex migrate:lastest
   ```
6. Start the server
   ```
   npm run dev
   ```
### 🧪  Tests
To run unit tests:
1. Configure the .env.test file
   ```
   NODE_ENV="test"
   DATABASE_CLIENT=sqlite
   DATABASE_URL="./db/test.db"
   ```
2. Run the unit tests
   ```
   npm run test
   ```
### 🤝 Contribution
Feel free to contribute! Open an issue or submit a pull request
### 📄 License
This project is licensed under the MIT License. See the LICENSE file for more details



   
## Português
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

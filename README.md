# ✂️ BarberTech

> Plataforma web para gestão de barbearias, conectando clientes e barbeiros.

## 🧾 Descrição

O **BarberTech** é uma aplicação voltada para o **agendamento de horários**, **perfil de barbeiros**, e **gestão de serviços oferecidos por barbearias**.  
Permite que clientes agendem cortes com praticidade. Do lado do barbeiro, é possível organizar a agenda, acompanhar o desempenho do negócio.

---

## 👥 Integrantes da Dupla

- Carlos Eduardo Sielski Urbim (33755973)
- Eduardo Bryan Braga Rocha (34731067)
- Lucas Antonio Domingues de Souza Oliveira (33476055)
- Otavio Caetano Ribeiro (32736274)

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem Backend:** JavaScript (Node.js)
- **Framework Backend:** Express.js
- **ORM:** Prisma ORM
- **Banco de Dados:** MySQL
- **Frontend:** React.js
- **Estilização:** Tailwind CSS
- **Autenticação:** JWT
- **Versionamento:** Git + GitHub

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- MySQL instalado
- Git instalado

### Passos

#### 🔧 Backend

```bash
# 1. Clone o repositório
git clone https://github.com/cesusieh/barbertech

# 2. Acesse a pasta do backend
cd Back

# 3. Instale as dependências
npm install

# 4. Configure o banco de dados
npx prisma migrate dev

# 5. Inicie a aplicação
npm run dev
```

#### 💻 Frontend

```bash
# 1. Acesse a pasta do frontend
cd front

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run start
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `Back`

### Backend `.env`

```
PORT=
DATABASE_URL=
JWT_SECRET=
```
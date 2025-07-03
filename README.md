# Desafio Técnico - Vaga Backend (Django) + Frontend (React)
Simulação https://youtu.be/sTsNzDHQaMw

---
Este repositório contém a solução para o desafio técnico da vaga de desenvolvedor, com foco principal em **backend Django**, e um bônus adicional com interface em **React**.

---

## ✨ Objetivo

Avaliar:
- Domínio da stack (Django + REST + Banco de Dados)
- Boas práticas de projeto
- Raciocínio lógico
- Estruturação e organização de código

---

## 📁 Estrutura do Projeto

```
backend/
├── manage.py
├── Avantsoft/
│   ├── settings.py
│   └── urls.py
├── clientes/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── tests.py
├── vendas/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── tests.py

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── img/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
├── public/index.html
├── tailwind.config.js
```

---

## 🚀 Backend - API Django

### Funcionalidades
- Autenticação via token JWT
- Cadastro, edição, listagem e remoção de clientes
- Filtros por nome e e-mail
- Relatório de estatísticas por cliente
- Rota de vendas por dia
- Rota com:
  - Cliente com maior volume de vendas
  - Cliente com maior média por venda
  - Cliente com maior frequência de compras

### Extras
- Tabela `sales` relacionada a clientes
- Testes automatizados (pytest/django.test)
- Proteção por permissão/autenticação em todas as rotas

### Tecnologias
- Django
- Django REST Framework
- SimpleJWT
- SQLite

---

## 💻 Frontend - React (bônus)

### Funcionalidades
- Login com autenticação simples
- Cadastro e listagem de clientes (nome, email, nascimento)
- Gráfico com total de vendas por dia (Chart.js ou Recharts)
- Destaques visuais para:
  - Maior volume de vendas
  - Maior média por venda
  - Maior frequência de compras
- Tratamento e normalização do JSON complexo da API
- Campo visual indicando a **primeira letra do alfabeto não usada** no nome completo (ou `-` se todas presentes)

### Tecnologias
- React
- TailwindCSS
- Axios
- React Router DOM
- Chart.js / Recharts

---

## ✅ Como rodar o projeto

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ⚖️ Testes
```bash
cd backend
python manage.py test
```

---

## 🌐 API Endpoints Principais
- `POST /api/token/` - login
- `GET /clientes/` - listagem com filtros
- `POST /clientes/` - criar cliente
- `PUT /clientes/<id>/` - editar
- `DELETE /clientes/<id>/` - deletar

---

## 🌟 Extras (bônus)
- Layout responsivo e moderno com TailwindCSS
- Menu lateral dinâmico
- Spinner de carregamento em login

---

## 📄 Licença
Este projeto é apenas para fins de avaliação técnica.

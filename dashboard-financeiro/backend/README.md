# Backend — Dashboard Financeiro

API REST construída com Node.js e Express.

## Executar

```bash
npm install
npm run dev
```

API padrão: `http://localhost:3001`

## Endpoints

- `GET /api/health` — verifica o serviço
- `GET /api/transactions` — lista transações
- `POST /api/transactions` — cadastra transação
- `DELETE /api/transactions/:id` — remove transação

> A primeira versão utiliza armazenamento em memória. O próximo passo é persistir os dados em banco de dados.

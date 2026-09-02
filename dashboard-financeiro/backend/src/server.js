import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let transactions = [
  { id: 1, description: 'Salário', category: 'Renda', type: 'income', amount: 5200, date: '2026-09-01' },
  { id: 2, description: 'Aluguel', category: 'Moradia', type: 'expense', amount: 1400, date: '2026-09-02' },
  { id: 3, description: 'Supermercado', category: 'Alimentação', type: 'expense', amount: 680, date: '2026-09-02' },
  { id: 4, description: 'Freelance', category: 'Renda', type: 'income', amount: 850, date: '2026-09-03' },
  { id: 5, description: 'Internet', category: 'Serviços', type: 'expense', amount: 120, date: '2026-09-03' }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dashboard-financeiro-api' });
});

app.get('/api/transactions', (_req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const { description, category, type, amount, date } = req.body;
  if (!description || !category || !['income', 'expense'].includes(type) || !Number.isFinite(Number(amount)) || !date) {
    return res.status(400).json({ message: 'Dados da transação inválidos.' });
  }

  const transaction = {
    id: Date.now(),
    description: String(description).trim(),
    category: String(category).trim(),
    type,
    amount: Number(amount),
    date
  };

  transactions = [transaction, ...transactions];
  return res.status(201).json(transaction);
});

app.delete('/api/transactions/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = transactions.some((item) => item.id === id);
  if (!exists) return res.status(404).json({ message: 'Transação não encontrada.' });

  transactions = transactions.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

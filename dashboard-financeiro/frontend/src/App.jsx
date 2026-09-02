import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:3001/api';
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const initialForm = { description: '', category: 'Outros', type: 'expense', amount: '', date: new Date().toISOString().slice(0, 10) };

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) throw new Error('Não foi possível carregar as transações.');
      setTransactions(await response.json());
      setError('');
    } catch (err) {
      setError('API offline. Inicie o backend com npm run dev para carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const summary = useMemo(() => {
    const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Falha ao salvar.');
      setForm(initialForm);
      setShowForm(false);
      await loadTransactions();
    } catch {
      setError('Não foi possível salvar. Verifique se a API está funcionando.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta transação?')) return;
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      await loadTransactions();
    } catch {
      setError('Não foi possível excluir a transação.');
    }
  }

  return (
    <main className="container">
      <header className="header">
        <div><span className="eyebrow">VISÃO GERAL</span><h1>Dashboard Financeiro</h1><p>Acompanhe suas receitas, despesas e saldo em um só lugar.</p></div>
        <button className="primary-button" onClick={() => setShowForm((value) => !value)}>+ Nova transação</button>
      </header>

      {error && <div className="alert">{error}</div>}

      {showForm && <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="panel-heading"><div><span className="eyebrow">CADASTRO</span><h2>Nova transação</h2></div></div>
        <div className="form-grid">
          <input required placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input required placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Despesa</option><option value="income">Receita</option></select>
          <input required min="0.01" step="0.01" type="number" placeholder="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <button className="primary-button" type="submit">Salvar</button>
        </div>
      </form>}

      <section className="cards" aria-label="Resumo financeiro">
        <article className="card"><span>Saldo</span><strong>{currency.format(summary.balance)}</strong><small>Resultado atual</small></article>
        <article className="card"><span>Receitas</span><strong>{currency.format(summary.income)}</strong><small>Total recebido</small></article>
        <article className="card"><span>Despesas</span><strong>{currency.format(summary.expense)}</strong><small>Total gasto</small></article>
      </section>

      <section className="grid">
        <article className="panel chart-panel">
          <div className="panel-heading"><div><span className="eyebrow">ANÁLISE</span><h2>Distribuição</h2></div><span className="period">Atual</span></div>
          <div className="chart">
            <div className="bar-group"><span className="bar income" style={{ height: `${Math.min(100, summary.income / Math.max(summary.income, summary.expense, 1) * 100)}%` }} /><span className="bar expense" style={{ height: `${Math.min(100, summary.expense / Math.max(summary.income, summary.expense, 1) * 100)}%` }} /><small>Atual</small></div>
          </div>
          <div className="legend"><span><i className="dot income-dot" /> Receitas</span><span><i className="dot expense-dot" /> Despesas</span></div>
        </article>

        <article className="panel">
          <div className="panel-heading"><div><span className="eyebrow">MOVIMENTAÇÕES</span><h2>Transações recentes</h2></div></div>
          <div className="transactions">
            {loading ? <p>Carregando...</p> : transactions.length === 0 ? <p>Nenhuma transação cadastrada.</p> : transactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div className="transaction-icon">{transaction.type === 'income' ? '↑' : '↓'}</div>
                <div className="transaction-info"><strong>{transaction.description}</strong><span>{transaction.category} · {transaction.date}</span></div>
                <strong className={transaction.type}>{transaction.type === 'income' ? '+' : '-'} {currency.format(transaction.amount)}</strong>
                <button className="delete-button" onClick={() => handleDelete(transaction.id)} aria-label={`Excluir ${transaction.description}`}>×</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;

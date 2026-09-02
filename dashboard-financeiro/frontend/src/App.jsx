import { useMemo } from 'react';

const transactions = [
  { id: 1, description: 'Salário', category: 'Receita', type: 'income', value: 5200 },
  { id: 2, description: 'Aluguel', category: 'Moradia', type: 'expense', value: 1400 },
  { id: 3, description: 'Supermercado', category: 'Alimentação', type: 'expense', value: 680 },
  { id: 4, description: 'Freelance', category: 'Receita', type: 'income', value: 850 },
  { id: 5, description: 'Internet', category: 'Serviços', type: 'expense', value: 120 },
];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function App() {
  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((total, item) => total + item.value, 0);

    const expense = transactions
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + item.value, 0);

    return { income, expense, balance: income - expense };
  }, []);

  return (
    <main className="container">
      <header className="header">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>Dashboard Financeiro</h1>
          <p>Acompanhe suas receitas, despesas e saldo em um só lugar.</p>
        </div>
        <button className="primary-button">+ Nova transação</button>
      </header>

      <section className="cards" aria-label="Resumo financeiro">
        <article className="card">
          <span>Saldo</span>
          <strong>{currency.format(summary.balance)}</strong>
          <small>Resultado do período</small>
        </article>
        <article className="card">
          <span>Receitas</span>
          <strong>{currency.format(summary.income)}</strong>
          <small>Total recebido</small>
        </article>
        <article className="card">
          <span>Despesas</span>
          <strong>{currency.format(summary.expense)}</strong>
          <small>Total gasto</small>
        </article>
      </section>

      <section className="grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ANÁLISE</span>
              <h2>Receitas x Despesas</h2>
            </div>
            <span className="period">Este mês</span>
          </div>
          <div className="chart" aria-label="Gráfico ilustrativo de receitas e despesas">
            <div className="bar-group"><span className="bar income" style={{ height: '82%' }} /><span className="bar expense" style={{ height: '52%' }} /><small>Sem 1</small></div>
            <div className="bar-group"><span className="bar income" style={{ height: '70%' }} /><span className="bar expense" style={{ height: '64%' }} /><small>Sem 2</small></div>
            <div className="bar-group"><span className="bar income" style={{ height: '90%' }} /><span className="bar expense" style={{ height: '45%' }} /><small>Sem 3</small></div>
            <div className="bar-group"><span className="bar income" style={{ height: '76%' }} /><span className="bar expense" style={{ height: '58%' }} /><small>Sem 4</small></div>
          </div>
          <div className="legend"><span><i className="dot income-dot" /> Receitas</span><span><i className="dot expense-dot" /> Despesas</span></div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">MOVIMENTAÇÕES</span>
              <h2>Transações recentes</h2>
            </div>
          </div>
          <div className="transactions">
            {transactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div className="transaction-icon">{transaction.type === 'income' ? '↑' : '↓'}</div>
                <div className="transaction-info">
                  <strong>{transaction.description}</strong>
                  <span>{transaction.category}</span>
                </div>
                <strong className={transaction.type}>{transaction.type === 'income' ? '+' : '-'} {currency.format(transaction.value)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;

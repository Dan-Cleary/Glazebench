import './App.css';
import { Leaderboard } from './components/Leaderboard';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🏆 GlazeBench</h1>
        <p className="subtitle">How often do LLMs validate wrong ideas?</p>
      </header>

      <main className="main">
        <Leaderboard />
      </main>

      <footer className="footer">
        <p>
          Companion to{' '}
          <a href="https://slopbench.com" target="_blank" rel="noopener noreferrer">
            SlopBench
          </a>{' '}
          • Measures LLM glazing (validating wrong/bad ideas)
        </p>
      </footer>
    </div>
  );
}

export default App;

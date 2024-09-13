import './index.css'; // O './App.css' si es donde lo estás importando
import './App.css';
import './output.css';
import Example from './componentes/header'; // Importa el header correctamente

function App() {
  return (
    <div>
      <Example /> {/* Componente Header */}
      <header className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
        <img src="logo.svg" className="App-logo" alt="logo" />
        <p className="text-2xl">
          Edita <code>src/App.js</code> y guarda para recargar.
        </p>
        <a
          className="text-blue-400 hover:text-blue-500"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
    </div>
  );
}

export default App;

import logo from './imagenes/logo.png'; // Asegúrate de que la ruta sea correcta
import './index.css';
import './App.css';
import './output.css';

import DashBoard from './componentes/dashBoard';
import Footer from './componentes/footer';

function App() {
  return (
    <div>
      <header>
        {}
        <img src={logo} alt="Logo" className="App-logo" /> {}
      </header>
      <DashBoard />
      <Footer />
    </div>
  );
}

export default App;

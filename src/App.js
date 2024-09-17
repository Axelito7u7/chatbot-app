import './index.css'; // O './App.css' si es donde lo estás importando
import './App.css';
import './output.css';

import DashBoard from './componentes/dashBoard';
import Product from './componentes/productos';

function App() {
  return (
    <div>
      <DashBoard/>{}
      <Product/>{}
    </div>
  );
}

export default App;

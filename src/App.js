import './index.css'; // O './App.css' si es donde lo estás importando
import './App.css';
import './output.css';

import DashBoard from './componentes/dashBoard';
import Product from './componentes/productos';
import Footer from './componentes/footer';

function App() {
  return (
    <div>
      <DashBoard/>{}
      <Product/>{}
      <Footer/>{}

    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import{
  useFirebaseApp
} from'reactfire';

function App() {
  const firebase = useFirebaseApp();
  console.log(firebase);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Mi app<code> hecha por</code> Alan connection for fireabse 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>

        <Routes>
          <Route exact path='/' component={ Fib}/>
          <Route path="/otherpage" component={OtherPage}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

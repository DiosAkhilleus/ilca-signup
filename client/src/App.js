import './App.css';
import postSailor from './javascript/sailor';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home'
import About from './Components/About';
import NotFound from './Components/NotFound';

function App() {
  
  const getSailors = () => {
    console.log('sailors retrieved');
  }

  return (

    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

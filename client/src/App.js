import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home'
import About from './Components/About';
import NotFound from './Components/NotFound';
import PostSailor from './Components/Sailor/PostSailor';
import DisplaySailors from './Components/Sailor/DisplaySailors';

function App() {

  return (

    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route exact path='/postsailor' component={PostSailor} />
        <Route exact path='/displaysailors' component={DisplaySailors} />
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

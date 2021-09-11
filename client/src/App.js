import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Admin from './Components/Admin/Admin.jsx';
import NotFound from './Components/NotFound.jsx';
import TimeslotPost from './Components/Admin/TimeslotPost.jsx';
import AdminEventView from './Components/Admin/AdminEventView.jsx';
import SailorEventView from './Components/Timeslot/SailorEventView';

function App() {

  return (

    <BrowserRouter>
      <Switch>
        <Route exact path='/ilca-signup' component={Admin} />
        <Route exact path='/ilca-signup/admin/create' component={TimeslotPost} />
        <Route path='/ilca-signup/signup/:id' children={<SailorEventView />}/>
        <Route path='/ilca-signup/admin/event/:ilcaNum' children={<AdminEventView />}/>
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

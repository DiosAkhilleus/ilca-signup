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
        <Route exact path='/' component={Admin} />
        <Route exact path='/admin/create' component={TimeslotPost} />
        <Route path='/signup/:id' children={<SailorEventView />}/>
        <Route path='/admin/event/:ilcaNum' children={<AdminEventView />}/>
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home.jsx'
import About from './Components/About.jsx';
import Admin from './Components/Admin/Admin.jsx';
import NotFound from './Components/NotFound.jsx';
import Timeslot from './Components/Timeslot/Timeslot.jsx';
import TimeslotPost from './Components/Admin/TimeslotPost.jsx';
import AdminEventView from './Components/Admin/AdminEventView.jsx';
import PostSailor from './Components/Sailor/PostSailor.jsx';
import DisplaySailors from './Components/Sailor/DisplaySailors.jsx';
import SailorEventView from './Components/Timeslot/SailorEventView';

function App() {

  return (

    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route exact path='/admin' component={Admin}/>
        <Route exact path='/admin/create' component={TimeslotPost} />
        <Route exact path='/timeslots' component={Timeslot} />
        <Route path='/signup/:id' children={<SailorEventView />}/>
        <Route path='/edittimeslot/:id' children={Home}/>
        <Route path='/admin/event/:ilcaNum' children={<AdminEventView />}/>
        <Route exact path='/postsailor' component={PostSailor} />
        <Route exact path='/displaysailors' component={DisplaySailors} />
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

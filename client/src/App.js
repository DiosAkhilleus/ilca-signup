import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home.jsx'
import About from './Components/About.jsx';
import Admin from './Components/Admin.jsx';
import NotFound from './Components/NotFound.jsx';
import Timeslot from './Components/Timeslot/Timeslot.jsx';
import TimeslotPost from './Components/Timeslot/TimeslotPost.jsx';
import ViewTimeslot from './Components/Timeslot/ViewTimeslot.jsx';
import PostSailor from './Components/Sailor/PostSailor.jsx';
import DisplaySailors from './Components/Sailor/DisplaySailors.jsx';

function App() {

  return (

    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route exact path='/admin' component={Admin}/>
        <Route exact path='/admin/create' component={TimeslotPost} />
        <Route exact path='/timeslots' component={Timeslot} />
        <Route path='/viewtimeslot/:id' children={<ViewTimeslot />}/>
        <Route path='/edittimeslot/:id' children={Home}/>
        {/* <Route exact path='/viewtimeslot' component={ViewTimeslot}/> */}
        <Route exact path='/postsailor' component={PostSailor} />
        <Route exact path='/displaysailors' component={DisplaySailors} />
        <Route path='/' component={NotFound}/>
      </Switch>
    </BrowserRouter>
   
  );
}

export default App;

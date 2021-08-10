import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTimeslots } from '../../javascript/timeslotLogic';
import '../../App.css';

const Admin = () => {

  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    getTimeslots().then((results) => setTimeslots(results));
  }, [])


  return (
    <div style={{display: 'flex', flexDirection: 'column', flexAlign: 'center', textAlign: 'center'}}>

      <Link className='link' to='/' style={{marginTop: 40}}>Back to Home</Link>
      <Link className='link' to='/admin/create'>Create Inspection Signup</Link>
      <h3>Created Events</h3>
      <div style={{height: '50vw'}}>
        {timeslots.map((el, index) => <Link className='link' to={`/admin/event/${el.ilcaNum}`}>{el.eventTitle}</Link>)}
      </div>
    </div>
  )
}

export default Admin

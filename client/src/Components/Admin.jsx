import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTimeslots } from '../javascript/timeslotLogic';

const Admin = () => {

  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    getTimeslots().then((results) => setTimeslots(results));
  }, [])


  return (
    <div style={{display: 'flex', flexDirection: 'column', flexAlign: 'center', textAlign: 'center'}}>

      <Link to='/' style={{marginTop: 40}}>Back to Home</Link>
      <Link to='/admin/create'>Create Timeslot Signup</Link>

      <div style={{height: '50vw', marginTop: 40}}>
        {timeslots.map((el, index) => <div>{el.eventTitle}</div>)}
      </div>
    </div>
  )
}

export default Admin

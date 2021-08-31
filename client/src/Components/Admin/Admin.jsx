import React from 'react';
// import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTimeslots } from '../../javascript/timeslotLogic';
import Button from '@material-ui/core/Button';
import '../../App.css';

const Admin = () => {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    getTimeslots().then((results) => setTimeslots(results));
  }, []);

  return (
    <div>
      <img
        src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
        alt="ILCA Logo"
        style={{ width: 200, margin: 30, position: 'absolute' }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexAlign: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginTop: 60 }}>Admin Page</h1>
        {/* <Link className="link" to="/" style={{ marginTop: 40 }}>
          Back to Home
        </Link> */}
        {/* <Link className='link' to='/admin/create'>Create Inspection Signup</Link> */}
        <Button
          variant="contained"
          color="primary"
          href="/admin/create"
          style={{ width: 300, margin: 'auto' }}
        >
          Create Inspection Signup
        </Button>
        <h3>Created Events</h3>
        <div className="event-list-container">
          {timeslots.map((el, index) => (
            <div className="admin-event-card" key={index}>
              <div style={{ marginTop: 10 }}>
                <strong>{el.eventTitle}</strong>
              </div>
              <div>
                {el.hostCity}, {el.hostCountry}
              </div>
              <div></div>
              <Button
                variant="contained"
                color="primary"
                href={`/admin/event/${el.ilcaNum}`}
                style={{
                  width: 200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 20,
                  backgroundColor: 'rgb(2, 114, 186)'
                }}
              >
                Access Event Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;

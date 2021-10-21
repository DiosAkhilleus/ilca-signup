import React from 'react';
// import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTimeslots } from '../../javascript/timeslotLogic';
import Button from '@material-ui/core/Button';
import '../../App.css';

const Admin = () => {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    getTimeslots().then((results) => {
      let sortedByStartDate = results.sort((a, b) => a.startDate > b.startDate);
      setTimeslots(sortedByStartDate);
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexAlign: 'center',
          textAlign: 'center',
        }}
      >
        <div className="admin-header">
          <img
            src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
            alt="ILCA Logo"
            style={{ width: 200, margin: 30, marginBottom: 0 }}
          />
          <h1>Equipment Inspection Sign-Up Administration</h1>
        </div>
        <Button
          variant="contained"
          color="primary"
          href="/admin/create"
          style={{ width: 300, margin: 'auto' }}
        >
          Create Inspection Signup
        </Button>
        <h3>Existing Signup Sheets</h3>
        <div className="event-list-container">
          {timeslots.map((el, index) => (
            <div className="admin-event-card" key={index}>
              <div style={{ marginTop: 10 }}>
                <strong>{el.eventTitle}</strong>
              </div>
              <div style={{ marginTop: 10 }}>
                {el.hostCity}, {el.hostCountry}
              </div>
              <div
                style={{
                  maxWidth: 200,
                  maxHeight: 100,
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  style={{ maxWidth: 200, maxHeight: 100 }}
                  src={el.logoURL}
                  alt="event logo"
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                href={`/admin/event/${el.ilcaNum}`}
                style={{
                  width: 250,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 20,
                  backgroundColor: 'rgb(2, 114, 186)',
                }}
              >
                Access Signup Sheet Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;

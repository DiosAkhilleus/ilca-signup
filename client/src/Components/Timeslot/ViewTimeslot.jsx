import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTimeslotByUUID } from '../../javascript/timeslotLogic';
import '../../App.css';

const ViewTimeslot = () => {
  const [UUID, setUUID] = useState('');
  const [currentTimeslots, setCurrentTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState({});

  useEffect(() => {
    getTimeslotByUUID().then((results) => setCurrentTimeslots(results));
  }, []);

  useEffect(() => {
    console.log(selectedTimeslot);
  }, [selectedTimeslot])

  const handleIDSubmission = () => {
    const filteredTimeslots = currentTimeslots.filter(timeslot => timeslot.uuid === UUID);
    if (! filteredTimeslots.length > 0) {
      alert(`This id doesn't match a registered Inspection Signup`);
    } else {
      setSelectedTimeslot(filteredTimeslots[0]);      
    }
  };

  return (
    <div className="timeslot-search-container">
      <h1>Enter Timeslot ID below to access inspection signup</h1>
      <Link to='/'>Back to home</Link>
      <input
        className="timeslot-search-bar"
        type="text"
        onChange={(e) => setUUID(e.target.value)}
      />
      <button onClick={() => handleIDSubmission()}>Submit ID</button>
    </div>
  );
};

export default ViewTimeslot;

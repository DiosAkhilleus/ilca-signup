import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTimeslotByUUID } from '../../javascript/timeslotLogic';
import Timeslot from './Timeslot';
import '../../App.css';

const ViewTimeslot = () => {
  const [UUID, setUUID] = useState('');
  const [currentTimeslots, setCurrentTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState({});
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeslot();
  }, []);


  useEffect(() => {
    console.log(active);
  }, [active])

  const setTimeslot = () => {
    getTimeslotByUUID().then((results) => setCurrentTimeslots(results));
  }

  const updateSelectedTimeslot = () => {
    setTimeslot();
    handleIDSubmission();
  }

  const handleIDSubmission = () => {
    const filteredTimeslots = currentTimeslots.filter(
      (timeslot) => timeslot.uuid === UUID
    );
    if (!filteredTimeslots.length > 0) {
      alert(`This id doesn't match a registered Inspection Signup`);
    } else {
      setSelectedTimeslot(filteredTimeslots[0]);
      setActive(true);
    }
  };

  return (
    <div>
      {active === false ? (
        <div className="timeslot-search-container">
          <h1>Enter Timeslot ID below to access inspection signup</h1>
          <Link to="/">Back to home</Link>
          <input
            className="timeslot-search-bar"
            type="text"
            onChange={(e) => setUUID(e.target.value)}
          />
          <button onClick={() => handleIDSubmission()}>Submit ID</button>
        </div>
      ) : (
        <div>
          <Timeslot 
            setActive={setActive}
            interval={selectedTimeslot.interval}
            unavailable={selectedTimeslot.unavailableSlots}
            entryLimit={selectedTimeslot.entryLimit}
            slotsAvailableByDay={selectedTimeslot.slotsAvailableByDay}
            timeFrom={selectedTimeslot.timeFrom}
            timeTo={selectedTimeslot.timeTo}
            selectedDates={selectedTimeslot.selectedDates}
            eventTitle={selectedTimeslot.eventTitle}
            UUID={UUID}
            updateSelectedTimeslot={updateSelectedTimeslot}
          />
        </div>
      )}
    </div>
  );
};

export default ViewTimeslot;

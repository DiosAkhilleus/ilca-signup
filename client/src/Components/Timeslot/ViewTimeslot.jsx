import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTimeslots } from '../../javascript/timeslotLogic';
import Timeslot from './Timeslot';
import '../../App.css';

const ViewTimeslot = () => {
  // const [UUID, setUUID] = useState('');
  // const [currentTimeslots, setCurrentTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState({});
  const [active, setActive] = useState(false); // Whether or not the timeslot display is active

  let { id } = useParams();

  useEffect(() => { // Retrieves created timeslots on page load
    setTimeslot(); 
  }, []);

  const setTimeslot = () => { // Run on page load — sets current timeslots to those retrieved from the DB
    getTimeslots().then((results) => handleIDSubmission(results));
  }

  const updateSelectedTimeslot = () => { // Passed to the timeslot component so that on inspection time request, the timeslots update to reflect the newly submitted request
    setTimeslot();
    handleIDSubmission();
  }

  const handleIDSubmission = (timeslots) => { // Handles submission of an ID. If it matches that of a created timeslot, it will display that timeslot
    const filteredTimeslots = timeslots.filter(
      (timeslot) => timeslot.uuid === id
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
          <h1>Loading Inspection Signup...</h1>
          {/* <h1>Enter Timeslot ID below to access inspection signup</h1>
          <Link to="/">Back to home</Link>
          <input
            className="timeslot-search-bar"
            type="text"
            // onChange={(e) => setUUID(e.target.value)}
          />
          <button onClick={() => handleIDSubmission()}>Submit ID</button> */}
        </div>
      ) : ( 
        <div>
          <Timeslot 
            setActive={setActive}
            interval={selectedTimeslot.interval}
            entryLimit={selectedTimeslot.entryLimit}
            slotsAvailableByDay={selectedTimeslot.slotsAvailableByDay}
            timeFrom={selectedTimeslot.timeFrom}
            timeTo={selectedTimeslot.timeTo}
            selectedDates={selectedTimeslot.selectedDates}
            eventTitle={selectedTimeslot.eventTitle}
            UUID={id}
            updateSelectedTimeslot={updateSelectedTimeslot}
          />
        </div>
      )}
    </div>
  );
};

export default ViewTimeslot;

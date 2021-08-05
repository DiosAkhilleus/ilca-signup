import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTimeslots } from '../../javascript/timeslotLogic';
import Timeslot from './Timeslot';
import '../../App.css';

const ViewTimeslot = () => {
  const [selectedTimeslot, setSelectedTimeslot] = useState({});
  const [active, setActive] = useState(false); // Whether or not the timeslot display is active

  let { id } = useParams();

  useEffect(() => { // Retrieves created timeslots on page load
    setTimeslot(); 
  //eslint-disable-next-line
  }, []);

  const setTimeslot = () => { // Run on page load — sets current timeslots to those retrieved from the DB
    getTimeslots().then((results) => handleIDSubmission(results));
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
        </div>
      ) : ( 
        <div>
          <Timeslot 
            setActive={setActive}
            interval={selectedTimeslot.interval}
            ilcaNum={selectedTimeslot.ilcaNum}
            slotsAvailableByDay={selectedTimeslot.slotsAvailableByDay}
            timeFrom={selectedTimeslot.timeFrom}
            timeTo={selectedTimeslot.timeTo}
            selectedDates={selectedTimeslot.selectedDates}
            eventTitle={selectedTimeslot.eventTitle}
            UUID={id}
          />
        </div>
      )}
    </div>
  );
};

export default ViewTimeslot;

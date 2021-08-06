import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTimeslots } from '../../javascript/timeslotLogic';
import Timeslot from './Timeslot';
import '../../App.css';

const ViewTimeslot = () => {
  const [selectedTimeslot, setSelectedTimeslot] = useState({}); // The currently selected signup sheet, selected by matching the correct UUID
  const [active, setActive] = useState(false); // Whether or not the timeslot display is active

  let { id } = useParams(); // Retrieves the id from the URL params in order to match it with a corresponding DB entry

  useEffect(() => {
    // Retrieves created timeslots on page load
    setTimeslot();
    //eslint-disable-next-line
  }, []);

  const setTimeslot = () => {
    // Run on page load — sets current timeslots to those retrieved from the DB
    getTimeslots().then((results) => handleIDSubmission(results));
  };

  const handleIDSubmission = (timeslots) => {
    // Handles submission of an ID. If it matches that of a created timeslot, it will display that timeslot
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
            interval={selectedTimeslot.interval} // The interval between signup time possibilities
            ilcaNum={selectedTimeslot.ilcaNum} // The event's designation number, for future API call use
            slotsAvailableByDay={selectedTimeslot.slotsAvailableByDay} // The information for each day including unavailable slots and how many signups are available at each given time
            timeFrom={selectedTimeslot.timeFrom} // The start time for each day of the inspection signups
            timeTo={selectedTimeslot.timeTo} // The end time for each day of the inspection signups
            selectedDates={selectedTimeslot.selectedDates} // The list of dates during which signups will take place
            eventTitle={selectedTimeslot.eventTitle} // The title of the event
            UUID={id} // The ID number used to search the DB for the corresponding event
          />
        </div>
      )}
    </div>
  );
};

export default ViewTimeslot;

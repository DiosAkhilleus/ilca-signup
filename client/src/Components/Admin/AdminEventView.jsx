import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSignupByEventNum } from '../../javascript/adminLogic';
import { updateSailorInspection } from '../../javascript/adminLogic';
import Button from '@material-ui/core/Button';
import Day from './Day';

const ViewEvent = () => {
  const { ilcaNum } = useParams(); // The event number, used to retrieve the correct event from the DB
  const [currentSignup, setCurrentSignup] = useState({}); // The event matching the ilcaNum from params
  const [dates, setDates] = useState([]); // The set of dates in the event
  const [slotsByDay, setSlotsByDay] = useState({}); // The slotsAvailableByDay object from the event's DB entry
  const [registered, setRegistered] = useState([]); // The current list of people registered for equipment inspection
  const [moveToggle, setMoveToggle] = useState(false); // Whether or not a sailor has been toggle by the admin for moving
  const [toggledTime, setToggledTime] = useState(0); // The sailor-toggled-to-move's original inspection time
  const [toggledDate, setToggledDate] = useState(''); // The sailor-toggled-to-move's original inspection date
  const [sailorToMove, setSailorToMove] = useState(''); // The sailor-toggled-to-move's sailorID, e.g. 'AUTAM6'

  useEffect(() => {
    // Retrieves the correct event from the DB based on the ilcaNum url param
    getSignupByEventNum(ilcaNum).then((results) => {
      setCurrentSignup(results[0]);
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // setDates(Object.keys(currentSignup.slotsAvailableByDay));
    if (currentSignup.slotsAvailableByDay) {
      setDates(Object.keys(currentSignup.slotsAvailableByDay));
      setSlotsByDay(currentSignup.slotsAvailableByDay);
      setRegistered(currentSignup.inspectionReqs);
    }
  }, [currentSignup]);

  const toggleSailorMove = (sailorID, time, day) => {
    // Toggles whether or not a sailor is being moved by admin to a different time/day
    setMoveToggle(true);
    setSailorToMove(sailorID);
    setToggledTime(time);
    setToggledDate(day);
  };

  const unToggleSailorMove = () => {
    // Untoggles sailor movement
    setMoveToggle(false);
    setSailorToMove('');
  };

  const moveSailorInDB = (sailorID, timeTo, day, slotsIndex) => {
    updateSailorInspection( // Put request to DB updating both the sailor's inspection time/day and the slots available for the time 'from' and time 'to'
      sailorID,
      toggledTime,
      timeTo,
      day,
      registered,
      ilcaNum,
      slotsByDay,
      slotsIndex
    );
    setMoveToggle(false);
    setSailorToMove('');
  };

  const getRegistered = (time, date) => {
    return registered
      .filter((item) => item.time === time && item.day === date)
      .map((el, ind) => (
        <div className="reg-sailor" key={ind}>
          {el.sailorID === sailorToMove ? (
            <strong style={{ color: 'orange' }}>
              <i>{el.sailorID}</i>
            </strong>
          ) : (
            <strong>{el.sailorID}</strong>
          )}

          {moveToggle === false ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleSailorMove(el.sailorID, el.time, el.day)}
            >
              Move
            </Button>
          ) : (
            <Button 
              variant="contained"
              disabled
            >
              Move
            </Button>
          )}
        </div>
      ));
  };

  return (
    <div>
      <Link to="/admin">Back to Admin</Link>
      <div>
        <div className="admin-event-title">
          {currentSignup.eventTitle ? (
            <strong>
              <div>{currentSignup.eventTitle}</div>
            </strong>
          ) : (
            ''
          )}
        </div>
        {/* <h3>Current Inspection Signups</h3>
        {registered.length > 0 ? (
          registered.map((el, index) => (
            <div key={index} className="admin-day-container">
              {el.sailorID} – {el.name.familyName}, {el.name.firstName} –{' '}
              {el.day}
            </div>
          ))
        ) : (
          <div>No Sailors Currently Signed Up</div>
        )} */}
      </div>
      <br />
      <div>
        {dates.length > 0
          ? dates.map((date, index) => (
              <Day
                key={index}
                date={date}
                slotsByDay={slotsByDay}
                getRegistered={getRegistered}
                moveToggle={moveToggle}
                toggledTime={toggledTime}
                toggledDate={toggledDate}
                unToggle={unToggleSailorMove}
                sailorToMove={sailorToMove}
                moveSailorInDB={moveSailorInDB}
              />
            ))
          : ''}
      </div>
    </div>
  );
};

export default ViewEvent;

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSignupByEventNum } from '../../javascript/adminLogic';
import { updateSailorInspection } from '../../javascript/adminLogic';
import Button from '@material-ui/core/Button';
import Day from './Day';

const ViewEvent = () => {
  const { ilcaNum } = useParams();
  const [currentSignup, setCurrentSignup] = useState({});
  const [dates, setDates] = useState([]);
  const [slotsByDay, setSlotsByDay] = useState({});
  const [registered, setRegistered] = useState([]);
  const [moveToggle, setMoveToggle] = useState(false);
  const [toggledTime, setToggledTime] = useState(0);
  const [toggledDate, setToggledDate] = useState('');
  const [sailorToMove, setSailorToMove] = useState('');

  useEffect(() => {
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
      setMoveToggle(true);
      setSailorToMove(sailorID);
      setToggledTime(time);
      setToggledDate(day);
    console.log(sailorID, time);
  };

  const unToggleSailorMove = (sailorID) => {
    setMoveToggle(false);
    setSailorToMove('');
  }

  const moveSailorInDB = (sailorID, timeTo, day, slotsIndex) => {
    updateSailorInspection(sailorID, toggledTime, timeTo, day, registered, ilcaNum, slotsByDay, slotsIndex);
    setMoveToggle(false);
    setSailorToMove('');
    // setTimeout(window.location.reload(), 500)
  }

  const getRegistered = (time, date) => {
    return registered
      .filter((item) => item.time === time && item.day === date)
      .map((el, ind) => (
        <div className="reg-sailor" key={ind}>
          <strong>{el.sailorID}</strong>
          {moveToggle === false ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleSailorMove(el.sailorID, el.time, el.day)}
            >
              Move
            </Button>
          ) : (
            ''
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
        <h3>Current Inspection Signups</h3>
        {registered.length > 0 ? (
          registered.map((el, index) => (
            <div key={index} className="admin-day-container">
              {el.sailorID} – {el.name.familyName}, {el.name.firstName} –{' '}
              {el.day}
            </div>
          ))
        ) : (
          <div>No Sailors Currently Signed Up</div>
        )}
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

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSignupByEventNum } from '../../javascript/adminLogic';
import {
  updateSailorInspection,
  removeSignupByEventNum,
  removeSailorFromEvent,
} from '../../javascript/adminLogic';
import Button from '@material-ui/core/Button';
import Day from './Day';
import { fetchEventDetails } from '../../javascript/timeslotLogic';

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
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    // Retrieves the correct event from the DB based on the ilcaNum url param
    getSignupByEventNum(ilcaNum).then((results) => {
      setCurrentSignup(results[0]);
    });
    fetchEventDetails(ilcaNum).then((details) => setEventDetails(details));
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
    updateSailorInspection(
      // Put request to DB updating both the sailor's inspection time/day and the slots available for the time 'from' and time 'to'
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

  const handleRemoveSailor = () => {
    removeSailorFromEvent(ilcaNum, sailorToMove);
    setTimeout(reloadPage, 500);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const getRegistered = (time, date) => {
    return registered
      .filter((item) => item.time === time && item.day === date)
      .map((el, ind) => (
        <div className="reg-sailor" key={ind}>
          {el.sailorID === sailorToMove ? (
            <strong style={{ color: 'orange' }}>
              <div>
                <i>{el.sailorID}</i>
              </div>
              <div>
                <i>
                  {el.name.firstName[0]}. {el.name.familyName}
                </i>
              </div>
            </strong>
          ) : (
            <strong>
              <div>{el.sailorID}</div>
              <div>
                {el.name.firstName[0]}. {el.name.familyName}
              </div>
            </strong>
          )}

          {moveToggle === false ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleSailorMove(el.sailorID, el.time, el.day)}
            >
              Edit
            </Button>
          ) : el.sailorID === sailorToMove ? (
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgb(194, 60, 75)', color: 'white' }}
              onClick={() => handleRemoveSailor()}
            >
              Delete Sailor
            </Button>
          ) : (
            <Button variant="contained" disabled>
              Edit
            </Button>
          )}
        </div>
      ));
  };

  const deleteSheet = (e) => {
    removeSignupByEventNum(ilcaNum);
    setTimeout(redirToAdmin, 500);
    e.preventDefault();
  };

  const redirToAdmin = () => {
    window.location.href = '/admin';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {eventDetails.logo ? (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}
            className="event-header"
          >
            <img
              src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
              alt="ILCA Logo"
              style={{ width: 200 }}
            />
            <i>
              <h3 style={{ fontSize: 30, textAlign: 'center' }}>
                {eventDetails.title}
              </h3>
            </i>
            <img
              src={eventDetails.logo}
              alt="Event Logo"
              style={{ width: 200 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              style={{
                margin: 'auto',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 30,
              }}
              to="/admin"
            >
              Back to Admin
            </Link>
            <Link
              to={`/signup/${currentSignup.uuid}`}
              style={{ marginBottom: 20 }}
            >
              Link To Sailor Signup
            </Link>
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Button
              style={{
                backgroundColor: 'rgb(194, 60, 75, 1)',
                color: 'ivory',
                maxWidth: 300,
                margin: 'auto !important',
                marginBottom: 30,
              }}
              onClick={(e) => deleteSheet(e)}
            >
              Delete This Signup Sheet
            </Button>
          </div>
        </div>
      ) : (
        <div style={{margin: 'auto', marginTop: '25%', fontSize: 40}}>Loading...</div>
      )}
    </div>
  );
};

export default ViewEvent;

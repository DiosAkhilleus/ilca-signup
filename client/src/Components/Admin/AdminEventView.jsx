import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSignupByEventNum } from '../../javascript/adminLogic';

const ViewEvent = () => {
  const { ilcaNum } = useParams();
  const [currentSignup, setCurrentSignup] = useState({});
  const [dates, setDates] = useState([]);
  const [slotsByDay, setSlotsByDay] = useState({});
  const [registered, setRegistered] = useState([]);

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

  return (
    <div>
      <Link to="/admin">Back to Admin</Link>
      <div>
        <div className="title">
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
            <div key={index}>
              {el.sailorID} – {el.name.familyName}, {el.name.firstName} –{' '}
              {el.day}
            </div>
          ))
        ) : (
          <div>No Sailors Currently Signup Up</div>
        )}
      </div>
      <br />
      <div>
        {dates.length > 0
          ? dates.map((date, index) => (
              <div key={index}>
                {date}
                {slotsByDay
                  ? slotsByDay[date].entriesLeft.map((info, ind) => (
                      <div>{info[0]}</div>
                    ))
                  : ''}
              </div>
            ))
          : ''}
      </div>
    </div>
  );
};

export default ViewEvent;

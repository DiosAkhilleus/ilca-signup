import React from 'react';
import { Button } from '@material-ui/core';
import moment from 'moment';
import '../../App.css';

const Day = ({
  date,
  slotsByDay,
  getRegistered,
  moveToggle,
  toggledTime,
  toggledDate,
  unToggle,
  sailorToMove,
  moveSailorInDB,
}) => {
  const changeTimeFormat = (time) => {
    // Modifies time format for 'HH:MM' display. Possibly a better way to do this, but not sure.
    let div = time / 60;
    let minutes = time % 60;
    let hours = Math.floor(div);
    let format = `${hours} : ${minutes === 0 ? `00` : minutes}`;
    return (
      <div className="admin-time">
        <i>{format}</i>
      </div>
    );
  };

  return (
    <div className="admin-day">
      <h2
        style={{
          textAlign: 'center',
          margin: 10,
          borderBottom: '2px solid black',
          paddingBottom: 10,
        }}
      >
        {moment(date).format('MMM. DD, yyyy')}
      </h2>
      <div className="admin-day-slot-container">
        {slotsByDay
          ? slotsByDay[date].entriesLeft.map((info, ind) => (
              <div className="admin-slot" key={ind}>
                {
                  <div className="admin-reg-sailors-container">
                  {moment(date).format('dddd, MMMM DD, yyyy')}{changeTimeFormat(info[0])}{' '}
                    <div className="reg-sailor-flex">
                      {getRegistered(info[0], date)}
                    </div>
                    {moveToggle === true &&
                    info[0] === toggledTime &&
                    date === toggledDate ? (
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: 'darkorange',
                          marginBottom: 10,
                        }}
                        onClick={() => unToggle()}
                      >
                        Cancel Edit
                      </Button>
                    ) : (
                      ''
                    )}
                    {moveToggle === true &&
                    (info[0] !== toggledTime || date !== toggledDate) &&
                    info[1] > 0 ? (
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: 'rgb(2, 114, 186)',
                          color: 'white',
                          marginBottom: 10,
                        }}
                        onClick={() => {
                          moveSailorInDB(sailorToMove, info[0], date, ind);
                        }} // function params are sailorID, time, and date to which the sailor will be moved
                      >
                        Place Here
                      </Button>
                    ) : (
                      ''
                    )}
                    <div>Slots Available: <strong>{info[1]}</strong></div>
                  </div>
                }
              </div>
            ))
          : ''}
      </div>
    </div>
  );
};

export default Day;

import React from 'react';
import { Button } from '@material-ui/core';
import moment from 'moment';
import '../../App.css';

const EventDay = ({
  date,
  slotsByDay,
  getRegistered,
  currentSailor,
  setSelected,
  selectedTime,
  isSelected,
  deselect,
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
    <div>
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
                      {changeTimeFormat(info[0])}{' '}
                      <div className="reg-sailor-flex">
                        {getRegistered(info[0], date)}
                      </div>
                      <div style={{marginBottom: 10}}>Slots Available: <i>{info[1]}</i></div>
                      <div>
                        {info[1] > 0 ? (
                          currentSailor.name ? (
                            isSelected === true ? (
                              info[0] === selectedTime ? (
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: 'orange' }}
                                  onClick={() => deselect(date, info)}
                                >
                                  Cancel Placement
                                </Button>
                              ) : (
                                <Button variant="contained" disabled>
                                  Place {currentSailor.name.firstName}{' '}
                                  {currentSailor.name.familyName} Here
                                </Button>
                              )
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setSelected(date, info)}
                              >
                                Place {currentSailor.name.firstName}{' '}
                                {currentSailor.name.familyName} Here
                              </Button>
                            )
                          ) : (
                            <Button variant="contained" color="primary" disabled>
                              Place Sailor Here
                            </Button>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  }
                </div>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};

export default EventDay;
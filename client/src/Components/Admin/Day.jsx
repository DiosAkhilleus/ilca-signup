import React from 'react';
import '../../App.css';

const Day = ({ date, slotsByDay, getRegistered }) => {
  const changeTimeFormat = (time) => {
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
          paddingBottom: 10
        }}
      >
        {date}
      </h2>
      <div className="admin-day-slot-container">
        {slotsByDay
          ? slotsByDay[date].entriesLeft.map((info, ind) => (
              <div className="admin-slot" key={ind}>
                {
                  <div className="admin-reg-sailors-container">
                    {changeTimeFormat(info[0])}
                    <div className='reg-sailor-flex'>{getRegistered(info[0], date)}</div>
                    <div>Slots Available: {info[1]}</div>
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

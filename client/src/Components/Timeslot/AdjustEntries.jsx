import React from 'react';
import { useState, useEffect } from 'react';
import '../../App.css';

const AdjustEntries = ({
  setSlotsAvailableByDay,
  slotsAvailableByDay,
  element,
  index,
}) => {
  const [currentElement, setCurrentElement] = useState('');
  useEffect(() => {
    // console.log(element);
    setCurrentElement(element);
  }, []);
  const handleEntryChange = (index, method) => {
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    if (method === 'increase') {
      // console.log(replacementObj[element].entriesLeft[index][1]);
      if (
        replacementObj[element].unavailableSlots.indexOf(
          replacementObj[element].entriesLeft[index][0]
        ) === -1
      ) {
        replacementObj[element].entriesLeft[index][1] += 1;
      }
      console.log(replacementObj);
    } else if (method === 'decrease') {
      if (
        replacementObj[element].entriesLeft[index][1] > 0 &&
        replacementObj[element].unavailableSlots.indexOf(
          replacementObj[element].entriesLeft[index][0]
        ) === -1
      ) {
        replacementObj[element].entriesLeft[index][1] -= 1;
      }
    }
    console.log(replacementObj);
    setSlotsAvailableByDay(replacementObj);
  };

  return (
    <div>
      <div className="timeslots-available" style={{ marginBottom: 28 }}>
        {slotsAvailableByDay[element].entriesLeft.map((timeslot, index) => (
          <>
            <div key={index} className="slot-num">
              <div
                className="increase"
                onClick={() => {
                  handleEntryChange(index, 'increase');
                }}
              >
                &#9651;
              </div>
              <div>{timeslot[1]}</div>
              <div
                className="decrease"
                onClick={() => {
                  handleEntryChange(index, 'decrease');
                }}
              >
                &#9661;
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default AdjustEntries;

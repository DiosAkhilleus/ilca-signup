import React from 'react';
import '../../App.css';

const AdjustEntries = ({
  setSlotsAvailableByDay,
  slotsAvailableByDay,
  element,
}) => {
  const handleEntryChange = (index, method) => {
    // Controls the effects of clicking the up or down arrows on each day's entry limit
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    if (method === 'increase') {
      if (
        // if this specific slot is not found in the list of unavailable slots...
        replacementObj[element].unavailableSlots.indexOf(
          replacementObj[element].entriesLeft[index][0]
        ) === -1
      ) {
        // ...add one to that slot's entry limit
        replacementObj[element].entriesLeft = replacementObj[
          element
        ].entriesLeft.map((el, ind) =>
          ind === index ? [el[0], el[1] + 1] : el
        );
      }
      console.log(replacementObj);
    } else if (method === 'decrease') {
      // if this specific slot is not found in the list of unavailable slots...
      if (
        replacementObj[element].entriesLeft[index][1] > 0 &&
        replacementObj[element].unavailableSlots.indexOf(
          replacementObj[element].entriesLeft[index][0]
        ) === -1
      ) {
        // ...subtract one from that slot's entry limit
        replacementObj[element].entriesLeft = replacementObj[
          element
        ].entriesLeft.map((el, ind) =>
          ind === index ? [el[0], el[1] - 1] : el
        );
      }
    }
    setSlotsAvailableByDay(replacementObj); // Replace slotsAvailableByDay with the updated object
  };

  return (
    <div>
      <div className="timeslots-available" style={{ marginBottom: 28 }}>
        {slotsAvailableByDay[element].entriesLeft.map((timeslot, index) => (
          <div key={index} className="slot-num">
            <div
              className="increase"
              onClick={() => {
                handleEntryChange(index, 'increase');
              }}
            >
              &#9651; {/* upward pointing triangle */}
            </div>
            <div>{timeslot[1]}</div>
            <div
              className="decrease"
              onClick={() => {
                handleEntryChange(index, 'decrease');
              }}
            >
              &#9661; {/* downward pointing triangle */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdjustEntries;

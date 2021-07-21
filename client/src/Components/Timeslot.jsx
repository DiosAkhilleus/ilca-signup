import React from 'react';
import { useState, useEffect } from 'react';
import SlotPicker from 'slotpicker';
import { Link } from 'react-router-dom';
import { getSailors } from '../javascript/sailorLogic';
import {
  postTimeslotReqToDB,
  getCurrentlyScheduledInspections,
} from '../javascript/timeslotLogic';
import '../App.css';

const Timeslot = () => {
  const [time, setTime] = useState(0);
  const [currentEntries, setCurrentEntries] = useState([]);
  const [scheduledInspections, setScheduledInspections] = useState([]);
  const [sailorID, setSailorID] = useState('');
  const [day, setDay] = useState('2021-07-12');

  useEffect(() => {
    retrieveDBInfo();
  }, []);

  const retrieveDBInfo = async () => {
    getSailors().then((result) => setCurrentEntries(result));
    getCurrentlyScheduledInspections().then((result) =>
      setScheduledInspections(result)
    );
  };

  const submitInspectionReq = async (e) => {
    await retrieveDBInfo();
    if (sailorID === '' || time === 0 || day === '') {
      alert('please enter Sailor ID and select a day and timeslot');
      e.preventDefault();
      return;
    }
    if (
      currentEntries.filter((entry) => entry.sailorID === sailorID).length === 0
    ) {
      alert(
        `Sailor with ID: "${sailorID}" not found in current race entries. Sailor must be entered to request inspection`
      );
      e.preventDefault();
      return;
    }
    if (
      scheduledInspections.filter(
        (inspection) => inspection.sailorID === sailorID
      ).length > 0
    ) {
      alert(`Sailor with ID: "${sailorID}" already entered for inspection.`);
      e.preventDefault();
      return;
    }
    const sailorEntry = currentEntries.filter(
      (entry) => entry.sailorID === sailorID
    );
    let firstName = sailorEntry[0].name.firstName;
    let familyName = sailorEntry[0].name.familyName;
    postTimeslotReqToDB(sailorID, firstName, familyName, time, day)

    e.preventDefault();
  };

  return (
    <div className="timeslot-container">
      <h1>Time Slot Selector</h1>
      <Link to="/">Back to Home</Link>
      <div className="timeslot">
        <SlotPicker
          interval={30}
          unavailableSlots={[720, 750]}
          selected_date={new Date()}
          from={8 * 60}
          to={16 * 60}
          onSelectTime={(slot) => {
            setTime(slot);
          }}
        />
      </div>
      <form className="signup-form">
        <input
          type="text"
          placeholder="Sailor ID"
          required
          value={sailorID}
          onChange={(e) => setSailorID(e.target.value)}
        />
        <button onClick={(e) => submitInspectionReq(e)}>
          Submit Inspection Request
        </button>
      </form>
    </div>
  );
};

export default Timeslot;

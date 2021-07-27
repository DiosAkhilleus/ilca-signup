import React from 'react';
import { useState, useEffect } from 'react';
import SlotPicker from 'slotpicker';
import { Link } from 'react-router-dom';
import { getSailors } from '../../javascript/sailorLogic';
import {
  postTimeslotReqToDB,
  getCurrentlyScheduledInspections,
  updateTimeslotByUUID
} from '../../javascript/timeslotLogic';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment';
import '../../App.css';

const Timeslot = ({
  interval,
  entryLimit,
  timeFrom,
  timeTo,
  selectedDates,
  eventTitle,
  setActive,
  slotsAvailableByDay,
  UUID,
  updateSelectedTimeslot
}) => {
  // Eventually most of these states will be replaced with props that come from a selected timeslot in the DB
  const [time, setTime] = useState(0);
  const [currentEntries, setCurrentEntries] = useState([]);
  const [scheduledInspections, setScheduledInspections] = useState([]);
  const [sailorID, setSailorID] = useState('');
  const [currentSailor, setCurrentSailor] = useState({});
  const [day, setDay] = useState(selectedDates[0] || '2021-01-01');

  useEffect(() => { // Requests DB information on load to reflect the most recently entered list of sailors in the specific competition as well as the currently requested sailor equipment inspections
    getSailors().then((sailors) => setCurrentEntries(sailors));
    getCurrentlyScheduledInspections().then((entries) =>
      setScheduledInspections(entries)
    );
  }, []);

  useEffect(() => { // Every time sailorID updates, if that sailorID matches one in the currentEntries, currentSailor will update to reflect that selected sailor from the entries list
    const selectedSailor = currentEntries.filter(
      (entry) => entry.sailorID === sailorID
    );
    if (selectedSailor.length > 0) {
      setCurrentSailor(selectedSailor[0]);
    } else {
      setCurrentSailor({});
    }
  }, [sailorID]);

  const getInspectionsAndSubmitReq = (e) => { // Retrieves already-scheduled inspections, then updates the timeslot information from the DB
    getCurrentlyScheduledInspections().then((inspecs) =>
      submitInspectionReq(inspecs)
    );
    updateSelectedTimeslot(); // Passed from the parent component. Retrieves timeslot DB information
    e.preventDefault();
  };

  const submitInspectionReq = (inspecs) => { // Submits an inspection request if all fields are filled out
    if (sailorID === '' || time === 0 || day === '') {
      alert('please enter Sailor ID and select a day and timeslot');
      // e.preventDefault();
      return;
    }
    if (
      currentEntries.filter((entry) => entry.sailorID === sailorID).length === 0
    ) {
      alert(
        `Sailor with ID: "${sailorID}" not found in current race entries. Sailor must be entered to request inspection`
      );
      // e.preventDefault();
      return;
    }
    if (
      inspecs.filter((inspection) => inspection.sailorID === sailorID).length >
      0
    ) {
      alert(`Sailor with ID: "${sailorID}" already entered for inspection.`);
      // e.preventDefault();
      return;
    }
    const sailorEntry = currentEntries.filter(
      (entry) => entry.sailorID === sailorID
    );
    let firstName = sailorEntry[0].name.firstName;
    let familyName = sailorEntry[0].name.familyName;
    postTimeslotReqToDB(eventTitle, sailorID, firstName, familyName, time, day);
    updateTimeslotByUUID(UUID, day, time, slotsAvailableByDay);
    // e.preventDefault();
  };

  const onInputChange = (event, value) => { // Sets the current sailorID based on the Autocomplete field's value
    setSailorID(value);
  };

  const handleDateChange = (e) => { // Sets the current date based on the Date selector dropdown
    setDay(e.target.value);
  };

  return (
    <div className="timeslot-container">
      <h1>Time Slot Selector</h1>
      <Link to="/">Back to Home</Link>

      <button onClick={() => setActive(false)} style={{ marginTop: 10 }}>
        Select Different Event
      </button>
      <h3>Event: {eventTitle}</h3>
      <FormControl variant="filled" style={{ margin: 10, minWidth: 250 }}>
        <InputLabel id="demo-simple-select-filled-label">Date</InputLabel>
        <Select
          id="demo-simple-select-filled"
          value={day}
          onChange={(e) => {
            handleDateChange(e);
          }}
        >
          {selectedDates.map((el, index) => (
            <MenuItem key={[el, index]} value={el}>
              {moment(el).format('D MMMM YYYY')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{marginTop: 30, fontSize: 20}}>Slots Remaining</div>
      <hr style={{border: '1px solid black', width: '100%'}}/>
      <div className="timeslot">
        <div className="timeslots-available">
          {slotsAvailableByDay[day].entriesLeft.map((timeslot, index) => <div key={index} className="slot-num">{timeslot[1]}</div>)}
        </div>
        <SlotPicker
          interval={interval}
          unavailableSlots={slotsAvailableByDay[day].unavailableSlots}
          selected_date={new Date()}
          from={timeFrom}
          to={timeTo}
          onSelectTime={(slot) => {
            setTime(slot);
          }}
        />
      </div>
      <form className="signup-form">
        <Autocomplete
          id="combo-box-demo"
          options={currentEntries}
          getOptionLabel={(option) => option.sailorID}
          getOptionSelected={(option) => option.sailorID}
          onInputChange={onInputChange}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sailor"
              variant="outlined"
              value={sailorID}
            />
          )}
        />
        <div>
          {!currentSailor.sailorID ? (
            ''
          ) : (
            <h3>
              {currentSailor.sailorID} - {currentSailor.name.firstName}{' '}
              {currentSailor.name.familyName}
            </h3>
          )}
        </div>
        <Button
          color="primary"
          style={{ marginTop: 10 }}
          variant="contained"
          type="submit"
          onClick={(e) => getInspectionsAndSubmitReq(e)}
        >
          Submit Inspection Request
        </Button>
      </form>
    </div>
  );
};

export default Timeslot;

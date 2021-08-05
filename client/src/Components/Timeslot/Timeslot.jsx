import React from 'react';
import { useState, useEffect } from 'react';
import SlotPicker from 'slotpicker';
import { Link } from 'react-router-dom';
import { getSailors } from '../../javascript/sailorLogic';
import {
  getCurrentlyScheduledInspections,
  updateTimeslotByUUID,
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
  timeFrom,
  timeTo,
  selectedDates,
  eventTitle,
  ilcaNum,
  setActive,
  slotsAvailableByDay,
  UUID,
}) => {
  // Eventually most of these states will be replaced with props that come from a selected timeslot in the DB
  const [time, setTime] = useState(0);
  const [currentEntries, setCurrentEntries] = useState([]);
  const [requestingInspection, setRequestingInspection] = useState(false);
  // const [scheduledInspections, setScheduledInspections] = useState([]);
  const [sailorID, setSailorID] = useState('');
  const [currentSailor, setCurrentSailor] = useState({});
  const [day, setDay] = useState(selectedDates[0] || '2021-01-01');

  useEffect(() => {
    // Requests DB information on load to reflect the most recently entered list of sailors in the specific competition as well as the currently requested sailor equipment inspections
    getSailors(ilcaNum).then((sailors) => setCurrentEntries(sailors));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Every time sailorID updates, if that sailorID matches one in the currentEntries, currentSailor will update to reflect that selected sailor from the entries list
    const selectedSailor = currentEntries.filter(
      (entry) => entry.sailorID === sailorID
    );
    if (selectedSailor.length > 0) {
      setCurrentSailor(selectedSailor[0]);
    } else {
      setCurrentSailor({});
    }
    //eslint-disable-next-line
  }, [sailorID]);

  const refreshOnSubmit = () => {
    window.location.reload();
  }

  const submitInspectionReq = (e) => {
    // Submits an inspection request if all fields are filled out
    if (sailorID === '' || time === 0 || day === '') {
      alert('please enter Sailor ID and select a day and timeslot');
      return;
    }
    if (
      currentEntries.filter((entry) => entry.sailorID === sailorID).length === 0
    ) {
      alert(
        `Sailor with ID: "${sailorID}" not found in current race entries. Sailor must be entered to request inspection`
      );
      return;
    }
    getCurrentlyScheduledInspections(UUID).then(
      (currentlyScheduledInspections) => {
        if (
          currentlyScheduledInspections.filter(
            (inspection) => inspection.sailorID === sailorID
          ).length > 0
        ) {
          alert(
            `Sailor with ID: "${sailorID}" already entered for inspection.`
          );
          return;
        }
        const sailorEntry = currentEntries.filter(
          (entry) => entry.sailorID === sailorID
        );
        let firstName = sailorEntry[0].name.firstName;
        let familyName = sailorEntry[0].name.familyName;
        let inspectionReq = {
          eventTitle: eventTitle,
          day: day,
          time: time,
          name: {
            firstName: firstName,
            familyName: familyName,
          },
          sailorID: sailorID,
        };
        // postTimeslotReqToDB(eventTitle, sailorID, firstName, familyName, time, day);
        updateTimeslotByUUID(
          UUID,
          day,
          time,
          slotsAvailableByDay,
          inspectionReq, 
        );
        setRequestingInspection(true);
        setTimeout(refreshOnSubmit, 500);
        }
      );
      e.preventDefault();
  };

  const onInputChange = (event, value) => {
    // Sets the current sailorID based on the Autocomplete field's value
    setSailorID(value);
  };

  const handleDateChange = (e) => {
    // Sets the current date based on the Date selector dropdown
    setDay(e.target.value);
  };

  return (
    <div className="timeslot-container">
      <h1>Time Slot Selector</h1>
      <Link to="/">Back to Home</Link>

      <button onClick={() => setActive(false)} style={{ marginTop: 10 }}>
        Select Different Event
      </button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <img
          src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
          alt="ILCA Logo"
          style={{ width: 200 }}
        />
        <h3>Event: {eventTitle}</h3>
        <img
          src="https://sailing.laserinternational.org/regattauploads/2021/4_7Y/Event_Logo.png"
          alt="Event Logo"
          style={{ width: 200 }}
        />
      </div>
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
      <div style={{ marginTop: 30, fontSize: 20 }}>Slots Remaining</div>
      <hr style={{ border: '1px solid black', width: '100%' }} />
      <div className="timeslot">
        <div className="timeslots-available">
          {slotsAvailableByDay[day].entriesLeft.map((timeslot, index) => (
            <div key={index} className="slot-num">
              {timeslot[1]}
            </div>
          ))}
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
          {requestingInspection === true ? <h3>Sending Inspection Request...</h3> : ''}
        </div>
        <Button
          color="primary"
          style={{ marginTop: 10, marginBottom: 40 }}
          variant="contained"
          type="submit"
          onClick={(e) => {
            submitInspectionReq(e);
            e.preventDefault();
          }}
        >
          Submit Inspection Request
        </Button>
      </form>
    </div>
  );
};

export default Timeslot;

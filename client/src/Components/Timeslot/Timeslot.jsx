
// CURRENTLY NOT IN USE - CHANGES MADE AND NOW EVENTDAY IS IN USE INSTEAD

import React from 'react';
import { useState, useEffect } from 'react';
import SlotPicker from 'slotpicker';
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
  slotsAvailableByDay,
  UUID,
  inspectionReqs
}) => {
  // Eventually most of these states will be replaced with props that come from a selected timeslot in the DB
  const [time, setTime] = useState(0); // The time selected by the user signing up for inspection
  const [currentEntries, setCurrentEntries] = useState([]); // The list of current sailors registered for an event. This will be controlled later by an API call including the ilcaNum
  const [requestingInspection, setRequestingInspection] = useState(false); // Whether or not an inspection is in the process of being requested.
  // const [scheduledInspections, setScheduledInspections] = useState([]);
  const [sailorID, setSailorID] = useState(''); // The sailor's ID number
  const [currentSailor, setCurrentSailor] = useState({}); // Sailor selected from the Autocomplete list provided
  const [day, setDay] = useState(selectedDates[0] || '2021-01-01'); // The currently selected day from the dropdown list
  const [inspectionReqIDs, setInspectionReqIDs] = useState([]);

  useEffect(() => {
    // Requests DB information on load to reflect the most recently entered list of sailors in the specific competition as well as the currently requested sailor equipment inspections
    getSailors(ilcaNum).then((sailors) => setCurrentEntries(sailors));
    setInspectionReqIDs(inspectionReqs.map((req, ind) => req.sailorID))
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
    // Handles refreshing the page
    window.location.reload();
  };

  const submitInspectionReq = (e) => {
    // Submits an inspection request if all fields are filled out
    if (sailorID === '' || time === 0 || day === '') {
      alert('please enter Sailor ID and select a day and timeslot');
      return;
    }
    if (
      currentEntries.filter((entry) => entry.sailorID === sailorID).length === 0 // If a sailor with the given ID is not registered for the specific event this is for
    ) {
      alert(
        `Sailor with ID: "${sailorID}" not found in current race entries. Sailor must be entered to request inspection`
      );
      return;
    }
    getCurrentlyScheduledInspections(UUID).then(
      // retrieves the list of sailors for the given event already entered for inspection
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
          // This is the format of the inspection request, so that the information can later be displayed publicly or on the admin page
          eventTitle: eventTitle,
          day: day,
          time: time,
          name: {
            firstName: firstName,
            familyName: familyName,
          },
          sailorID: sailorID,
        };
        updateTimeslotByUUID(
          // Sends a PUT request to the DB, updating the information for a specific event based on the UUID provided
          UUID,
          day,
          time,
          slotsAvailableByDay,
          inspectionReq
        );
        setRequestingInspection(true); // Sets the requestingInspection property to true so that the display updates to reflect that information
        setTimeout(refreshOnSubmit, 500); // Refreshes the page after 500ms, to ensure that the correct data will be displayed and the frontend has a chance to catch up with the db information
      }
    );
    e.preventDefault(); // prevent immediate page refresh
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
      <h1>Equipment Inspection Signup</h1>
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
          {selectedDates.map(
            (
              el,
              index // Maps the dates set by admin onto the dropdown selector
            ) => (
              <MenuItem key={[el, index]} value={el}>
                {moment(el).format('D MMMM YYYY')}
              </MenuItem>
            )
          )}
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
        <Autocomplete // Autocomplete form that has the currently entered sailors for the specific event as options
          id="combo-box-demo"
          options={currentEntries.filter(sailor => inspectionReqIDs.indexOf(sailor.sailorID) < 0)}
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
          {requestingInspection === true ? (
            <h3>Sending Inspection Request...</h3>
          ) : (
            ''
          )}
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

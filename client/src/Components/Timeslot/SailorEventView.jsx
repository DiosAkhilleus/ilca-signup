import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTimeslots } from '../../javascript/timeslotLogic';
import { getSailors } from '../../javascript/sailorLogic';
import {
  getCurrentlyScheduledInspections,
  updateTimeslotByUUID,
} from '../../javascript/timeslotLogic';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EventDay from './EventDay';

const SailorEventView = () => {
  const [currentSignup, setCurrentSignup] = useState({}); // The currently selected signup sheet, selected by matching the correct UUID
  const [active, setActive] = useState(false); // Whether or not the timeslot display is active
  const [dates, setDates] = useState([]); // The set of dates in the event
  const [slotsByDay, setSlotsByDay] = useState({}); // The slotsAvailableByDay object from the event's DB entry
  const [registered, setRegistered] = useState([]); // The current list of people registered for equipment inspection
  const [currentEntries, setCurrentEntries] = useState([]); // The list of current sailors registered for an event. This will be controlled later by an API call including the ilcaNum
  const [inspectionReqIDs, setInspectionReqIDs] = useState([]);
  const [sailorID, setSailorID] = useState(''); // The sailor's ID number
  const [currentSailor, setCurrentSailor] = useState({}); // Sailor selected from the Autocomplete list provided
  const [selectedTime, setSelectedTime] = useState(0);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  let { id } = useParams(); // Retrieves the id from the URL params in order to match it with a corresponding DB entry

  useEffect(() => {
    // Retrieves created timeslots on page load
    getTimeslots().then((results) => handleIDSubmission(results));
    //eslint-disable-next-line
  }, []);

  const handleIDSubmission = (timeslots) => {
    // Handles submission of an ID. If it matches that of a created timeslot, it will display that timeslot
    const filteredTimeslots = timeslots.filter(
      (timeslot) => timeslot.uuid === id
    );
    if (!filteredTimeslots.length > 0) {
      alert(`This id doesn't match a registered Inspection Signup`);
    } else {
      setCurrentSignup(filteredTimeslots[0]);
      setActive(true);
    }
  };

  useEffect(() => {
    if (currentSignup.slotsAvailableByDay) {
      setDates(Object.keys(currentSignup.slotsAvailableByDay));
      setSlotsByDay(currentSignup.slotsAvailableByDay);
      setRegistered(currentSignup.inspectionReqs);
      getSailors(currentSignup.ilcaNum).then((sailors) =>
        setCurrentEntries(sailors)
      );
      setInspectionReqIDs(
        currentSignup.inspectionReqs.map((req, ind) => req.sailorID)
      );
    }
  }, [currentSignup]);

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

  const getRegistered = (time, date) => {
    return registered
      .filter((item) => item.time === time && item.day === date)
      .map((el, ind) => (
        <div className="reg-sailor" key={ind}>
          <strong>
            {el.name.firstName} {el.name.familyName}
          </strong>
        </div>
      ));
  };

  const onInputChange = (event, value) => {
    // Sets the current sailorID based on the Autocomplete field's value
    setSailorID(value);
    setIsSelected(false);
  };

  const setSelected = (date, info) => {
    setSelectedTime(info[0]);
    setIsSelected(true);
    setSelectedDate(date);
  };

  const deselect = (date, info) => {
    setSelectedTime(0);
    setIsSelected(false);
    setSelectedDate('');
  };

  const submitInspectionReq = (e) => {
    // Submits an inspection request if all fields are filled out
    if (sailorID === '' || selectedTime === 0 || selectedDate === '') {
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
    getCurrentlyScheduledInspections(id).then(
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
          eventTitle: currentSignup.eventTitle,
          day: selectedDate,
          time: selectedTime,
          name: {
            firstName: firstName,
            familyName: familyName,
          },
          sailorID: sailorID,
        };
        updateTimeslotByUUID(
          // Sends a PUT request to the DB, updating the information for a specific event based on the UUID provided
          id,
          selectedDate,
          selectedTime,
          slotsByDay,
          inspectionReq
        );
        setTimeout(reloadPage, 500); // Refreshes the page after 500ms, to ensure that the correct data will be displayed and the frontend has a chance to catch up with the db information
      }
    );
    e.preventDefault(); // prevent immediate page refresh
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div>
      {active === false ? (
        <div className="timeslot-search-container">
          <h1>Loading Inspection Signup...</h1>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}
            className="event-header"
          >
            <img
              src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
              alt="ILCA Logo"
              style={{ width: 200 }}
            />
            <i>
              <h3 style={{ fontSize: 40, textAlign: 'center'}}>
                Event: {currentSignup.eventTitle}
              </h3>
            </i>
            <img
              src="https://sailing.laserinternational.org/regattauploads/2021/4_7Y/Event_Logo.png"
              alt="Event Logo"
              style={{ width: 200 }}
            />
          </div>
          <div style={{ margin: 'auto', textAlign: 'center', fontSize: 20 }}>
            1. Select a sailor from the dropdown menu <br />
            2. Select a timeslot <br />
            3. Click the submit button
          </div>
          <form className="signup-form">
            <Autocomplete // Autocomplete form that has the currently entered sailors for the specific event as options
              id="combo-box-demo"
              options={currentEntries.filter(
                (sailor) => inspectionReqIDs.indexOf(sailor.sailorID) < 0
              )}
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
                <h3>Please Select Sailor</h3>
              ) : (
                <h3>
                  {currentSailor.sailorID} - {currentSailor.name.firstName}{' '}
                  {currentSailor.name.familyName}
                </h3>
              )}
              {/* {requestingInspection === true ? (
                <h3>Sending Inspection Request...</h3>
              ) : (
                ''
              )} */}
            </div>
            {isSelected ? (
              <Button
                style={{
                  marginTop: 10,
                  marginBottom: 40,
                  backgroundColor: 'lightgreen',
                  color: 'black',
                  transition: '0.2s'
                }}
                variant="contained"
                type="submit"
                onClick={(e) => {
                  submitInspectionReq(e);
                  e.preventDefault();
                }}
              >
                Submit Inspection Request
              </Button>
            ) : (
              <Button
                style={{
                  marginTop: 10,
                  marginBottom: 40,
                }}
                variant="contained"
                type="submit"
                disabled
              >
                Submit Inspection Request
              </Button>
            )}
          </form>
          {dates.length > 0
            ? dates.map((date, index) => (
                <EventDay
                  key={index}
                  date={date}
                  slotsByDay={slotsByDay}
                  getRegistered={getRegistered}
                  currentSailor={currentSailor}
                  setSelected={setSelected}
                  selectedTime={selectedTime}
                  isSelected={isSelected}
                  deselect={deselect}
                />
              ))
            : ''}
        </div>
      )}
    </div>
  );
};

export default SailorEventView;

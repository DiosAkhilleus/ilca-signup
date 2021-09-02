import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTimeslots } from '../../javascript/timeslotLogic';
import {
  getCurrentlyScheduledInspections,
  updateTimeslotByUUID,
  fetchEventDetails,
  fetchSailorDetails,
} from '../../javascript/timeslotLogic';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import EventDay from './EventDay';
import moment from 'moment';

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
  const [eventDetails, setEventDetails] = useState({});
  //eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());

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
      setInspectionReqIDs(
        currentSignup.inspectionReqs.map((req, ind) => req.sailorID)
      );
    }
    if (currentSignup.ilcaNum) {
      fetchEventDetails(currentSignup.ilcaNum).then((results) =>
        setEventDetails(results)
      );
      fetchSailorDetails(currentSignup.ilcaNum).then((results) => {
        let sorted = results.sort((a, b) => (a.isaf > b.isaf ? 1 : -1));
        setCurrentEntries(sorted);
      });
    }
  }, [currentSignup]);

  useEffect(() => {
    // Every time sailorID updates, if that sailorID matches one in the currentEntries, currentSailor will update to reflect that selected sailor from the entries list
    const selectedSailor = currentEntries.filter(
      (entry) => entry.isaf === sailorID
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
    if (value) {
      setSailorID(value.isaf);
    } else {
      setSailorID('');
    }
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
    console.log(sailorID, selectedTime, selectedDate);
    if (sailorID === '' || selectedTime === 0 || selectedDate === '') {
      alert('please enter Sailor ID and select a day and timeslot');
      return;
    }
    if (
      currentEntries.filter((entry) => entry.isaf === sailorID).length === 0 // If a sailor with the given ID is not registered for the specific event this is for
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
          (entry) => entry.isaf === sailorID
        );
        let firstName = sailorEntry[0].firstName;
        let familyName = sailorEntry[0].familyName;
        console.log(firstName, familyName);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {active === false || !eventDetails.logo ? (
        <div className="timeslot-search-container">
          <h1>Loading Inspection Signup...</h1>
        </div>
      ) : currentDate < new Date(currentSignup.shutoffDate) ? (
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <i>
                <h3
                  style={{
                    fontSize: 30,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  {eventDetails.title}
                </h3>
              </i>
              <h3 style={{ fontSize: 24 }}>Equipment Inspection Signup</h3>
            </div>
            <img
              src={eventDetails.logo}
              alt="Event Logo"
              style={{ width: 200 }}
            />
          </div>
          <hr
            style={{
              height: 2,
              border: 0,
              backgroundColor: 'grey',
              marginTop: 20,
            }}
          />
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 20,
              marginBottom: 30,
            }}
          >
            <h3>{`${eventDetails.country}, ${eventDetails.city}`}</h3>
          </div>
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              fontSize: 20,
              marginBottom: 30,
            }}
          >
            <strong>
              {moment(eventDetails.startDate.date).format(
                'dddd, MMMM Do, YYYY'
              )}{' '}
              —{' '}
              {moment(eventDetails.endDate.date).format('dddd, MMMM Do, YYYY')}
            </strong>
          </div>
          <div style={{ margin: 'auto', textAlign: 'center', fontSize: 20 }}>
            1. Begin typing a sailor's name or sailor ID in the form below <br />
            2. Select the timeslot you'd like to have for equipment inspection <br />
            3. Click the submit button
                <br />
                <br />
            <strong>If you submitted a time but would like to change it, please contact the ILCA office</strong>
          </div>
          <form className="signup-form">
            <Autocomplete // Autocomplete form that has the currently entered sailors for the specific event as options
              id="combo-box-demo"
              options={currentEntries.filter(
                (sailor) => inspectionReqIDs.indexOf(sailor.isaf) < 0
              )}
              getOptionLabel={(option) =>
                `${option.isaf} – ${option.firstName} ${option.familyName}`
              }
              getOptionSelected={(option) => option.isaf}
              onChange={onInputChange}
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
              {!currentSailor.isaf ? (
                <h3>Please Select Sailor</h3>
              ) : (
                <h3>
                  {currentSailor.isaf} - {currentSailor.firstName}{' '}
                  {currentSailor.familyName}
                </h3>
              )}
              {/* {requestingInspection === true ? (
                <h3>Sending Inspection Request...</h3>
              ) : (
                ''
              )} */}
            </div>
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
                  selectedDate={selectedDate}
                  isSelected={isSelected}
                  deselect={deselect}
                  submitInspectionReq={submitInspectionReq}
                />
              ))
            : ''}
        </div>
      ) : (
        <div style={{ margin: 'auto', marginTop: '25%', fontSize: 40 }}>
          Inspection Signup Has Expired
        </div>
      )}
    </div>
  );
};

export default SailorEventView;

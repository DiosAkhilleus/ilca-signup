import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchSailorDetails } from '../../javascript/timeslotLogic';
import { CSVLink } from 'react-csv';
import {
  getSignupByEventNum,
  updateSailorInspection,
  removeSignupByEventNum,
  removeSailorFromEvent,
  commitTimeChangeInDB,
} from '../../javascript/adminLogic';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-date-picker';
import moment from 'moment';
// import _ from 'lodash';
import Day from './Day';
import { fetchEventDetails } from '../../javascript/timeslotLogic';

const ViewEvent = () => {
  const { ilcaNum } = useParams(); // The event number, used to retrieve the correct event from the DB
  const [currentSignup, setCurrentSignup] = useState({}); // The event matching the ilcaNum from params
  const [dates, setDates] = useState([]); // The set of dates in the event
  const [shutoffDate, setShutoffDate] = useState({});
  const [commitChangeButton, setCommitChangeButton] = useState(false);
  const [slotsByDay, setSlotsByDay] = useState({}); // The slotsAvailableByDay object from the event's DB entry
  const [registered, setRegistered] = useState([]); // The current list of people registered for equipment inspection
  const [moveToggle, setMoveToggle] = useState(false); // Whether or not a sailor has been toggle by the admin for moving
  const [toggledTime, setToggledTime] = useState(0); // The sailor-toggled-to-move's original inspection time
  const [toggledDate, setToggledDate] = useState(''); // The sailor-toggled-to-move's original inspection date
  const [sailorToMove, setSailorToMove] = useState(''); // The sailor-toggled-to-move's sailorID, e.g. 'AUTAM6'
  const [eventDetails, setEventDetails] = useState({}); // Event details retrieved from the event API call
  const [sailorsRemainingUnsigned, setSailorsRemainingUnsigned] = useState([]); // Sets list of sailors registered for the event, but not signed up for inspection
  const [sailorsSignedUp, setSailorsSignedUp] = useState([]);
  //eslint-disable-next-line
  const [csvHeadersUnregistered, setCSVHeadersUnregistered] = useState([
    { label: 'Sailor ID', key: 'isaf' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Family Name', key: 'familyName' },
  ]);

  useEffect(() => {
    // Retrieves the correct event from the DB based on the ilcaNum url param
    getSignupByEventNum(ilcaNum).then((results) => {
      setCurrentSignup(results[0]);
    });
    fetchEventDetails(ilcaNum).then((details) => {
      setEventDetails(details);
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // setDates(Object.keys(currentSignup.slotsAvailableByDay));
    if (currentSignup.slotsAvailableByDay) {
      setDates(Object.keys(currentSignup.slotsAvailableByDay));
      setSlotsByDay(currentSignup.slotsAvailableByDay);
      setRegistered(currentSignup.inspectionReqs);
      setShutoffDate(
        new Date(moment(currentSignup.shutoffDate).format('M/D/YYYY'))
      );
    }
  }, [currentSignup]);

  useEffect(() => {
    fetchSailorDetails(ilcaNum).then((sailors) => {
      const registeredSailorIDs = registered.map((el) => el.sailorID); // Creates array of all sailor IDs currently registered for inspection
      let filteredSailors = sailors.filter(
        (sailor) => registeredSailorIDs.indexOf(sailor.isaf) < 0
      ); // Filters the sailors registered for the event against those currently signed up for inspectio
      setSailorsRemainingUnsigned(filteredSailors);
    });
    //eslint-disable-next-line
  }, [registered]);

  useEffect(() => {
    // Creates a sorted list for CSV export
    let csv = [];
    let timeList = [];
    let timeListForFilter = [];
    for (let day in currentSignup.slotsAvailableByDay) {
      for (let el in currentSignup.slotsAvailableByDay[day].entriesLeft) {
        let time = currentSignup.slotsAvailableByDay[day].entriesLeft[el][0];
        let hours = Math.floor(time / 60);
        let minutes = time % 60;
        let formatted = `${hours}:${minutes === 0 ? `00` : minutes}`;
        timeList.push(`${day}, ${formatted}`);
        timeListForFilter.push([day, time]);
      }
    }

    for (let i = 0; i < currentSignup.entryLimit; i++) {
      csv.push([]);
    }

    for (let i = 0; i < timeListForFilter.length; i++) {
      let currentSlot = timeListForFilter[i];
      let filteredEntries = registered.filter(
        (req) => req.day === currentSlot[0] && req.time === currentSlot[1]
      );
      for (let y = 0; y < csv.length; y++) {
        if (filteredEntries.length > 0) {
          let shiftedReq = filteredEntries.shift();
          let name = `${shiftedReq.name.firstName} ${shiftedReq.name.familyName}`;
          csv[y][i] = name;
        } else {
          csv[y][i] = '';
        }
      }
    }
    csv.unshift(timeList);

    setSailorsSignedUp(csv);
    //eslint-disable-next-line
  }, [registered]);

  const toggleSailorMove = (sailorID, time, day) => {
    // Toggles whether or not a sailor is being moved by admin to a different time/day
    setMoveToggle(true);
    setSailorToMove(sailorID);
    setToggledTime(time);
    setToggledDate(day);
  };

  const unToggleSailorMove = () => {
    // Untoggles sailor movement
    setMoveToggle(false);
    setSailorToMove('');
    setToggledTime(0);
  };

  const moveSailorInDB = (sailorID, timeTo, day, slotsIndex) => {
    updateSailorInspection(
      // Put request to DB updating both the sailor's inspection time/day and the slots available for the time 'from' and time 'to'
      sailorID,
      toggledTime,
      timeTo,
      day,
      registered,
      ilcaNum,
      slotsByDay,
      slotsIndex
    );
    setMoveToggle(false);
    setSailorToMove('');
    setToggledTime(0);
  };

  const handleRemoveSailor = () => {
    removeSailorFromEvent(ilcaNum, sailorToMove);
    setTimeout(reloadPage, 500);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const getRegistered = (time, date) => {
    return registered
      .filter((item) => item.time === time && item.day === date)
      .map((el, ind) => (
        <div className="reg-sailor" key={ind}>
          {el.sailorID === sailorToMove ? (
            <strong style={{ color: 'orange' }}>
              <div>
                <i>{el.sailorID}</i>
              </div>
              <div>
                <i>
                  {el.name.firstName[0]}. {el.name.familyName}
                </i>
              </div>
            </strong>
          ) : (
            <strong>
              <div>{el.sailorID}</div>
              <div>
                {el.name.firstName[0]}. {el.name.familyName}
              </div>
            </strong>
          )}

          {moveToggle === false ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleSailorMove(el.sailorID, el.time, el.day)}
            >
              Edit
            </Button>
          ) : el.sailorID === sailorToMove ? (
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgb(194, 60, 75)', color: 'white' }}
              onClick={() => handleRemoveSailor()}
            >
              Delete Sailor
            </Button>
          ) : (
            <Button variant="contained" disabled>
              Edit
            </Button>
          )}
        </div>
      ));
  };

  const deleteSheet = (e) => {
    //eslint-disable-next-line
    let result = confirm(
      'Are you certain you want to delete this event signup?'
    );
    if (result === true) {
      let currentTime = new Date();
      if (
        currentSignup.inspectionReqs.length > 0 &&
        currentTime < currentSignup.endDate
      ) {
        //eslint-disable-next-line
        let result2 = confirm(
          'There are sailors currently signup up for this event, and the end Date for the event has not been reached. Are you CERTAIN you want to delete this sheet?'
        );
        if (result2 === true) {
          removeSignupByEventNum(ilcaNum);
          setTimeout(redirToAdmin, 500);
          e.preventDefault();
        }
      } else {
        removeSignupByEventNum(ilcaNum);
        setTimeout(redirToAdmin, 500);
        e.preventDefault();
      }
    }
  };

  const redirToAdmin = () => {
    window.location.href = '/';
  };

  const handleDateChange = (date) => {
    if (date !== null) {
      setShutoffDate(new Date(moment(date).format('M/D/YYYY')));
      setCommitChangeButton(true);
    }
  };

  const handleSubmitDateChange = (shutoff) => {
    shutoff.setHours(23);
    shutoff.setMinutes(59);
    commitTimeChangeInDB(shutoff, ilcaNum);
    setTimeout(reloadPage, 500);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {eventDetails.logo ? (
        <div>
          <div className="event-header">
            <img
              src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
              alt="ILCA Logo"
              style={{ width: 200 }}
            />
            <i>
              <h3 style={{ fontSize: 30, textAlign: 'center' }}>
                {eventDetails.title}
              </h3>
            </i>
            <h3>{`${eventDetails.country}, ${eventDetails.city}`}</h3>
            <strong style={{ marginBottom: 20 }}>
              {moment(eventDetails.startDate.date).format(
                'dddd, MMMM Do, YYYY'
              )}{' '}
              —{' '}
              {moment(eventDetails.endDate.date).format('dddd, MMMM Do, YYYY')}
            </strong>
            <img
              src={eventDetails.logo}
              alt="Event Logo"
              style={{ width: 200 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              style={{
                margin: 'auto',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 30,
              }}
              to="/"
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: 'rgb(2, 114, 186)',
                  color: 'white',
                }}
              >
                Return to Admin Home Page
              </Button>
            </Link>
            <Link
              to={`/signup/${currentSignup.uuid}`}
              style={{ marginBottom: 20 }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: 'rgba(230,95,39,255)',
                  color: 'ivory',
                }}
              >
                Public Link for Event Signup Sheet
              </Button>
            </Link>
            <CSVLink
              className="link"
              data={sailorsRemainingUnsigned}
              headers={csvHeadersUnregistered}
              filename={`remaining_sailors_for_event_${ilcaNum}.csv`}
            >
              <Button variant="contained" color="primary">
                Download CSV of Sailors Not Registered For Inspection
              </Button>
            </CSVLink>
            <CSVLink
              className="link"
              data={sailorsSignedUp}
              // headers={csvHeadersRegistered}
              filename={`sailor_inspection_list_for_event_${ilcaNum}.csv`}
            >
              <Button variant="contained" color="primary">
                Download CSV of Sailors Registered For Inspection
              </Button>
            </CSVLink>
            <div className="admin-date-picker">
              <strong style={{ marginBottom: 6 }}>
                Signup Sheet Closing Date
              </strong>
              <DatePicker
                value={shutoffDate}
                onChange={(value) => handleDateChange(value)}
              ></DatePicker>
              <div style={{ textAlign: 'center', marginTop: 5 }}>
                <strong>At 23:59 US Central Time</strong>
              </div>
              {commitChangeButton ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: 'rgb(2, 114, 186)',
                    color: 'white',
                    marginTop: 10,
                  }}
                  onClick={() => handleSubmitDateChange(shutoffDate)}
                >
                  Confirm New Closing Date
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled
                  style={{ marginTop: 10 }}
                  onClick={() => handleSubmitDateChange(shutoffDate)}
                >
                  Confirm New Closing Date
                </Button>
              )}
            </div>
          </div>
          <br />
          <div>
            {dates.length > 0
              ? dates.map((date, index) => (
                  <Day
                    key={index}
                    date={date}
                    slotsByDay={slotsByDay}
                    getRegistered={getRegistered}
                    moveToggle={moveToggle}
                    toggledTime={toggledTime}
                    toggledDate={toggledDate}
                    unToggle={unToggleSailorMove}
                    sailorToMove={sailorToMove}
                    moveSailorInDB={moveSailorInDB}
                  />
                ))
              : ''}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {(Date.now() < Date.parse(currentSignup.endDate) && Date.now() > Date.parse(currentSignup.startDate)) && (currentSignup.inspectionReqs.length > 0) ? (
              <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
                <Button
                  style={{
                    maxWidth: 300,
                    margin: 'auto !important',
                  }}
                  variant="contained"
                  disabled
                >
                  Sheet Deletion Disabled
                </Button>
                <strong style={{marginBottom: 30, marginTop: 15}}>Unable to delete sheets while event is ongoing and sailors are registered for inspection times</strong>
              </div>
            ) : (
              <Button
                style={{
                  backgroundColor: 'rgb(194, 60, 75, 1)',
                  color: 'ivory',
                  maxWidth: 300,
                  margin: 'auto !important',
                  marginBottom: 30,
                }}
                variant="contained"
                onClick={(e) => deleteSheet(e)}
              >
                Delete This Signup Sheet
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ margin: 'auto', marginTop: '25%', fontSize: 40 }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default ViewEvent;

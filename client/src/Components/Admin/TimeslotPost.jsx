import React from 'react';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { Link } from 'react-router-dom';
import SlotPicker from 'slotpicker';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import AdjustEntries from '../Timeslot/AdjustEntries.jsx';
import { postCreatedTimeslotToDB } from '../../javascript/timeslotLogic';
import { v4 as uuidv4 } from 'uuid';
import '../../App.css';
import 'rc-time-picker/assets/index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TimeslotPost = () => {
  const [interval, setInterval] = useState(30); // The time interval between signup time options
  const [selectedDates, setSelectedDates] = useState([]); // An array representing the dates during which the event will take place
  const [entryLimit, setEntryLimit] = useState(0); // The initial entry limit for all time options, though each time option can later be individually adjusted
  const [eventTitle, setEventTitle] = useState(''); // The title for the event
  const [ilcaNum, setILCANum] = useState(''); // The number designation for the particular event, which will be used in the future for an API call requesting event information
  const [UUID, setUUID] = useState(''); // The UUID that will be created, then used for searching the DB for the correct inspection signup
  const [slotsAvailableByDay, setSlotsAvailableByDay] = useState({}); // This is the object that will represent all the information for each day, including unavailable slots and number of signups left per time option
  const [timeFrom, setTimeFrom] = useState(510); // The start time for each day of inspection signup
  const [startValue, setStartValue] = useState(moment('2021-01-01 08:30')); // The initial time for the starting time selector
  const [timeTo, setTimeTo] = useState(870); // The end time for each day of inspection signup
  const [endValue, setEndValue] = useState(moment('2021-01-01 14:30')); // The initial time for the ending time selector
  const [calendar, setCalendar] = useState([
    // The calendar's state information
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    // Sets the list of days for the regatta and sets the "slotsAvailableByDay" state value
    let days = getDates(calendar[0].startDate, calendar[0].endDate);
    let formatted = days.map((date) => moment(date).format('YYYY-MM-DD'));
    setSelectedDates(formatted);
    setDateObj(formatted);
    //eslint-disable-next-line
  }, [calendar]);

  useEffect(() => {
    // If the entry limit is adjusted, this will update each slot to reflect the new limit unless that slot is in that day's set of unavailable slots
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    for (let el in replacementObj) {
      replacementObj[el].entriesLeft = replacementObj[el].entriesLeft.map(
        (element, index) =>
          replacementObj[el].unavailableSlots.indexOf(
            replacementObj[el].entriesLeft[index][0]
          ) === -1
            ? [element[0], entryLimit]
            : [element[0], 0]
      );
    }
    setSlotsAvailableByDay(replacementObj);
    //eslint-disable-next-line
  }, [entryLimit]);

  useEffect(() => {
    // Adjusts the format of the "Start Time" input value so that it is in milliseconds, the format needed for the SlotPicker component
    const start = moment(startValue._d.toString()).format('HH:mm');
    const parsedStart = start.split(':').map((el) => parseInt(el));
    const startTimeSum = parsedStart[0] * 60 + parsedStart[1];
    setTimeFrom(startTimeSum); // For instance... ('08:30') would be transformed to 510
  }, [startValue]);

  useEffect(() => {
    // Adjusts the format of the "End Time" input value so that it is in milliseconds, the format needed for the SlotPicker component
    const end = moment(endValue._d.toString()).format('HH:mm');
    const parsedEnd = end.split(':').map((el) => parseInt(el));
    const endTimeSum = parsedEnd[0] * 60 + parsedEnd[1];
    setTimeTo(endTimeSum);
  }, [endValue]);

  const handleTimeslotPost = () => {
    // Handles Timeslot DB Submission. Currently not active. Needs some changes based on other intracomponent adjustments

    let uuid = uuidv4(); // creates unique ID for the DB entry
    let inspectionReqs = [];
    setUUID(uuid);
    if (entryLimit === 0 || eventTitle === '') {
      alert('Please fill out all fields');
    } else {
      console.log(
        slotsAvailableByDay,
        inspectionReqs,
        interval,
        selectedDates,
        eventTitle,
        ilcaNum,
        timeFrom,
        timeTo,
        uuid
      );
      postCreatedTimeslotToDB(
        // Creates a POST request, adding a new inspection signup entry to the DB
        slotsAvailableByDay,
        inspectionReqs,
        interval,
        selectedDates,
        eventTitle,
        ilcaNum,
        timeFrom,
        timeTo,
        uuid
      );
    }
  };
  //eslint-disable-next-line
  Date.prototype.addDays = function (days) {
    // Function added from outside source that adds a method to Date. Probably not best practice.
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  };

  const getDates = (startDate, stopDate) => {
    // Returns an Array of dates between two dates (inclusive)
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };

  const handleNumberInput = (e) => {
    // Sets limits on what can be entered into the entry limit text field
    let val = e.target.value;
    const regexp = /^[0-9\b]+$/; //
    if (regexp.test(val) || val === '') {
      // If the value only includes numbers or has a string value of ''
      setEntryLimit(parseInt(val));
    }
    console.log(slotsAvailableByDay);
  };

  const setDateObj = (days) => {
    // Creates the slotsAvailableByDay object from the days array (days between start and end)
    let slotsObj = {};
    let dailyArr = [];
    for (let i = timeFrom; i <= timeTo - interval; i += interval) {
      // this creates an array of the form [[time, entryLimit], ...] from the start time to the end time
      dailyArr.push([i, entryLimit]);
    }
    for (let element of days) {
      // add key value pairs of entriesLeft and unavailableSlots
      slotsObj[element] = {};
      slotsObj[element].entriesLeft = dailyArr;
      slotsObj[element].unavailableSlots = [];
    }
    setSlotsAvailableByDay(slotsObj);
  };

  const handleSetUnavailable = (el, slot) => {
    // Controls the effects of setting a slot unavailable by clicking on the slot;
    // console.log(el);
    let replacementObj = Object.assign({}, slotsAvailableByDay); // new placeholder object matching slotsAvailableByDay
    replacementObj[el].unavailableSlots = [
      // adds the selected slot to that day's unavailable slots array
      ...replacementObj[el].unavailableSlots,
      slot,
    ];
    console.log(replacementObj, replacementObj[el]);
    replacementObj[el].entriesLeft = replacementObj[el].entriesLeft.map(
      (item, index) => {
        if (replacementObj[el].unavailableSlots.indexOf(item[0]) > -1) {
          return [item[0], 0];
        } else return item;
      }
    );

    setSlotsAvailableByDay(replacementObj);
  };

  const resetUnavailable = (el) => {
    // Resets the unavailable slots for the selected day
    console.log(el);
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    replacementObj[el].unavailableSlots = [];
    setSlotsAvailableByDay(replacementObj);
  };

  return (
    <>
      <header className="post-header">
        <img
          className="ilca-logo"
          src="http://www.laserinternational.org/wp-content/uploads/2020/03/ILCA-logo-and-full-name-blue-and-grey.jpg"
          alt="ILCA Logo"
        />
        <div className="post-title"><i>ILCA</i> Inspection Signup Creator</div>
      </header>
      <div className="timeslot-post">
        <Link style={{fontSize: 20, marginBottom: 20}} className="link" to="/admin">
          Back to admin
        </Link>
        
        <div className="timeslot-options-container">
          <DateRange
            className="calendar"
            editableDateInputs={true}
            onChange={(item) => setCalendar([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={calendar}
            value={calendar}
          />
          <div className="timeslot-details-group">
            <div className="timeslot-option-flex">
              <TextField
                className="event-detail-form"
                id="filled"
                variant="filled"
                label="Event Title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <TextField
                className="event-detail-form"
                id="filled"
                variant="filled"
                label="ILCA Event #"
                type="text"
                value={ilcaNum}
                onChange={(e) => setILCANum(e.target.value)}
              />
              <FormControl className="event-detail-form" variant="filled">
                <InputLabel id="demo-simple-select-filled-label">
                  Timeslot Interval
                </InputLabel>
                <Select
                  id="demo-simple-select-filled"
                  value={interval}
                  onChange={(e) => {
                    setInterval(e.target.value);
                  }}
                >
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={45}>45</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                </Select>
              </FormControl>
              <TextField
                className="event-detail-form"
                id="filled-number"
                variant="filled"
                label="Timeslot Entry Limit"
                type="number"
                value={entryLimit}
                onChange={(e) => handleNumberInput(e)}
              />
            </div>
          </div>
          <div className="start-end-times">
            <div className="start-end-group-container">
              <div className="start-end-group">
                <div className="label">Start Time</div>
                <TimePicker
                  showSecond={false}
                  allowEmpty={false}
                  minuteStep={15}
                  value={startValue}
                  onChange={(value) => setStartValue(moment(value._d))}
                />
              </div>
              <div className="start-end-group">
                <div className="label">End Time</div>
                <TimePicker
                  showSecond={false}
                  allowEmpty={false}
                  minuteStep={15}
                  value={endValue}
                  onChange={(value) => setEndValue(moment(value._d))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="timeslot">
          <h3>Click individual slots below to make them unavailable</h3>
          {/* <hr style={{ height: 2, backgroundColor: 'grey', border: 'none' }} /> */}
          {Object.keys(slotsAvailableByDay).map((el, index) => (
            <div key={index} className="admin-slot-container">
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <strong>{moment(el).format('D MMMM YYYY')}</strong>
              </div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: 'rgb(46, 134, 175)',
                  marginBottom: 20,
                  color: 'white',
                }}
                onClick={() => {
                  resetUnavailable(el);
                }}
              >
                Reset Unavailable Slots
              </Button>
              <div style={{ marginBottom: 8 }}>
                <AdjustEntries
                  setSlotsAvailableByDay={setSlotsAvailableByDay}
                  slotsAvailableByDay={slotsAvailableByDay}
                  element={el}
                />
              </div>
              <div style={{ marginBottom: 15 }}>
                <SlotPicker
                  interval={interval}
                  unavailableSlots={slotsAvailableByDay[el].unavailableSlots}
                  selected_date={new Date()}
                  from={timeFrom}
                  to={timeTo}
                  onSelectTime={(slot) => {
                    handleSetUnavailable(el, slot);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 20, marginTop: 40 }}
          onClick={() => handleTimeslotPost()}
        >
          Submit Timeslot Sheet
        </Button>
        {UUID !== '' ? (
          <div>
            <div style={{ fontSize: 18 }}>
              {/* The unique identifier for your created timesheet is: {UUID} */}
              The link to your newly created timesheet is{' '}
              <strong>localhost:3000/viewtimeslot/{UUID}</strong>
            </div>
            <br />
            <div style={{ marginBottom: 15, fontSize: 18 }}>
              Save this link somewhere to send to sailors. It will be their only
              way to access the signup you created.
            </div>
          </div>
        ) : (
          ''
        )}
        <hr
          style={{ border: '1px solid black', width: '100%', marginBottom: 40 }}
        />
      </div>
    </>
  );
};

export default TimeslotPost;

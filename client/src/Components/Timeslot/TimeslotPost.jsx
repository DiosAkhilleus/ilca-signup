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
import AdjustEntries from './AdjustEntries.jsx';
import { postCreatedTimeslotToDB } from '../../javascript/timeslotLogic';
import { v4 as uuidv4 } from 'uuid';
import 'rc-time-picker/assets/index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TimeslotPost = () => {
  const [interval, setInterval] = useState(30);
  const [selectedDates, setSelectedDates] = useState([]);
  const [entryLimit, setEntryLimit] = useState(0);
  const [eventTitle, setEventTitle] = useState('');
  const [ilcaNum, setILCANum] = useState('');
  const [UUID, setUUID] = useState('');
  const [slotsAvailableByDay, setSlotsAvailableByDay] = useState({});
  const [timeFrom, setTimeFrom] = useState(510);
  const [startValue, setStartValue] = useState(moment('2021-01-01 08:30'));
  const [timeTo, setTimeTo] = useState(870);
  const [endValue, setEndValue] = useState(moment('2021-01-01 14:30'));
  const [calendar, setCalendar] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  
  useEffect(() => { // Sets the list of days for the regatta and sets the "slotsAvailableByDay" state value
    let days = getDates(calendar[0].startDate, calendar[0].endDate);
    let formatted = days.map((date) => moment(date).format('YYYY-MM-DD'));
    setSelectedDates(formatted);
    setDateObj(formatted);
  //eslint-disable-next-line
  }, [calendar]);

  useEffect(() => { // If the entry limit is adjusted, this will update each slot to reflect the new limit unless that slot is in that day's set of unavailable slots
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

  useEffect(() => { // Adjusts the format of the "Start Time" input value so that it is in milliseconds, the format needed for the SlotPicker component 
    const start = moment(startValue._d.toString()).format('HH:mm');
    const parsedStart = start.split(':').map((el) => parseInt(el));
    const startTimeSum = parsedStart[0] * 60 + parsedStart[1]; 
    setTimeFrom(startTimeSum); // For instance... ('08:30') would be transformed to 510
  }, [startValue]);

  useEffect(() => { // Adjusts the format of the "End Time" input value so that it is in milliseconds, the format needed for the SlotPicker component
    const end = moment(endValue._d.toString()).format('HH:mm');
    const parsedEnd = end.split(':').map((el) => parseInt(el));
    const endTimeSum = parsedEnd[0] * 60 + parsedEnd[1];
    setTimeTo(endTimeSum);
  }, [endValue]);

  const handleTimeslotPost = () => { // Handles Timeslot DB Submission. Currently not active. Needs some changes based on other intracomponent adjustments
   
    let uuid = uuidv4(); // creates unique ID for the DB entry
    let inspectionReqs = [];
    setUUID(uuid);
    if (entryLimit === 0 || eventTitle === '') {
      alert('Please fill out all fields');
    } else {

      console.log(slotsAvailableByDay, inspectionReqs, interval, selectedDates, eventTitle, ilcaNum, timeFrom, timeTo, uuid);
      postCreatedTimeslotToDB(
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
    };
  };
  //eslint-disable-next-line
  Date.prototype.addDays = function (days) { // Function added from outside source that adds a method to Date. Probably not best practice.
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  };

  const getDates = (startDate, stopDate) => { // Returns an Array of dates between two dates (inclusive)
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };

  const handleNumberInput = (e) => { // Sets limits on what can be entered into the entry limit text field
    let val = e.target.value;
    const regexp = /^[0-9\b]+$/; // 
    if (regexp.test(val) || val === '') { // If the value only includes numbers or has a string value of ''
      setEntryLimit(parseInt(val));
    }
    console.log(slotsAvailableByDay);
  };

  const setDateObj = (days) => { // Creates the slotsAvailableByDay object from the days array (days between start and end)
    let slotsObj = {};
    let dailyArr = [];
    for (let i = timeFrom; i <= timeTo - interval; i += interval) { // this creates an array of the form [[time, entryLimit], ...] from the start time to the end time 
        dailyArr.push([i, entryLimit]);
    }
    for (let element of days) { // add key value pairs of entriesLeft and unavailableSlots
      slotsObj[element] = {};
      slotsObj[element].entriesLeft = dailyArr;
      slotsObj[element].unavailableSlots = [];
    }
    setSlotsAvailableByDay(slotsObj);
  };

  const handleSetUnavailable = (el, slot) => { // Controls the effects of setting a slot unavailable by clicking on the slot;
    // console.log(el);
    let replacementObj = Object.assign({}, slotsAvailableByDay); // new placeholder object matching slotsAvailableByDay
    replacementObj[el].unavailableSlots = [ // adds the selected slot to that day's unavailable slots array
      ...replacementObj[el].unavailableSlots,
      slot,
    ];
    console.log(replacementObj, replacementObj[el]);
    replacementObj[el].entriesLeft = replacementObj[el].entriesLeft.map((item, index) => {
      if (replacementObj[el].unavailableSlots.indexOf(item[0]) > -1) {
        return [item[0], 0]
      } else return item;
    })
    
    setSlotsAvailableByDay(replacementObj);
  };
  
  const resetUnavailable = (el) => {
    console.log(el);
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    replacementObj[el].unavailableSlots = [];
    setSlotsAvailableByDay(replacementObj);
  }

  return (
    <div className="timeslot-post">
      <h1>Timeslot Creator</h1>
      <Link to="/" style={{ marginBottom: 30 }}>
        Back to home
      </Link>
      <div className="timeslot-options-container">
        <DateRange
          style={{ fontSize: 18 }}
          editableDateInputs={true}
          onChange={(item) => setCalendar([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={calendar}
          value={calendar}
        />
        <div className="timeslot-option-group">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            <TextField
              style={{ minWidth: 250, marginBottom: 20 }}
              id="filled"
              variant="filled"
              label="Event Title"
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <TextField
              style={{ minWidth: 250, marginBottom: 20 }}
              id="filled"
              variant="filled"
              label="ILCA Event #"
              type="text"
              value={ilcaNum}
              onChange={(e) => setILCANum(e.target.value)}
            />
            <FormControl
              variant="filled"
              style={{ margin: 0, marginBottom: 20, minWidth: 250 }}
            >
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
              style={{ minWidth: 250, marginBottom: 20 }}
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
          <div>
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
        {Object.keys(slotsAvailableByDay).map((el, index) => (
          <div key={index} className="admin-slot-container">
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <strong>{moment(el).format('D MMMM YYYY')}</strong>
            </div>
            <button
              onClick={() => {resetUnavailable(el)}}
              style={{marginBottom: 20}}
            >
              Reset Unavailable Slots For This Day
            </button>
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
            The link to your newly created timesheet is <strong>localhost:3000/viewtimeslot/{UUID}</strong>
          </div>
          <br />
          <div style={{ marginBottom: 15, fontSize: 18 }}>
            Save this link somewhere to send to sailors. It will be their only way
            to access the signup you created.
          </div>
        </div>
      ) : (
        ''
      )}
      <hr
        style={{ border: '1px solid black', width: '100%', marginBottom: 40 }}
      />
    </div>
  );
};

export default TimeslotPost;

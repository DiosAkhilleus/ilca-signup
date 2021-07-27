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
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [entryLimit, setEntryLimit] = useState(0);
  const [eventTitle, setEventTitle] = useState('');
  const [UUID, setUUID] = useState('');
  const [entriesAvailable, setEntriesAvailable] = useState([]);
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
  useEffect(() => {
    let days = getDates(calendar[0].startDate, calendar[0].endDate);
    let formatted = days.map((date) => moment(date).format('YYYY-MM-DD'));
    setSelectedDates(formatted);
    setDateObj(formatted);
  }, [calendar]);

  useEffect(() => {
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
  }, [entryLimit]);

  useEffect(() => {
    const start = moment(startValue._d.toString()).format('HH:mm');
    const parsedStart = start.split(':').map((el) => parseInt(el));
    const startTimeSum = parsedStart[0] * 60 + parsedStart[1];
    setTimeFrom(startTimeSum);
  }, [startValue]);

  useEffect(() => {
    const end = moment(endValue._d.toString()).format('HH:mm');
    const parsedEnd = end.split(':').map((el) => parseInt(el));
    const endTimeSum = parsedEnd[0] * 60 + parsedEnd[1];
    setTimeTo(endTimeSum);
  }, [endValue]);

  const handleTimeslotPost = () => {
    let selectedDates = getDates(calendar[0].startDate, calendar[0].endDate);
    selectedDates = selectedDates.map((date) =>
      moment(date).format('YYYY-MM-DD')
    );
    let uuid = uuidv4();

    setUUID(uuid);
    if (entryLimit === 0 || eventTitle === '') {
      alert('Please fill out all fields');
    } else {
      console.log(slotsAvailableByDay);
      // postCreatedTimeslotToDB(
      //   slotsAvailableByDay,
      //   interval,
      //   entryLimit,
      //   selectedDates,
      //   eventTitle,
      //   timeFrom,
      //   timeTo,
      //   uuid
      // );
    }
  };
  //eslint-disable-next-line
  Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  };

  const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };
  const handleNumberInput = (e) => {
    let val = e.target.value;
    const regexp = /^[\s0-9\b]+$/;
    if (regexp.test(val) || val === '') {
      setEntryLimit(parseInt(val));
    }
  };

  const setDateObj = (days) => {
    let slotsObj = {};
    let dailyArr = [];
    for (let i = timeFrom; i <= timeTo - interval; i += interval) {
      if (unavailableSlots.filter((time) => time === i).length > 0) {
        dailyArr.push([i, 0]);
      } else {
        dailyArr.push([i, entryLimit]);
      }
    }
    for (let element of days) {
      slotsObj[element] = {};
      slotsObj[element].entriesLeft = dailyArr;
      slotsObj[element].unavailableSlots = unavailableSlots;
    }
    setSlotsAvailableByDay(slotsObj);
  };

  const handleSetUnavailable = (el, slot) => {
    let replacementObj = Object.assign({}, slotsAvailableByDay);
    replacementObj[el].unavailableSlots = [
      ...replacementObj[el].unavailableSlots,
      slot,
    ];
    console.log(replacementObj[el]);
    for (let slot of replacementObj[el].entriesLeft) {
      if (replacementObj[el].unavailableSlots.indexOf(slot[0]) > -1) {
        slot[1] = 0;
      }
    }
    setSlotsAvailableByDay(replacementObj);
  };

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
        <button
          onClick={() => {
            setUnavailableSlots([]);
          }}
        >
          Reset Unavailable Slots
        </button>
        <h3>Click individual slots below to make them unavailable</h3>
        {Object.keys(slotsAvailableByDay).map((el, index) => (
          <div key={index} className="admin-slot-container">
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <strong>{moment(el).format('D MMMM YYYY')}</strong>
            </div>
            <div style={{ marginBottom: 8 }}>
              <AdjustEntries
                setSlotsAvailableByDay={setSlotsAvailableByDay}
                slotsAvailableByDay={slotsAvailableByDay}
                element={el}
                index={index}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <SlotPicker
                key={[el, index]}
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
            The unique identifier for your created timesheet is: {UUID}
          </div>
          <br />
          <div style={{ marginBottom: 15, fontSize: 18 }}>
            Save this id somewhere to send to sailors. It will be their only way
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

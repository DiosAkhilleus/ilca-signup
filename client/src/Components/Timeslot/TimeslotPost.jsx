import React from 'react';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import SlotPicker from 'slotpicker';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { postCreatedTimeslotToDB } from '../../javascript/timeslotLogic';
import { v4 as uuidv4 } from 'uuid';
import 'rc-time-picker/assets/index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TimeslotPost = () => {
  const [interval, setInterval] = useState(30);
  const [unavailable, setUnavailable] = useState([]);
  const [entryLimit, setEntryLimit] = useState('');
  const [UUID, setUUID] = useState('');
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
    const selectedDates = getDates(calendar[0].startDate, calendar[0].endDate);
    let uuid = uuidv4();
    setUUID(uuid);
    postCreatedTimeslotToDB(unavailable, interval, selectedDates, timeFrom, timeTo, uuid);
  }
  //eslint-disable-next-line
  Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf())
      dat.setDate(dat.getDate() + days);
      return dat;
  }

  const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate)
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  }
  const handleNumberInput = (e) => {
    let val = e.target.value;
    const regexp = /^[0-9\b]+$/;
    if (regexp.test(val)) {
      setEntryLimit(val);
      console.log(val);
    }
  }

  return (
    <div className="timeslot-post">
      <DateRange
        style={{ fontSize: 18 }}
        editableDateInputs={true}
        onChange={(item) => setCalendar([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={calendar}
        value={calendar}
      />
      <div className="start-end-times">
        <div className="start-end-labels">
          <div className="label">Start Time</div>
          <div className="label">End Time</div>
        </div>
        <TimePicker
          showSecond={false}
          allowEmpty={false}
          minuteStep={15}
          value={startValue}
          onChange={(value) => setStartValue(moment(value._d))}
        />
        <TimePicker
          showSecond={false}
          allowEmpty={false}
          minuteStep={15}
          value={endValue}
          onChange={(value) => setEndValue(moment(value._d))}
        />
      </div>
      <FormControl variant="filled" style={{ margin: 10, minWidth: 250 }}>
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
        style={{minWidth: 250}}
        id="filled-number" 
        variant="filled"
        label="Timeslot Entry Limit"
        type="number"
        value={entryLimit}
        onChange={(e) => handleNumberInput(e)}
      />
      <div className="timeslot">
        <button
          onClick={() => {
            setUnavailable([]);
          }}
        >
          Reset Unavailable Slots
        </button>
        <h3>Click individual slots below to make them unavailable</h3>
        <SlotPicker
          interval={interval}
          unavailableSlots={unavailable}
          selected_date={new Date()}
          from={timeFrom}
          to={timeTo}
          onSelectTime={(slot) => {
            setUnavailable([...unavailable, slot]);
          }}
        />
      </div>
      <button style={{ marginBottom: 20 }} onClick={() => handleTimeslotPost()}>
        Submit
      </button>
      {UUID !== '' ? <h3>The unique identifier for your created timesheet is {UUID}</h3> : ''}
    </div>
  );
};

export default TimeslotPost;

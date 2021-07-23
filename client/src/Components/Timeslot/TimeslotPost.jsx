import React from 'react';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import SlotPicker from 'slotpicker';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TimeslotPost = () => {
  const [interval, setInterval] = useState(30);
  const [unavailable, setUnavailable] = useState([]);
  const [timeFrom, setTimeFrom] = useState(8 * 60);
  const [startValue, setStartValue] = useState(moment("2021-01-01 08:30"));
  const [timeTo, setTimeTo] = useState(14 * 60);
  const [endValue, setEndValue] = useState(moment("2021-01-01 14:30"));
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  useEffect(() => {
    const start = moment(startValue._d.toString()).format("HH:mm");
    const parsedStart = start.split(':').map((el) => parseInt(el));
    const startTimeSum = parsedStart[0]*60 + parsedStart[1];
    setTimeFrom(startTimeSum);
  }, [startValue])

  useEffect(() => {
    const end = moment(endValue._d.toString()).format("HH:mm")
    const parsedEnd = end.split(':').map((el) => parseInt(el))
    const endTimeSum = parsedEnd[0]*60 + parsedEnd[1];
    setTimeTo(endTimeSum);
  }, [endValue])

  return (
    <div className="timeslot-post">
      <DateRange
        style={{ fontSize: 18 }}
        editableDateInputs={true}
        onChange={(item) => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
      <div className='start-end-times'>
        <div className='start-end-labels'>
          <div className='label'>Start Time</div>
          <div className='label'>End Time</div>
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
      <div className="timeslot">
        <button
          onClick={() => {
            setUnavailable([]);
          }}
        >
          Reset Unavailable Slots
        </button>
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
      <button style={{marginBottom: 20}} onClick={() => console.log(state)}>Submit</button>
    </div>
  );
};

export default TimeslotPost;

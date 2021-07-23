import React from 'react';
import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TimeslotPost = () => {

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  return (
    <div className='timeslot-post'>
        <DateRange 
          style={{fontSize: 18}}
          editableDateInputs={true}
          onChange={item => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
        <input type="number" placeholder="Timeslot Interval"/>
        <input type="text" placeholder="Unavailable Timeslots" />
        <button  onClick={() => console.log(state)}>Submit</button>
    </div>
  )
}

export default TimeslotPost;

import React from 'react'
import SlotPicker from 'slotpicker';
import { Link } from 'react-router-dom';
import '../App.css';

const Timeslot = () => {

  return (
    <div className='timeslot-container'>
      <h1>Time Slot Selector</h1>
      <Link to='/'>Back to Home</Link>
      <div className='timeslot'>
        <SlotPicker
          interval={30}
          unavailableSlots={[570]}
          selected_date={new Date()}
          from={8*60}
          to={12*60}
          onSelectTime={(selectedSlot) => {console.log(selectedSlot)}}
        />
      </div>
    </div>
  )
}

export default Timeslot

import React from 'react'
import { useState, useEffect } from 'react';
import SlotPicker from 'slotpicker';
import { Link } from 'react-router-dom';
import '../App.css';

const Timeslot = () => {

  const [selectedSlot, setSelectedSlot] = useState(0);

  return (
    <div className='timeslot-container'>
      <h1>Time Slot Selector</h1>
      <Link to='/'>Back to Home</Link>
      <div className='timeslot'>
        <SlotPicker
          interval={30}
          unavailableSlots={[720, 750]}
          selected_date={new Date()}
          from={8*60}
          to={16*60}
          onSelectTime={(slot) => {setSelectedSlot(slot)}}
        />
      </div>
      <form className='signup-form'>
          <input type="text" placeholder='Sailor ID' required />
          <input type="text" placeholder='First Name' required />
          <input type="text" placeholder='Last Name' required />
          <button>Submit Inspection Request</button>
        </form>
    </div>
  )
}

export default Timeslot

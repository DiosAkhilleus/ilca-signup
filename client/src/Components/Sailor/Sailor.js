import React from 'react'
import '../../App.css';

const Sailor = ({ sailorID, firstName, familyName, sailNumber, rig, dateEntered, country, index}) => {
  return (
    <div className='sailor'>
      <strong>Sailor #{index+1}</strong>
      <br/>
      <i>Sailor ID:</i> {sailorID}
      <br/>
      <i>Name:</i> {firstName} {familyName}
      <br/>
      <i>Sail Number:</i> {sailNumber}
      <br/>
      <i>Rig:</i> {rig}
      <br/>
      <i>Date Entered:</i> {dateEntered}
      <br/>
      <i>Country:</i> {country}
    </div>
  )
}

export default Sailor

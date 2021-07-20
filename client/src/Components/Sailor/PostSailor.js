import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import postSailorToDB from '../../javascript/sailor';
import Axios from 'axios';
import '../../App.css';

const PostSailor = () => {
  const [id, setID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [sailNumber, setSailNumber] = useState('');
  const [rig, setRig] = useState('');
  const [dateEntered, setDateEntered] = useState('');
  const [country, setCountry] = useState('');

  const resetFields = () => {
    setID('');
    setFirstName('');
    setFamilyName('');
    setSailNumber('');
    setRig('');
    setDateEntered('');
    setCountry('');
  }

  const submitSailor = (e) => {
    
    postSailorToDB(id, firstName, familyName, sailNumber, rig, dateEntered, country);
    e.preventDefault();
    resetFields();
  };

  return (
    <div className="home-page">
      <h1>New Sailor</h1>
      <Link to='/'>Back to Home</Link>
      <Link to='/displaysailors'>See registered sailors</Link>
      <form
        className="sailor-form"
        onSubmit={() => {
          return false;
        }}
      >
        <input
          required={true}
          type="text"
          placeholder="Sailor ID"
          value={id}
          onChange={(e) => {
            setID(e.target.value);
          }}
        />
        <input
          required={true}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <input
          required={true}
          type="text"
          placeholder="Family Name"
          value={familyName}
          onChange={(e) => {
            setFamilyName(e.target.value);
          }}
        />
        <input
          required={true}
          type="text"
          placeholder="Sail Number"
          value={sailNumber}
          onChange={(e) => {
            setSailNumber(e.target.value);
          }}
        />
        <input
          required={true}
          type="text"
          placeholder="Rig"
          value={rig}
          onChange={(e) => {
            setRig(e.target.value);
          }}
        />
        <input
          required={true}
          type="date"
          placeholder="Date Entered"
          value={dateEntered}
          onChange={(e) => {
            setDateEntered(e.target.value);
          }}
        />
        <input
          required={true}
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            submitSailor(e);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostSailor;

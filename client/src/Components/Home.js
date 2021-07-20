import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import '../App.css';

const Home = () => {
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
    Axios.post('http://localhost:3001/insertsailor', {
      sailorID: id,
      name: {
        firstName: firstName,
        familyName: familyName,
      },
      sailNumber: sailNumber,
      rig: rig,
      dateEntered: dateEntered,
      country: country,
    }).then(console.log('sailor posted'));
    e.preventDefault();
    resetFields();
  };

  return (
    <div className="home-page">
      <h1>Home Page</h1>
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

export default Home;

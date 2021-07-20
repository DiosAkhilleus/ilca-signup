import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postSailorToDB, getSailors } from '../../javascript/sailorLogic';
import '../../App.css';

const PostSailor = () => {
  const [id, setID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [sailNumber, setSailNumber] = useState('');
  const [rig, setRig] = useState('');
  const [dateEntered, setDateEntered] = useState('');
  const [country, setCountry] = useState('');
  const [currentEntries, setCurrentEntries] = useState([]);

  useEffect(() => {
    getSailors().then((results) => {
      setCurrentEntries(results);
    });
  }, []);

  const resetFields = () => {
    setID('');
    setFirstName('');
    setFamilyName('');
    setSailNumber('');
    setRig('');
    setDateEntered('');
    setCountry('');
  };

  const submitSailor = (e) => {
    if (
      id          === '' ||
      firstName   === '' ||
      familyName  === '' ||
      sailNumber  === '' ||
      rig         === '' ||
      dateEntered === '' ||
      country     === ''
    ) {
      alert('Please fill in all fields');
    } else {
      const filteredEntries = currentEntries.filter(
      (entry) => entry.sailorID === id
    );
      if (filteredEntries.length > 0) {
        alert(`Sailor matching ID: ${id} already entered`);
      } else {
        postSailorToDB(
          id,
          firstName,
          familyName,
          sailNumber,
          rig,
          dateEntered,
          country
        );
        resetFields();
      }
    }
    e.preventDefault();
  };

  return (
    <div className="home-page">
      <h1>New Sailor</h1>
      <Link to="/">Back to Home</Link>
      <Link to="/displaysailors">See registered sailors</Link>
      <form
        className="sailor-form"
        onSubmit={() => {
          return false;
        }}
      >
        <input
          required
          type="text"
          placeholder="Sailor ID"
          value={id}
          onChange={(e) => {
            setID(e.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Family Name"
          value={familyName}
          onChange={(e) => {
            setFamilyName(e.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Sail Number"
          value={sailNumber}
          onChange={(e) => {
            setSailNumber(e.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Rig"
          value={rig}
          onChange={(e) => {
            setRig(e.target.value);
          }}
        />
        <input
          required
          type="date"
          placeholder="Date Entered"
          value={dateEntered}
          onChange={(e) => {
            setDateEntered(e.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
        />
        <button
          type="submit"
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

import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  

  return (
    <div className="home-page">
      <h1>Home Page</h1>
      <Link to='/timeslots'>Time Slot Selector</Link>
      <Link to='/posttimeslot'>Post Time Slot</Link>
      <Link to='/postsailor'>New Sailor Form</Link>
      <Link to='/displaysailors'>Show all entered sailors</Link> 
    </div>
  );
};

export default Home;

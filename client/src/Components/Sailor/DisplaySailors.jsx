import React from 'react';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sailor from './Sailor';
import '../../App.css';

const DisplaySailors = () => {
  const [sailorList, setSailorList] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/sailorinfo').then((response) => {
      setSailorList(response.data);
    });
  }, []);

  return (
    <div className="sailor-display">
      <Link to='/' style={{marginTop: '10px'}}>Back to Home</Link>
      {sailorList.map((el, index) => {
        return (
          <Sailor
            sailorID={el.sailorID}
            firstName={el.name.firstName}
            familyName={el.name.familyName}
            sailNumber={el.sailNumber}
            rig={el.rig}
            dateEntered={el.dateEntered}
            country={el.country}
            key={index}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default DisplaySailors;
// return <div key={index}>
//         {el.sailorID}
//         {el.name.firstName}
//         {el.name.familyName}
//         {el.sailNumber}
//         {el.rig}
//         {el.dateEntered}
//         {el.country}
//         </div>;

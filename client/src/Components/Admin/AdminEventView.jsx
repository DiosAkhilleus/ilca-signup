import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSignupByEventNum } from '../../javascript/adminLogic';

const ViewEvent = () => {
  const { ilcaNum } = useParams();
  const [currentSignup, setCurrentSignup] = useState({});

  useEffect(() => {
    getSignupByEventNum(ilcaNum).then((results) =>
      setCurrentSignup(results[0])
    );
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <Link to="/admin">Back to Admin</Link>
      <div>
        <h3>Currently Signed Up Sailors</h3>
        {currentSignup.inspectionReqs &&
        currentSignup.inspectionReqs.length > 0 ? (
          currentSignup.inspectionReqs.map((el, index) => (
            <div key={index}>{el.sailorID}</div>
          ))
        ) : (
          <div>No Sailors Currently Signup Up</div>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;

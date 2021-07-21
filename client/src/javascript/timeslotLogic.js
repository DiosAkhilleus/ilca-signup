import Axios from 'axios';

export const postTimeslotReqToDB = (sailorID, firstName, familyName, time, day) => {
  Axios.post('http://localhost:3001/reqtimeslot', {
    sailorID: sailorID, 
    name: {
      firstName: firstName,
      familyName: familyName
    }, 
    time: time, 
    day: day
  }).then(alert(`Inspection successfully requested for "${firstName} ${familyName}" with ID: "${sailorID}"`));
}

export const getCurrentlyScheduledInspections = () => {
  const retrieve = Axios.get('http://localhost:3001/timeslots/filled').then((response) => {
    return response.data;
  });
  return retrieve;
}
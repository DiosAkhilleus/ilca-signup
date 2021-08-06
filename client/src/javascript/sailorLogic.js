import Axios from 'axios';

export const postSailorToDB = (
  sailorID,
  firstName,
  familyName,
  sailNumber,
  rig,
  dateEntered,
  country
) => {
  // Adds a sailor to the DB
  Axios.post('http://localhost:3001/insertsailor', {
    sailorID: sailorID,
    name: {
      firstName: firstName,
      familyName: familyName,
    },
    sailNumber: sailNumber,
    rig: rig,
    dateEntered: dateEntered,
    country: country,
  }).then(alert('Sailor Posted'));
};

export const getSailors = (ilcaNum) => {
  // Retrieves the list of currentl registered sailors. This will probably be replaced with a different API call once that gets set up
  console.log(ilcaNum);
  const res = Axios.get('http://localhost:3001/sailorinfo').then((response) => {
    return response.data;
  });
  return res;
};

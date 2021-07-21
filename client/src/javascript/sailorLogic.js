import Axios from 'axios';

export const postSailorToDB = (sailorID, firstName, familyName, sailNumber, rig, dateEntered, country) => {
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

export const getSailors = () => {
  const retrieve = Axios.get('http://localhost:3001/sailorinfo').then((response) => {
    return response.data;
  })
  return retrieve;
}

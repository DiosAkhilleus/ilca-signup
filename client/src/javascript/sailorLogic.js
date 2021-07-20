import Axios from 'axios';

export const postSailorToDB = (id, firstName, familyName, sailNumber, rig, dateEntered, country) => {
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
    }).then(console.log('sailor posted'))
};

export const getSailors = () => {
  const retrieve = Axios.get('http://localhost:3001/sailorinfo').then((response) => {
    return response.data;
  })
  return retrieve;
}

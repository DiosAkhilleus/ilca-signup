import Axios from 'axios';

const postSailorToDB = (id, firstName, familyName, sailNumber, rig, dateEntered, country) => {
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

export default postSailorToDB;
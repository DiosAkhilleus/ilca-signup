import axios from 'axios';

const postSailor = () => {
  axios
    .post('http://localhost:3001/insertsailor', {
      sailorID: 'AUTAM6',
      name: {
        firstName: 'Anton',
        familyName: 'Messeritsch',
      },
      sailNumber: 'AUT212844',
      rig: '4.7',
      dateEntered: '18 Jun 2021',
      country: 'Austria',
    })
    .then(console.log('sailor posted'));
};

export default postSailor;
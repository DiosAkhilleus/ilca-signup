import Axios from 'axios';

export const getSignupByEventNum = (ilcaNum) => {
  const res = Axios.get('http://localhost:3001/timeslots/options').then(
    (response) => {
      return response.data.filter(signup => signup.ilcaNum === ilcaNum);
    }
  );
  // const filtered = res.filter((element) => element.ilcaNum === ilcaNum)
  return res;
}
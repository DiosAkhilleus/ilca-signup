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

export const postCreatedTimeslotToDB = (unavailableSlots, interval, selectedDates, timeFrom, timeTo, uuid) => {
  console.log({
    unavailableSlots: unavailableSlots, 
    interval: interval,
    selectedDates: selectedDates,
    timeFrom: timeFrom,
    timeTo: timeTo ,
    uuid: uuid
  })
  Axios.post('http://localhost:3001/timeslots/created/', {
    unavailableSlots: unavailableSlots, 
    interval: interval,
    selectedDates: selectedDates,
    timeFrom: timeFrom,
    timeTo: timeTo,
    uuid: uuid
  }).then(alert(`Timeslot Posted. Your unique identifier for your created timeslot is ${uuid}`));
}
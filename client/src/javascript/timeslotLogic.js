import Axios from 'axios';

export const postTimeslotReqToDB = (eventTitle, sailorID, firstName, familyName, time, day) => {
  Axios.post('http://localhost:3001/reqtimeslot', {
    eventTitle: eventTitle,
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
  const res = Axios.get('http://localhost:3001/timeslots/filled').then((response) => {
    return response.data;
  });
  return res;
}

export const postCreatedTimeslotToDB = (slotsAvailableByDay, unavailableSlots, interval, entryLimit, selectedDates, eventTitle, timeFrom, timeTo, uuid) => {
  Axios.post('http://localhost:3001/timeslots/created/', {
    slotsAvailableByDay: slotsAvailableByDay,
    unavailableSlots: unavailableSlots, 
    interval: interval,
    entryLimit: entryLimit,
    selectedDates: selectedDates,
    eventTitle: eventTitle,
    timeFrom: timeFrom,
    timeTo: timeTo,
    uuid: uuid
  }).then(alert(`Timeslot Posted. Your unique identifier for your created timeslot is ${uuid}`));
}

export const getTimeslotByUUID = (UUID) => {
  const res = Axios.get('http://localhost:3001/timeslots/options').then((response) => {
    return response.data;
  })
  return res;
}

export const updateTimeslotByUUID = (UUID, day, time, slotsAvailableByDay, unavailableSlots) => {
  let correctDaySlots = slotsAvailableByDay[day];
  let index;
  for (let i = 0; i < slotsAvailableByDay[day].length; i++) {
    if (correctDaySlots[i][0] === time) {
      index = i;
    }
    
  }
  correctDaySlots[index][1] = slotsAvailableByDay[day][index][1] - 1;
  if (correctDaySlots[index][1] === 0) {
    unavailableSlots.push(correctDaySlots[index][0]);
    // console.log(unavailable)
  }
  slotsAvailableByDay[day] = correctDaySlots;

  Axios.put(`http://localhost:3001/timeslots/update/${UUID}`, {
    slotsAvailableByDay: slotsAvailableByDay, 
    unavailableSlots: unavailableSlots
  });
}
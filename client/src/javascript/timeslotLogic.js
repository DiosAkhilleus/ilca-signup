import Axios from 'axios';

export const postTimeslotReqToDB = (
  eventTitle,
  sailorID,
  firstName,
  familyName,
  time,
  day
) => {
  // Posts a timeslot request to the DB with all relevant information. May need to be updated in the future.
  Axios.post('http://localhost:3001/reqtimeslot', {
    eventTitle: eventTitle,
    sailorID: sailorID,
    name: {
      firstName: firstName,
      familyName: familyName,
    },
    time: time,
    day: day,
  }).then(
    alert(
      `Inspection successfully requested for "${firstName} ${familyName}" with ID: "${sailorID}"`
    )
  );
};

export const getCurrentlyScheduledInspections = (UUID) => {
  // Retrieves the full list of registered inspections
  let currentReqs = getTimeslots().then(
    (results) => {
      return results.filter((element) => element.uuid === UUID)
    }
  );
  return currentReqs;
};

export const postCreatedTimeslotToDB = (
  // Posts a newly created timeslot to the DB. Will need to be updated soon.
  slotsAvailableByDay,
  inspectionReqs,
  interval,
  selectedDates,
  eventTitle,
  ilcaNum,
  timeFrom,
  timeTo,
  uuid
) => {
  //slotsAvailableByDay, interval, selectedDates, eventTitle, timeFrom, timeTo, uuid
  Axios.post('http://localhost:3001/timeslots/created/', {
    slotsAvailableByDay: slotsAvailableByDay,
    inspectionReqs: inspectionReqs,
    interval: interval,
    selectedDates: selectedDates,
    eventTitle: eventTitle,
    ilcaNum: ilcaNum,
    timeFrom: timeFrom,
    timeTo: timeTo,
    uuid: uuid,
  }).then(
    alert(
      `Timeslot Posted. Your unique identifier for your created timeslot is ${uuid}`
    )
  );
};

export const getTimeslots = () => {
  // Retrieves all currently created timeslots
  const res = Axios.get('http://localhost:3001/timeslots/options').then(
    (response) => {
      return response.data;
    }
  );
  return res;
};

export const updateTimeslotByUUID = async (
  UUID,
  day,
  time,
  slotsAvailableByDay,
  inspectionReq
) => {
  // Sends a PUT request to update a timeslot's information based on a new inspection request
  let correctDaySlots = slotsAvailableByDay[day].entriesLeft;
  let index;
  for (let i = 0; i < slotsAvailableByDay[day].entriesLeft.length; i++) {
    if (correctDaySlots[i][0] === time) {
      index = i;
    }
  }
  correctDaySlots[index][1] -= 1;
  console.log(correctDaySlots, index);

  if (correctDaySlots[index][1] === 0) {
    slotsAvailableByDay[day].unavailableSlots.push(correctDaySlots[index][0]);
    // console.log(unavailable)
  }
  slotsAvailableByDay[day].entriesLeft = correctDaySlots;
  getTimeslots().then(
    (results) =>
      results.filter((element) => element.uuid === UUID)[0].inspectionReqs
  ).then((currentReqs) => {
      Axios.put(`http://localhost:3001/timeslots/update/${UUID}`, {
      slotsAvailableByDay: slotsAvailableByDay,
      inspectionReqs: [...currentReqs, inspectionReq]
    });
  });
};

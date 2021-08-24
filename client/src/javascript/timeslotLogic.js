import Axios from 'axios';

export const getCurrentlyScheduledInspections = (UUID) => {
  // Retrieves the full list of registered inspections
  let currentReqs = getTimeslots().then((results) => {
    let filteredResults = results.filter((element) => element.uuid === UUID);
    return filteredResults[0].inspectionReqs;
  });
  return currentReqs;
};

export const postCreatedTimeslotToDB = (
  // Posts a newly created inspection signup to the DB
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
  Axios.post('http://localhost:3001/signups/created/', {
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
      `Timeslot Posted. The link to the timeslot can be found in the admin page for the Event: ${eventTitle}`
    )
  );
};

export const getTimeslots = () => {
  // Retrieves all currently created timeslots
  const res = Axios.get('http://localhost:3001/signups/options').then(
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

  if (correctDaySlots[index][1] === 0) {
    slotsAvailableByDay[day].unavailableSlots.push(correctDaySlots[index][0]);
  }
  slotsAvailableByDay[day].entriesLeft = correctDaySlots;
  getTimeslots()
    .then(
      (results) =>
        results.filter((element) => element.uuid === UUID)[0].inspectionReqs
    )
    .then((currentReqs) => {
      Axios.put(`http://localhost:3001/signups/update/${UUID}`, {
        slotsAvailableByDay: slotsAvailableByDay,
        inspectionReqs: [...currentReqs, inspectionReq],
      });
    });
};

export const fetchEventDetails = (ilcaNum) => {
  const res = Axios.get(`http://localhost:3001/events/details/${ilcaNum}`).then(
    (response) => {
      return response.data;
    }
  );
  return res;
};

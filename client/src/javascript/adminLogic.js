import Axios from 'axios';

export const getSignupByEventNum = (ilcaNum) => {
  const res = Axios.get('http://localhost:3001/timeslots/options').then(
    (response) => {
      return response.data.filter((signup) => signup.ilcaNum === ilcaNum);
    }
  );
  return res;
};

export const updateSailorInspection = (
  // Updates the DB by changing a sailor's inspection time and date to the newly modified ones, as well as updating the slots remaining for the 'from' time as well as the 'to' time
  sailorID,
  timeFrom,
  timeTo,
  day,
  registered,
  ilcaNum,
  slotsByDay,
  slotsIndex
) => {
  let nonMatchingArr = registered.filter(
    (inspec) => inspec.sailorID !== sailorID
  );
  let matchingObj = registered.filter(
    (inspec) => inspec.sailorID === sailorID
  )[0];
  let replacementInspecObj = Object.assign(matchingObj, {
    time: timeTo,
    day: day,
  });
  let inspectionReqs = [...nonMatchingArr, replacementInspecObj];
  let replacementEntriesLeft = slotsByDay[day].entriesLeft.map(
    (element, index) =>
      index === slotsIndex
        ? [element[0], element[1] - 1]
        : element[0] === timeFrom
        ? [element[0], element[1] + 1]
        : element
  );

  let replacementSlotsObj = Object.assign(slotsByDay, {});
  replacementSlotsObj[day].entriesLeft = replacementEntriesLeft;

  Axios.put(`http://localhost:3001/timeslots/updateinspecs/${ilcaNum}`, {
    inspectionReqs: inspectionReqs,
    slotsAvailableByDay: replacementSlotsObj,
  });
};

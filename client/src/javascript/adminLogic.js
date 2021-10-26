import Axios from 'axios';

export const getSignupByEventNum = (ilcaNum) => {
  const res = Axios.get('https://ilca-inspection-server.herokuapp.com/signups/options').then(
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

  Axios.put(`https://ilca-inspection-server.herokuapp.com/signups/updateinspecs/${ilcaNum}`, {
    inspectionReqs: inspectionReqs,
    slotsAvailableByDay: replacementSlotsObj,
  });
};

export const removeSignupByEventNum = (ilcaNum) => {
  Axios.delete(`https://ilca-inspection-server.herokuapp.com/signups/delete/${ilcaNum}`);
};

export const removeSailorFromEvent = (ilcaNum, sailorID) => {
  getSignupByEventNum(ilcaNum).then(results => {
    const signup = results[0];
    const inspectionToDelete = signup.inspectionReqs.filter(el => el.sailorID === sailorID)[0];
    const toDeleteDay = inspectionToDelete.day;
    const toDeleteTime = inspectionToDelete.time;
    for (let i = 0; i < signup.slotsAvailableByDay[toDeleteDay].entriesLeft.length; i++) {
      let currentSlot = signup.slotsAvailableByDay[toDeleteDay].entriesLeft[i];
      if (currentSlot[0] === toDeleteTime) {
        currentSlot[1] ++;
      }
    }
      
    const newInspectionReqs = signup.inspectionReqs.filter(el => el.sailorID !== sailorID);
    Axios.put(`https://ilca-inspection-server.herokuapp.com/signups/removesailor/${sailorID}/${ilcaNum}`, {
      inspectionReqs: newInspectionReqs, 
      slotsAvailableByDay: signup.slotsAvailableByDay,
    });
  })
}

export const commitTimeChangeInDB = (newShutoffDate, ilcaNum) => {
  Axios.put(`https://ilca-inspection-server.herokuapp.com/signups/updateshutoff/${ilcaNum}`, {
    shutoffDate: newShutoffDate
  });
}
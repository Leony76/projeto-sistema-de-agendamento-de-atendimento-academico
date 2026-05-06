import type { Reports } from "@shared/types/reports.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { STUDENTS } from "../../data/students.mock";
import { ROOMS } from "../../data/rooms.mock";
import { MANAGERS } from "../../data/managers.mock";

const systemReports = (): Reports => {

  const appointments: Reports['appointments'] = (() => {
    let done = 0;
    let canceled = 0;

    for (const appointment of APPOINTMENTS_DATA) {
      if (appointment.status === 'CANCELED') canceled++;
      if (appointment.status === 'DONE') done++;
    }

    return {
      count: APPOINTMENTS_DATA.length,
      canceled,
      done,
    }
  })();


  const solicitations: Reports['solicitations'] = (() => {
    let accepted = 0;
    let rejected = 0;

    for (const solicitation of SOLICITATIONS_DATA) {
      if (solicitation.status === 'ACCEPTED') accepted++;
      if (solicitation.status === 'REJECTED') rejected++;
    }

    return {
      count: SOLICITATIONS_DATA.length,
      accepted,
      rejected,
    }
  })();

  const rooms: Reports['rooms'] = (() => {
    let reserved = 0;
    let available = 0;
    let unavailable = 0;

    for (const room of ROOMS) {
      if (room.status === 'RESERVED')    reserved++;
      if (room.status === 'AVAILABLE')   available++;
      if (room.status === 'UNAVAILABLE') unavailable++;
    }
    
    return {
      count: ROOMS.length,
      reserved,
      available,
      unavailable,
    };
  })();

  const registered: Reports['registered'] = {
    users      : MANAGERS.length + PROFESSORS.length + STUDENTS.length,
    managers   : MANAGERS.length,
    professors : PROFESSORS.length,
    students   : STUDENTS.length, 
  };

  const rate: Reports['rate'] = (() => {
    let withdraws = 0;
    let attendances = 0;
    let cancelations = 0;
    let acceptances = 0;
    let rejections  = 0;

    for (const appointment of APPOINTMENTS_DATA) {
      if (appointment.status === 'NO_SHOW') withdraws++;
      if (appointment.status === 'DONE') attendances++;
      if (appointment.status === 'CANCELED') cancelations++;
    };

    for (const solicitation of SOLICITATIONS_DATA) {
      if (solicitation.status === 'ACCEPTED') acceptances++;
      if (solicitation.status === 'REJECTED') rejections++;
    };

    return {
      appointments: {
        attendance   : APPOINTMENTS_DATA.length !== 0 ? attendances / APPOINTMENTS_DATA.length : 0,
        withdrawal   : APPOINTMENTS_DATA.length !== 0 ? withdraws / APPOINTMENTS_DATA.length : 0,
        cancellation : APPOINTMENTS_DATA.length !== 0 ? cancelations / APPOINTMENTS_DATA.length : 0,
      },
      solicitations: {
        acceptance : SOLICITATIONS_DATA.length !== 0 ? acceptances / SOLICITATIONS_DATA.length : 0,
        rejection  : SOLICITATIONS_DATA.length !== 0 ? rejections / SOLICITATIONS_DATA.length : 0,
      }
    }
  })();

  const reportsData: Reports = {
    solicitations,
    appointments,
    registered,
    rooms,
    rate,
  };
  
  return reportsData;
};

export const SYSTEM_REPORTS = systemReports();
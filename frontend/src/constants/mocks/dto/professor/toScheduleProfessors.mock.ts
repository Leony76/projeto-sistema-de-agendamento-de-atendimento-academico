import { type ToScheduleProfessors } from '@shared/types/toScheduleProfessors.type';
import { PROFESSORS } from '../../data/professors.mock';
import { PROFESSOR_AVAILABILITY } from '../../data/professorAvailability.mock';
import { DISCIPLINES } from '../../data/disciplines.mock';
import { generateTimeSlots } from '@frontend/utils/misc/generateTimeSlots.util';
import { APPOINTMENTS_DATA } from '../../data/appointments.mock';
import { SOLICITATIONS_DATA } from '../../data/solicitations.mock';
import { DAYS_BY_INDEX_MAP } from '@frontend/constants/maps/days.map';

type GenerateHourSlotsParams = {
  professorId: number;
  date: string;
};

type AvailableHourSlots = {
  professorId: number;
  date: string;
  slots: string[];
};

const sameDay = (a: string, b: string) => {
  const d1 = new Date(a);
  const d2 = new Date(b);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const extractHour = (date: string) => {
  const d = new Date(date);

  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');

  return `${h}:${m}`;
};

export const getAvailableSlots = ({
  professorId,
  date,
}: GenerateHourSlotsParams): AvailableHourSlots => {

  const dayIndex = new Date(date).getDay();

  const availability = PROFESSOR_AVAILABILITY.filter(
    a =>
      a.professorId === professorId &&
      DAYS_BY_INDEX_MAP[a.dayOfWeek] === dayIndex
  );

  const slots = availability.flatMap(a =>
    generateTimeSlots(a.startHour, a.endHour, 30)
  );

  const occupied = [
    ...APPOINTMENTS_DATA.map(a => ({
      professorId: a.professorId,
      dateTime: a.dateTime,
    })),
    ...SOLICITATIONS_DATA
      .filter(s => s.status !== 'CANCELED')
      .map(s => ({
        professorId: s.professorId,
        dateTime: s.appoitmentDateTime,
      }))
  ];

  const occupiedHours = occupied
    .filter(item => item.professorId === professorId)
    .filter(item => sameDay(item.dateTime, date))
    .map(item => extractHour(item.dateTime))
  ;

  const freeSlots = slots.filter(slot => !occupiedHours.includes(slot));

  return {
    professorId,
    date,
    slots: freeSlots,
  };
};

export const TO_SCHEDULE_PROFESSORS: ToScheduleProfessors[] = PROFESSORS.map((professor) => {

  const availability = PROFESSOR_AVAILABILITY.filter(
      (a) => a.professorId === professor.id
    )
  ;

  const disciplines = DISCIPLINES
    .filter((d) => d.professorId === professor.id)
    .map((d) => d.name)
  ;

  return {  
    id           : professor.id,
    email        : professor.email,
    name         : professor.name,
    photo        : professor.photo,
    registeredAt : professor.registeredAt,
    availability,
    disciplines,
  };
});      
  
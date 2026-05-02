import type { ProfessorAvailability } from "@shared/types/professorAvailability.type";
import { PROFESSOR_AVAILABILITY as AVAILABILITY } from "../../data/professorAvailability.mock"
import { LOGGED_USER_DATA } from "../../loggedUserData.mock"

const professorId = LOGGED_USER_DATA.id;

export const PROFESSOR_AVAILABILITY:ProfessorAvailability[] = AVAILABILITY
  .filter((availability) => {
    return availability.professorId === professorId;
  }
)

import { DISCIPLINES } from "./data/disciplines.mock";
import { USERS } from "./data/users.mock";
import { type LoggedUserData } from '@shared/types/loggedUserData.type'

const LOGGED_USER_ID = 4;

export const LOGGED_USER_DATA: LoggedUserData = (() => {

  const user = USERS.find(user => user.id === LOGGED_USER_ID)!;

  if (user.role === 'PROFESSOR') {
    const disciplines = DISCIPLINES.filter((discipline) => discipline.professorId === user.id);

    return {
      ...user,
      disciplines,
    }
  }

  return user;
})();
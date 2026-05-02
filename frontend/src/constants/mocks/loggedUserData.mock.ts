import { USERS } from "./data/users.mock";
import { type LoggedUserData } from '@shared/types/loggedUserData.type'

const LOGGED_USER_ID = 1;

export const LOGGED_USER_DATA: LoggedUserData = USERS.find(user => user.id === LOGGED_USER_ID)!;
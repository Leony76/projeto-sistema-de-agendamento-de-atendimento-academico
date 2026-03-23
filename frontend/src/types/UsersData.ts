import { UsersListPromise } from "./promises/usersListPromisse";

export type UsersData<T> = UsersListPromise<T> & {
  currentPaginationCount : number;
}
export type UsersListPromise<T> = {
  list       : T[];
  totalCount : number;
  paginationTotalCount : number ;
};
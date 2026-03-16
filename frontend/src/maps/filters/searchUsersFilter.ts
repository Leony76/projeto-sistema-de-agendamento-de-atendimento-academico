import { SearchProfessorsFilterValue } from "./searchProfessorsFilter";
import { SearchStudentsFilterValue } from "./searchStudentsFilter";

export type SearchUsersFilterValue = SearchStudentsFilterValue | SearchProfessorsFilterValue;
import { searchStudentsFilter } from "../filters/searchStudentsFilter";
import { searchProfessorsFilter } from "../filters/searchProfessorsFilter";
import { professorsDisciplineOptions } from "./professorsDisciplinesOptions";

export const SELECT_SCHEMA_MAP = {
  SEARCH_STUDENTS_FILTER: searchStudentsFilter,
  SEARCH_PROFESSORS_FILTER: searchProfessorsFilter,
  PROFESSORS_DISCIPLINES_OPTIONS: professorsDisciplineOptions,
};
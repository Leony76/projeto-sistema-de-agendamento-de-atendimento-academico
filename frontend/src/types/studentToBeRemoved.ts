import { StudentToBeEdited } from "./studentToBeEdited";

export type StudentToBeRemoved = Pick<StudentToBeEdited, 'name' | 'ra'>;
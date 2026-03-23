import { StudentToBeEdited } from "./studentToBeEdited";

export type StudentToBeRemoved = Omit<StudentToBeEdited, 'email'>;
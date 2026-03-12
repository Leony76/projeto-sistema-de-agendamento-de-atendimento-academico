import { StudentListRegisteredTodayDTO } from "../dtos/studentsListRegisteredTodayDTO";

export type RegisteredTodayStudentsListPromise = {
  studentsRegisteredTodayList: StudentListRegisteredTodayDTO[],
  totalStudentsRegisteredTodayCount: number,
  totalStudentsRegisteredTodayPages: number,
}
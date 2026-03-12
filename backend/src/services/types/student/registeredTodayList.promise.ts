import { StudentListDTO } from "../../../../@types/dto/studentListDTO";

export type RegisteredTodayListPromise = {
  studentsRegisteredTodayList: StudentListDTO[];
  totalStudentsRegisteredTodayCount: number;
  totalStudentsRegisteredTodayPages: number;
}
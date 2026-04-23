import type { Solicitation } from "@/types/solicitation.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";

export const filterStudentSolicitations = (
  studentSolicitationsData : Solicitation[],
  searchValue              : string,
  filterValue              : string,
): Solicitation[] => {
  return studentSolicitationsData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.name.toLowerCase().includes(search) 
      ||
      solicitation.discipline.toLowerCase().includes(search)
      ||
      formatTime(solicitation.appoitmentDateTime).toLowerCase().includes(search)
      ||
      formatDate(solicitation.appoitmentDateTime).toLowerCase().includes(search)

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'confirmed':
        return matchesSearch && solicitation.status === 'CONFIRMED';

      case 'unconfirmed':
        return matchesSearch && solicitation.status === 'UNCONFIRMED';

      case 'canceled':
        return matchesSearch && solicitation.status === 'CANCELED';

      default:
        return matchesSearch;
    }
  })
  .sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'AZProfessorName':
        return a.name.localeCompare(b.name);

      case 'ZAProfessorName':
        return b.name.localeCompare(a.name);

      case 'AZDisciplines':
        return b.discipline.localeCompare(a.discipline);
        
      case 'ZADisciplines':
        return a.discipline.localeCompare(b.discipline);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}
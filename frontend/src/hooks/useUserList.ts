// import { useState, useEffect } from "react";
// import { useToast } from "../contexts/ToastContext";
// import { StudentListDTO } from "../types/dtos/studentListDTO";
// import { StudentToBeEdited } from "../types/studentToBeEdited";
// import { StudentToBeRemoved } from "../types/studentToBeRemoved";
// import { useLoadingState } from "./useLoadingState";
// import { SystemRoles } from "../types/systemRoles";
// import { UserListRegisteredTodayDTO } from "../types/dtos/usersListRegisteredTodayDTO";
// import { UserListDTO } from "../types/dtos/usersListDTO";
// import { SearchUsersFilterValue } from "../maps/filters/searchUsersFilter";
// import { UsersPageModal } from "../types/modals/usersPage.modal";
// import { StudentService } from "../services/student.service";
// import { ProfessorService } from "../services/professor.service";

// type Props = {
//   userRole: 'STUDENT';
//   Service: typeof StudentService;
// } | {
//   userRole: 'PROFESSOR';
//   Service: typeof ProfessorService;
// };

// export const useUserList = ({
//   userRole,
//   Service,
// }:Props) => {

//   const { showToast } = useToast();
//   const [pageLoading, setPageloading] = useState<boolean>(true); 
//   const { loading, setLoading } = useLoadingState();

//   // Users LIST
//   const [users, setUsers] = useState<UserListDTO[]>([]);
//   const [usersListCount, setUsersListCount] = useState<number>(0);
//   const [currentUsersListPage, setCurrentUsersListPage] = useState<number>(1);
//   const [totalUsersListPages, setTotalUsersListPages] = useState<number>(1);

//   // Users REGISTERED TODAY LIST
//   const [usersRegisteredToday, setUsersRegisteredToday] = useState<UserListRegisteredTodayDTO[]>([]);
//   const [registeredTodayUsersCount, setRegisteredTodayUsersCount] = useState<number>(0);
//   const [currentUsersRegisteredTodayListPage, setCurrentUsersRegisteredTodayListPage] = useState<number>(1);
//   const [totalUsersRegisteredTodayListPages, setTotalUsersRegisteredTodayListPages] = useState<number>(1);

//   const [userToBeEdited, setUserToBeEdited] = useState<StudentToBeEdited | null>(null);
//   const [userToBeRemoved, setUserToBeRemoved] = useState<StudentToBeRemoved | null>(null);

//   const [search, setSearch] = useState<string>('');
//   const [filter, setFilter] = useState<SearchUsersFilterValue>('unselected');

//   const [userForm, showUserForm] = useState<"REGISTER" | "EDIT" | null>(null);
//   const [activeModal, setActiveModal]  = useState<UsersPageModal | null>(null);

//   const fetchAllData = async():Promise<void> => {
//     setPageloading(true);

//     try {
//       const [
//         usersResponse,
//         usersRegisteredInTheDayResponse,
//       ] = await Promise.all([
//         Service.list(currentUsersListPage, search, filter),
//         Service.registeredInTheDayList(currentUsersRegisteredTodayListPage),
//       ]);
      
//       setUsers(usersResponse.usersList);
//       setTotalUsersListPages(usersResponse.totalPages);
//       setUsersListCount(usersResponse.total);

//       setUsersRegisteredToday(usersRegisteredInTheDayResponse.usersRegisteredTodayList);
//       setTotalUsersRegisteredTodayListPages(usersRegisteredInTheDayResponse.totalUsersRegisteredTodayPages);
//       setRegisteredTodayUsersCount(usersRegisteredInTheDayResponse.totalUsersRegisteredTodayCount);
//     } catch (error: any) {
//       showToast(error.response?.data?.error || 'Erro ao carregar listagem', 'ERROR');
//     } finally {
//       setPageloading(false); 
//     }
//   };

//   const handleRemoveUser = async(ra:string):Promise<void> => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const response = await Service.remove(ra);
//       fetchAllData();
//       showToast(response, 'SUCCESS');
//     } catch (error:any) {
//       showToast(error.response?.data?.error || 'Houve um erro ao remover o usuário!', 'ERROR');
//     } finally {
//       setLoading(false);
//       setActiveModal(null);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   } , [
//     currentUsersListPage, 
//     currentUsersRegisteredTodayListPage, 
//     filter, 
//     search,
//   ]);

//   useEffect(() => {
//     setCurrentUsersListPage(1);
//   }, [filter, search]); 

//   return {
//     states: { 
//       users, usersListCount, currentUsersListPage, totalUsersListPages,
//       usersRegisteredToday, search, filter, pageLoading, loading, 
//       userForm, activeModal, userToBeEdited, userToBeRemoved
//     },
//     actions: { 
//       setSearch, setFilter, setCurrentUsersListPage, 
//       setCurrentUsersRegisteredTodayListPage, showUserForm, 
//       setActiveModal, setUserToBeEdited, setUserToBeRemoved,
//       handleRemoveUser, fetchAllData 
//     }
//   }
// }
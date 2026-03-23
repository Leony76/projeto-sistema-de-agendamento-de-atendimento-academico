import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { UsersData } from "../types/UsersData";
import { useLoadingState } from "./useLoadingState";
import { SystemRoles } from "../types/systemRoles";
import { UsersListPromise } from "../types/promises/usersListPromisse";

type EntityService<T, R, E, RM, F, M> = {
  list: (page: number, search: string, filter: any) => Promise<UsersListPromise<T>>;
  registeredInTheDayList: (page: number) => Promise<UsersListPromise<R>>;
  remove: (id: string) => Promise<string>;
}

export const useUsersList = <T, R, E, RM, F, M>(
  service    : EntityService<T, R, E, RM, F, M>,
  entityRole : SystemRoles, 
) => {

  const USER_ROLE_TRANSLATED = {
    STUDENT   : 'estudantes',
    PROFESSOR : 'professores',
    MANAGER   : 'administradores',
  };

  const { showToast } = useToast();
  const [pageLoading, setPageloading] = useState<boolean>(true); 
  const { loading, setLoading } = useLoadingState();

  const [overall, setOverall] = useState<UsersData<T>>({
    list: [],
    totalCount: 0,
    currentPaginationCount: 1,
    paginationTotalCount: 1,
  });

  const [registeredInTheDay, setRegisteredInTheDay] = useState<UsersData<R>>({
    list: [],
    totalCount: 0,
    currentPaginationCount: 1,
    paginationTotalCount: 1,
  });

  const [entityToBeEdited, setEntityToBeEdited] = useState<E | null>(null);
  const [entityToBeRemoved, setEntityToBeRemoved] = useState<RM | null>(null);

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<F>('unselected' as any);

  const [entityForm, showEntityForm] = useState<"REGISTER" | "EDIT" | null>(null);
  const [activeModal, setActiveModal]  = useState<M | null>(null);

  const fetchAllData = async():Promise<void> => {
    setPageloading(true);

    try {
      const [
        overallResponse,
        registeredInTheDayResponse,
      ] = await Promise.all([
        service.list(overall.currentPaginationCount, search, filter),
        service.registeredInTheDayList(registeredInTheDay.currentPaginationCount),
      ]);
      
      setOverall(prev => ({
        ...prev,
        totalCount: overallResponse.totalCount,
        list: overallResponse.list,
        paginationTotalCount: overallResponse.paginationTotalCount,
      }));

      setRegisteredInTheDay(prev => ({
        ...prev,
        totalCount: registeredInTheDayResponse.totalCount,
        list: registeredInTheDayResponse.list,
        paginationTotalCount: registeredInTheDayResponse.paginationTotalCount
      }));
    } catch (error: any) {
      showToast(error.response?.data?.error || `Erro ao carregar listagem de ${USER_ROLE_TRANSLATED[entityRole]}`, 'ERROR');
    } finally {
      setPageloading(false); 
    }
  };

  const handleRemove = async(
    email : string,
  ):Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await service.remove(email);
      fetchAllData();
      showToast(response, 'SUCCESS');
    } catch (error:any) {
      showToast(error.response?.data?.error || `Houve um erro ao remover o ${USER_ROLE_TRANSLATED[entityRole]}!`, 'ERROR');
    } finally {
      setLoading(false);
      setActiveModal(null);
    }
  };

  useEffect(() => {
    fetchAllData();
  } , [
    overall.currentPaginationCount, 
    registeredInTheDay.currentPaginationCount, 
    filter, 
    search,
  ]);

  useEffect(() => {
    setOverall(prev => ({ ...prev, currentPaginationCount: 1 }));
  }, [filter, search]); 
  
  return {
    search             , setSearch,
    filter             , setFilter,
    overall            , setOverall,
    entityToBeRemoved  , setEntityToBeRemoved,
    registeredInTheDay , setRegisteredInTheDay,
    entityToBeEdited   , setEntityToBeEdited,
    activeModal        , setActiveModal,
    entityForm         , showEntityForm,
    loading,
    pageLoading, 
    handleRemove,
    fetchAllData,
  };
}
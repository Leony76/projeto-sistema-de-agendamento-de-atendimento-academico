import type { REGISTERED_MANAGERS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveManagersToManagerList } from "@shared/types/dtos/managerUsersList.dto";

export const filterRegisteredManagers = (
  registeredManagersData : ActiveManagersToManagerList[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'],
): ActiveManagersToManagerList[] => {
  
  return registeredManagersData.filter(( manager ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      manager.name.toLowerCase().includes(search) 
      ||
      manager.id.toString().includes(search)
      ||
      manager.registeredAt.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();

      case 'mostOld':
        return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();

      default:
        return 0;
    }
  });
}
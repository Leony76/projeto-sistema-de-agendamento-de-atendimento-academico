import type { REGISTERED_MANAGERS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveManagersToManagerList } from "@shared/types/dtos/managerUsersList.dto";
import { createFilter } from "./createFilter.util";
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";

export const filterRegisteredManagers = (
  registeredManagersData : ActiveManagersToManagerList[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'],
): ActiveManagersToManagerList[] => {

  return createFilter(
    registeredManagersData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (manager) => manager.email,
        (manager) => manager.id.toString(),
        (manager) => manager.name,
        (manager) => formatDate(manager.registeredAt),
        (manager) => formatTime(manager.registeredAt),
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime(),
      }
    },
  );
}
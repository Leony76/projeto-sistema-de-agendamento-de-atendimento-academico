import api from "../api";
import { UsersListPromise } from "../types/promises/usersListPromisse";
import { UsersRegisteredInTheDayListPromise } from "../types/promises/usersRegisteredInTheDayListPromise";
import { SystemRoles } from "../types/systemRoles";
import { USERS_ENDPOINTS_MAP } from "../maps/endpoints/usersEndpointsMap";
import { SYSTEM_ROLES } from "../maps/systemRolesMap";
import { REGISTER_PAYLOAD_MAP } from "../maps/payloads/registerPayloadMap";
import { REGISTER_SCHEMA_MAP } from "../maps/zodSchemas/registerSchemasMap";
import { SEARCH_FILTER_MAP } from "../maps/filters/searchFilterMap";

export class UsersService<T, U, V extends Extract<SystemRoles, "STUDENT" | "PROFESSOR">> {

  constructor(private readonly endpoint: SystemRoles) {};

  async list(
    page   : number,
    search : string,
    filter : SEARCH_FILTER_MAP[V],
  ):Promise<UsersListPromise<T>> {

    const URL:string = `/${USERS_ENDPOINTS_MAP[this.endpoint]}/list?page=${page}&search=${search}&filter=${filter}`;
    
    const response = await api.get<UsersListPromise<T>>(URL);

    return response.data;
  };

  async registeredInTheDayList(
    page : number,
  ):Promise<UsersRegisteredInTheDayListPromise<U>> {

    const URL:string = `/${USERS_ENDPOINTS_MAP[this.endpoint]}/registered-today-list?page=${page}&today=true`;

    const response = await api.get<UsersRegisteredInTheDayListPromise<U>>(URL);

    return response.data;
  };

  async remove(
    id : number,
  ):Promise<string> {

    const URL:string = `/${USERS_ENDPOINTS_MAP[this.endpoint]}/remove/${id}`;

    const response = await api.put(URL, id);

    return response.data.success;
  };

  async edit(
    data : REGISTER_SCHEMA_MAP[V],
    id   : number,
  ):Promise<string> {

    const URL:string = `/${USERS_ENDPOINTS_MAP[this.endpoint]}/update/${id}`;

    const response = await api.put(URL, data);

    return response.data.success;
  };

  async register(
    data : REGISTER_PAYLOAD_MAP[V]
  ):Promise<string> {

    const URL : string = `/auth/register/${SYSTEM_ROLES[this.endpoint]}`;

    const response = await api.post(URL, data);

    return response.data.success;
  };
};
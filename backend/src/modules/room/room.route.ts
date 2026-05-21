import { Router } from "express";
import { RoomController } from "./room.controller";
import { validate } from "@backend/utils/validator.util";
import { newRoomSchema } from "@backend/schemas/newRoom.schema";

const roomRoutes = Router();

roomRoutes.post('/add', validate(newRoomSchema), RoomController.addRoom);
roomRoutes.get('/get-all', RoomController.getAll);

export default roomRoutes;
import { z } from "zod";

export const newRoomSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome da sala deve ter 3 caracteres no mínimo')
    .max(255, 'O nome da sala deve ter até 255 caracteres'),
});

export type newRoomFormData = z.infer<typeof newRoomSchema>;
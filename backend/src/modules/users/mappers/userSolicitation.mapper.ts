import type { SolicitationStatus } from "@backend/generated/prisma/enums";

export type UserSolicitation = {
  id          : number;
  dateTime    : Date;
  status      : SolicitationStatus;
  appointment : {
    reason: string;
  } | null;
  entity : {
    user : {
      name: string;
      photo: string | null;
    };
  };
};

export const userSolicitationMapper = (
  solicitation: UserSolicitation
) => {

  return {
    id                 : solicitation.id,
    appoitmentDateTime : solicitation.dateTime.toISOString(),
    reason             : solicitation.appointment?.reason ?? '',
    status             : solicitation.status,
    user: {
      name  : solicitation.entity.user.name,
      photo : solicitation.entity.user.photo,
    },
  };
};

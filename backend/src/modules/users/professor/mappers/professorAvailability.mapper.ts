import type { AvailableDay } from "@backend/generated/prisma/enums";
import type { ProfessorAvailability } from "@backend/generated/prisma/client"; 

export const professorAvailabilityMapper = (
  availability: ProfessorAvailability[]
) => {

  const groupedAvailability = new Map<AvailableDay, {
    dayOfWeek : AvailableDay;
    shift: {
      MORNING: {
        start : string;
        end   : string;
      };
      AFTERNOON: {
        start : string;
        end   : string;
      };
    }}
  >();

  for (const item of availability) {
    if (!groupedAvailability.has(item.dayOfWeek)) {
      groupedAvailability.set(item.dayOfWeek, {
        dayOfWeek: item.dayOfWeek,
        shift: {
          MORNING: {
            start : '',
            end   : '',
          },
          AFTERNOON: {
            start : '',
            end   : '',
          },
        },
      });
    }

    const currentDay = groupedAvailability.get(item.dayOfWeek)!;

    currentDay.shift[item.shift] = {
      start : String(item.startTime),
      end   : String(item.endTime),
    };
  }

  return Array.from(groupedAvailability.values());
};
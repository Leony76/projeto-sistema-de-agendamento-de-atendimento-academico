import type { IconType } from "react-icons";

export const noContentFound = (
  noContentMessage   : string,
  filterLabel        : any,
  searchValue        : string,
  hasFilterCondition : boolean,
  icon: {
    notFound   : IconType,
    notContent : IconType,
  },
) => {

  const hasSearch = !!searchValue;
  const hasFilter = hasFilterCondition;

  const Icon = (hasSearch || hasFilter)
    ? icon.notFound
    : icon.notContent;

  let message = noContentMessage;

  if (hasSearch && hasFilter) {
    message = `Nenhum resultado para "${searchValue}" com o filtro "${filterLabel}"`;
  } else if (hasSearch) {
    message = `Nenhum resultado para "${searchValue}"`;
  } else if (hasFilter) {
    message = filterLabel === 'Nenhum'
      ? noContentMessage
      : `Nenhum resultado para o filtro "${filterLabel}"`;
  }

  return {
    message,
    Icon,
  };
};
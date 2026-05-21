export function makeDiscipline(
  overrides = {}
) {
  return {
    id: 1,
    name: 'Matemática',

    ...overrides,
  };
}

export function makeDisciplineNames() {
  return [
    { name: 'Matemática' },
    { name: 'Física' },
    { name: 'Química' },
  ];
}
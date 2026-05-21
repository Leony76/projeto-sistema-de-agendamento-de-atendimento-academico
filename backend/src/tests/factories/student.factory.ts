export function makeRegisteredStudent(overrides = {}) {
  return {
    id: 1,
    name: 'Leony',
    email: 'leony@gmail.com',
    password: 'hashed-password',
    createdAt: new Date(),
    photo: null,
    student: {
      ra: '123456',
    },

    ...overrides,
  };
}

export function makeStudentRegisterRequest(overrides = {}) {
  return {
    name: 'Leony',
    email: 'leony@gmail.com',
    password: '123456',
    ra: '123456',

    ...overrides,
  };
}
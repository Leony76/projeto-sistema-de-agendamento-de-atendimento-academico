export const defaultFieldsConfigPresets = {
  email: {
    invalid: { 
      message: 'E-mail inválido' 
    },
    max : {
      value: 255,
      message : 'O e-mail deve ter até 255 caracteres'
    },
  },

  password: {
    min : {
      value: 6,
      message : 'Senha muito curta'
    },
    max : {
      value: 50,
      message : 'A senha deve ter até 50 caracteres',
    },
  },
}
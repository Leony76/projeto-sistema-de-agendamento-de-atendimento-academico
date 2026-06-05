import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs        : 15 * 60 * 1000, 
  limit           : 1000,             
  standardHeaders : true,
  legacyHeaders   : false,
  message         : { message: 'Muitas requisições. Tente novamente mais tarde.' }
});



export const loginLimiter = rateLimit({
  windowMs  : 15 * 60 * 1000,
  limit     : 5,
  standardHeaders : true,
  legacyHeaders   : false,
  skipSuccessfulRequests: true,
  message   : {
    message : 'Muitas tentativas de login. Aguarde 15 minutos.'
  }
});



export const studentRegisterHimselfLimiter = rateLimit({
  windowMs  : 60 * 60 * 1000,
  limit     : 10,
    standardHeaders : true,
  legacyHeaders   : false,
  message   : {
    message : 'Muitos cadastros consecutivos. Aguarde 1 hora.'
  }
});



export const managerRegisterUsersLimiter = rateLimit({
  windowMs  : 15 * 60 * 1000,
  limit     : 100,
  standardHeaders : true,
  legacyHeaders   : false,
  message   : {
    message : 'Muitos cadastros consecutivos. Aguarde 15 minutos.'
  }
});



export const recoverPasswordLimiter = rateLimit({
  windowMs  : 60 * 60 * 1000,
  limit     : 3,
  standardHeaders : true,
  legacyHeaders   : false,
  message   : {
    message : 'Muitas requisições para recuperação de senha. Aguarde 1 hora.'
  }
});
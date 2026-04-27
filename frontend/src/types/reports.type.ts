export type Reports = {
  appointments : {
    count     : number;
    confirmed : number;
    canceled   : number;
  };
  solicitations : {
    count    : number;
    accepted : number;
    rejected : number;
  };
  rooms : {
    reserved  : number;
    available : number;
  };
  registered : {
    students   : number;
    professors : number;
    managers   : number;
  };
  rate: {
    appointments: {
      withdrawal : number;
      attendance : number;
    };
    solicitations: {
      acceptance : number;
      rejection  : number;
    };
  };
};
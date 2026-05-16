export type SystemReports = {
  appointments : {
    count   : number;
    done    : number;
    canceled : number;
  };
  solicitations : {
    count    : number;
    accepted : number;
    rejected : number;
  };
  rooms : {
    count       : number;
    reserved    : number;
    available   : number;
    unavailable : number;
  };
  registered : {
    users      : number;
    students   : number;
    professors : number;
    managers   : number;
  };
  rate: {
    appointments: {
      cancellation : number;
      withdrawal   : number;
      attendance   : number;
    };
    solicitations: {
      acceptance : number;
      rejection  : number;
    };
  };
};
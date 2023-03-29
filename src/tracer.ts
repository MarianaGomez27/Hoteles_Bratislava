import tracer from 'dd-trace';
tracer.init({
  logInjection: true,
}); // initialized in a different file to avoid hoisting.

tracer.use('http', {
  blocklist: ['/'],
});

interface reqWithUser {
  user: {
    id: string;
  };
}

tracer.use('express', {
  hooks: {
    request: (span, req) => {
      // Following lines are required to get around TS errors
      // Solution taken from here: https://github.com/DataDog/dd-trace-js/issues/1091#issuecomment-696715080
      const unknownReq = req as unknown;
      const typedReq = unknownReq as reqWithUser;
      span.setTag('userId', typedReq?.user?.id);
    },
  },
});

export default tracer;

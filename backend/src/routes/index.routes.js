// import webRouter from './web.routes.js';
import userRouter from './user.routes.js';

const Routers = (app) => {
   // app.use('/', webRouter);
   app.use('/api/user/', userRouter);
};

export default Routers;

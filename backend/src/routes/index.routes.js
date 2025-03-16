
import userRouter from './user.routes.js';
import bunessRouter from './buness.routes.js';
import authRouter from './auth.routes.js';

const Routers = (app) => {
   app.use('/api/user/', userRouter);
   app.use('/api/buness/', bunessRouter);
   app.use('/api/auth/', authRouter);

};

export default Routers;

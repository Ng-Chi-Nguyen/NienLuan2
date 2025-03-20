
import userRouter from './user.routes.js';
import bunessRouter from './buness.routes.js';
import authRouter from './auth.routes.js';
import foolbalFieldRouter from './foolbalField.routes.js';
import uploadRouter from './upload.routes.js';

const Routers = (app) => {
   app.use('/api/user/', userRouter);
   app.use('/api/business/', bunessRouter);
   app.use('/api/auth/', authRouter);
   app.use('/api/foolbalField/', foolbalFieldRouter)
   app.use("/api/upload/", uploadRouter);
};

export default Routers;

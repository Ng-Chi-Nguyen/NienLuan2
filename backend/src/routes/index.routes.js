
import userRouter from './user.routes.js';
import bunessRouter from './buness.routes.js';
import authRouter from './auth.routes.js';
import foolbalFieldRouter from './foolbalField.routes.js';
import uploadRouter from './upload.routes.js';
import addressRouter from './address.routes.js';
import bookingRouter from './bookingUser.routes.js';
import chartRouter from './chart.route.js';

const Routers = (app) => {
   app.use('/api/user/', userRouter);
   app.use('/api/business/', bunessRouter);
   app.use('/api/auth/', authRouter);
   app.use('/api/foolbalField/', foolbalFieldRouter)
   app.use("/api/upload/", uploadRouter);
   app.use("/api/address/", addressRouter)
   app.use("/api/bookingUser/", bookingRouter)
   app.use("/api/chart/", chartRouter)
};

export default Routers;

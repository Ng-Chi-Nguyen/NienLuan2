const usersRouter = require('./user.route');
const webRouter = require('./web.route');
const FoFieldRouter = require('./fofield.route');

const routers = (app) => {
   app.use("/api/user", usersRouter);
   app.use("/", webRouter);
   app.use("/api/fofield", FoFieldRouter);
}

module.exports = routers;

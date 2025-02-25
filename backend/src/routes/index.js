const usersRouter = require('./user.route');
const webRouter = require('./web.route');

const routers = (app) => {
   app.use("/api/user", usersRouter);
   app.use("/", webRouter);
}

module.exports = routers;

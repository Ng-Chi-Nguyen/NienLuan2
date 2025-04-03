import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Schedule from '../pages/Schedule/Schedule';
import Login from '../pages/Auth/Login';
import User from '../pages/User/User';
import BookingUser from '../pages/BookingUser/BookingUser';
import BookingBusiness from "../pages/User/BookBusiness/BookingBusiness"
export const routers = createBrowserRouter([
   {
      path: "/",
      element: <Home />
   },
   {
      path: "/Schedule",
      element: <Schedule />
   },
   {
      path: "/Login",
      element: <Login />
   },
   {
      path: "/User",
      element: <User />
   },
   {
      path: "/BookingUser/:idFF",
      element: <BookingUser />
   },
   {
      path: "/BookingBusiness/:idFF",
      element: <BookingBusiness />
   }
]);

import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Shopping from '../pages/Shopping/Shopping';
import Schedule from '../pages/Schedule/Schedule';
import Rank from '../pages/Rank/Rank';
import News from '../pages/News/News';
import Team from '../pages/Team/Team';
import Tournament from '../pages/Tournament/Tournament';
export const routers = createBrowserRouter([
   {
      path: "/",
      element: <Home />
   },
   {
      path: "/Shopping",
      element: <Shopping />
   },
   {
      path: "/News",
      element: <News />
   },
   {
      path: "/Tournament",
      element: <Tournament />
   },
   {
      path: "/Schedule",
      element: <Schedule />
   },
   {
      path: "/Rank",
      element: <Rank />
   },
   {
      path: "/Team",
      element: <Team />
   },
]);

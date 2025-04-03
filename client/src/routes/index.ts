// routes/index.ts

import Home from '../screens/Home';
import About from '../screens/About';
import Login from '../screens/Login';
import Register from '../screens/Register';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
];

export default routes;
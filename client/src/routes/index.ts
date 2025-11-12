// routes/index.ts
import Home from "../screens/Home";
import About from "../screens/About";
import Login from "../screens/Login";
import Register from "../screens/Register";
import MovieDetail from "../screens/MovieDetail";
import PlaylistDetail from "../screens/PlaylistDetail";
import Recommendations from "../screens/Recommendations";
import Profile from "../screens/Profile";
import React from "react";

interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/recommendations",
    component: Recommendations,
  },
  {
    path: "/movie/:id",
    component: MovieDetail,
  },
  {
    path: "/playlist/:id",
    component: PlaylistDetail,
  },
];

export default routes;
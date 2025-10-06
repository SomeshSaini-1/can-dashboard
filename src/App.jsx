import React from 'react';
import Dashboard from './pages/dashboard';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Login from './pages/login';
import Nopage from './pages/Nopage';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Adddevice from './pages/Device';
import User from './pages/User';
import Help from './pages/Help';
import Setting from './pages/Setting';
import Alert_page from './pages/Alert';
import History from "./pages/history";

// Route protection component
function ProtectedRoute() {
  const { isAuthentic } = useSelector((state) => state.auth);
  return isAuthentic ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  const router = createBrowserRouter([
    {
      // element: <ProtectedRoute />, // Protect all children routes
      // children: [
      //   {
          path: '/Home',
          element: <Home />,
      //   },
      // ],
    },
    {
      // element: <ProtectedRoute />,
      // children: [
        // {
          path: "/Dashboard",
          element: <Dashboard />
        // }
      // ]
    },
    {
      path:"/AddDevice",
      element : <Adddevice />
    },
      {
        path : "/History",
        element : <History />
      },
    {
      path :"/User",
      element : <User />
    },
    {
      path : "/Help",
      element : <Help />
    },
    {
      path: "/Setting",
      element : <Setting />
    },
    {
      path :"/Alert",
      element : <Alert_page />
    },
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '*',
      element: <Nopage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

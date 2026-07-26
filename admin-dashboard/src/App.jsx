import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import DarkModeProvider from "./context/DarkModeToggle";
import GlobalStyles from "./styles/GlobalStyles";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const Booking = lazy(() => import("./pages/Booking"));
const Checkin = lazy(() => import("./pages/Checkin"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="booking/:bookingId" element={<Booking />} />
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer stacked style={{ width: "20vw" }} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </DarkModeProvider>
  );
};

export default App;

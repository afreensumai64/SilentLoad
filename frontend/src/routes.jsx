import { createBrowserRouter, Navigate } from "react-router-dom";
import { isLoggedIn } from "./api";

import SplashScreen from "./Screens/SplashScreen";
import AuthScreen from "./Screens/AuthScreen";
import DashboardScreen from "./Screens/DashboardScreen";
import AddTaskScreen from "./Screens/AddTaskScreen";
import MorningCheckInScreen from "./Screens/MorningCheckInScreen";
import CapacityResultScreen from "./Screens/CapacityResultScreen";
import TaskSelectionScreen from "./Screens/TaskSelectionScreen";
import FocusModeScreen from "./Screens/FocusModeScreen";
import EndOfDayScreen from "./Screens/EndOfDayScreen";

// Protect routes that need login
function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/auth" replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <SplashScreen /> },
  { path: "/auth", element: <AuthScreen /> },
  { path: "/dashboard", element: <Protected><DashboardScreen /></Protected> },
  { path: "/add-task", element: <Protected><AddTaskScreen /></Protected> },
  { path: "/morning-checkin", element: <Protected><MorningCheckInScreen /></Protected> },
  { path: "/capacity-result", element: <Protected><CapacityResultScreen /></Protected> },
  { path: "/task-selection", element: <Protected><TaskSelectionScreen /></Protected> },
  { path: "/focus-mode", element: <Protected><FocusModeScreen /></Protected> },
  { path: "/end-of-day", element: <Protected><EndOfDayScreen /></Protected> },
]);

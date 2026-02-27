import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/profile"
import Loading from "./components/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"
import FitnessTracker from "./FitnessTracker"
import { useAppContext } from "./context/AppContext"

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  if (!isUserFetched) {
    return <Loading />
  }

  if (!user) {
    return <FitnessTracker />
  }

  if (!onboardingCompleted) {
    return <Onboarding />
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

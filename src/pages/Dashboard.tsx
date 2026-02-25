import { useEffect } from "react"
import { Flame, TrendingUp, Utensils, Activity, ArrowRight } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import CaloriesChart from "../components/CaloriesChart"
import { getMotivationalMessage } from "../assets/assets"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user, allFoodLogs, allActivityLogs, fetchFoodLogs, fetchActivityLogs } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFoodLogs()
    fetchActivityLogs()
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const todayFoodLogs = allFoodLogs.filter((log) => log.date === today || log.createdAt?.split("T")[0] === today)
  const todayActivityLogs = allActivityLogs.filter((log) => log.date === today || log.createdAt?.split("T")[0] === today)

  const caloriesConsumed = todayFoodLogs.reduce((sum, item) => sum + item.calories, 0)
  const caloriesBurned = todayActivityLogs.reduce((sum, item) => sum + (item.calories || 0), 0)
  const activeMinutes = todayActivityLogs.reduce((sum, item) => sum + (item.duration || 0), 0)
  const DAILY_CALORIE_LIMIT = user?.dailyCalorieIntake || 2200
  const DAILY_BURN_GOAL = user?.dailyCalorieBurn || 400
  const netCalories = caloriesConsumed - caloriesBurned
  const motivational = getMotivationalMessage(caloriesConsumed, activeMinutes, DAILY_CALORIE_LIMIT)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold mt-1">{user?.username || "User"} 👋</h1>
        <p className="text-emerald-100 text-sm mt-2">{motivational.emoji} {motivational.text}</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {/* Calorie Cards */}
        <div className="dashboard-card-grid">
          <Card className="p-4!">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consumed</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{caloriesConsumed}</p>
            <p className="text-xs text-slate-400 mt-1">/ {DAILY_CALORIE_LIMIT} kcal</p>
            <ProgressBar value={caloriesConsumed} max={DAILY_CALORIE_LIMIT} className="mt-3" />
          </Card>

          <Card className="p-4!">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Burned</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{caloriesBurned}</p>
            <p className="text-xs text-slate-400 mt-1">/ {DAILY_BURN_GOAL} kcal</p>
            <ProgressBar value={caloriesBurned} max={DAILY_BURN_GOAL} className="mt-3" />
          </Card>

          <Card className="p-4!">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Cal</span>
            </div>
            <p className={`text-2xl font-bold ${netCalories > DAILY_CALORIE_LIMIT ? "text-red-500" : "text-slate-800 dark:text-white"}`}>{netCalories}</p>
            <p className="text-xs text-slate-400 mt-1">intake - burn</p>
          </Card>

          <Card className="p-4!">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeMinutes}</p>
            <p className="text-xs text-slate-400 mt-1">minutes today</p>
          </Card>
        </div>

        {/* Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">Weekly Overview</h3>
          <p className="text-sm text-slate-400 mt-1">Calorie intake vs burn over the last 7 days</p>
          <CaloriesChart />
        </Card>

        {/* Today's Meals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Today's Meals</h3>
            <button onClick={() => navigate("/food")} className="text-emerald-500 text-sm font-medium flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {todayFoodLogs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No meals logged today. Start logging!</p>
          ) : (
            <div className="space-y-3">
              {todayFoodLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="food-entry-item">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{log.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{log.mealType}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{log.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Today's Activities</h3>
            <button onClick={() => navigate("/activity")} className="text-emerald-500 text-sm font-medium flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {todayActivityLogs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No activities logged today. Get moving!</p>
          ) : (
            <div className="space-y-3">
              {todayActivityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="activity-entry-item">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{log.name}</p>
                    <p className="text-xs text-slate-400">{log.duration} min</p>
                  </div>
                  <span className="text-sm font-semibold text-orange-500">{log.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Diet Plan Section - Moved to Profile page */}
    </div>
  )
}

export default Dashboard

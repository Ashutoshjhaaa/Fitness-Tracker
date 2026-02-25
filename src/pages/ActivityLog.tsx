import { useEffect, useState } from "react"
import { PlusIcon, Trash2Icon, ActivityIcon, ClockIcon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import strapiApi from "../services/strapiApi"
import { quickActivities } from "../assets/assets"
import toast from "react-hot-toast"

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs, fetchActivityLogs } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  })

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const todayLogs = allActivityLogs.filter((log) => log.date === today || log.createdAt?.split("T")[0] === today)
  const totalBurned = todayLogs.reduce((sum, item) => sum + (item.calories || 0), 0)
  const totalMinutes = todayLogs.reduce((sum, item) => sum + (item.duration || 0), 0)

  const handleQuickAdd = (activity: typeof quickActivities[0]) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: activity.rate * 30,
    })
    setShowForm(true)
  }

  const handleDurationChange = (duration: number) => {
    const selectedActivity = quickActivities.find((a) => a.name === formData.name)
    const rate = selectedActivity?.rate || 8
    setFormData({ ...formData, duration, calories: Math.round(rate * duration) })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.duration || !formData.calories) {
      toast.error("Please fill all fields")
      return
    }
    setIsSubmitting(true)
    try {
      const { data } = await strapiApi.activityLogs.create({ data: formData })
      setAllActivityLogs((prev) => [...prev, data])
      setFormData({ name: "", duration: 0, calories: 0 })
      setShowForm(false)
      toast.success("Activity added!")
    } catch {
      toast.error("Failed to add activity")
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (documentId: string) => {
    try {
      await strapiApi.activityLogs.delete(documentId)
      setAllActivityLogs((prev) => prev.filter((a) => a.documentId !== documentId))
      toast.success("Activity deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Activity Log</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your workouts & exercises</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="px-4! py-2.5!">
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add Activity</span>
          </Button>
        </div>

        {/* Daily Summary */}
        <div className="flex items-center gap-6 mt-5">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Burned Today</p>
            <p className="text-2xl font-bold text-orange-500">{totalBurned} <span className="text-sm font-normal text-slate-400">kcal</span></p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Active Time</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalMinutes} <span className="text-sm font-normal text-slate-400">min</span></p>
          </div>
        </div>
      </div>

      {/* Quick Activities */}
      <div className="p-4 lg:p-6 lg:max-w-4xl">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Quick Add</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActivities.map((activity) => (
            <button
              key={activity.name}
              onClick={() => handleQuickAdd(activity)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="text-2xl">{activity.emoji}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{activity.name}</span>
              <span className="text-[10px] text-slate-400">{activity.rate} cal/min</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Activity Form */}
      {showForm && (
        <div className="px-4 lg:px-6 lg:max-w-2xl">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Log Activity</h3>
            <div className="space-y-4">
              <Input label="Activity Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: String(v) })} placeholder="e.g. Morning Run" required />
              <Input label="Duration (minutes)" type="number" value={formData.duration} onChange={(v) => handleDurationChange(Number(v))} placeholder="e.g. 30" min={1} required />
              <Input label="Calories Burned" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} placeholder="e.g. 300" min={1} required />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Activity"}</Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Activity Log List */}
      <div className="p-4 lg:p-6 space-y-3 lg:max-w-4xl">
        {todayLogs.length === 0 ? (
          <Card className="text-center py-12">
            <ActivityIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No activities logged today</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Use quick add or tap "Add Activity" to start</p>
          </Card>
        ) : (
          todayLogs.map((log) => (
            <Card key={log.id}>
              <div className="activity-entry-item p-0! bg-transparent!">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <ActivityIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{log.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ClockIcon className="w-3 h-3" /> {log.duration} min
                      </span>
                      <span className="text-xs text-orange-500 font-medium">{log.calories} kcal</span>
                    </div>
                  </div>
                </div>
                {log.documentId && (
                  <button onClick={() => handleDelete(log.documentId)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityLog


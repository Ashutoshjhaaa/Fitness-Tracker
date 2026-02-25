import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Button from "../components/ui/Button"
import { UserIcon, CalendarIcon, WeightIcon, RulerIcon, TargetIcon, Flame, Utensils, Sparkles, PencilIcon } from "lucide-react"
import { goalLabels, goalOptions } from "../assets/assets"
import { generateDietPlan } from "../services/geminiService"
import strapiApi from "../services/strapiApi"
import toast from "react-hot-toast"

const Profile = () => {
  const { user, setUser } = useAppContext()
  const [dietPlan, setDietPlan] = useState<string>("")
  const [isLoadingDiet, setIsLoadingDiet] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    age: user?.age ?? 0,
    weight: user?.weight ?? 0,
    height: user?.height ?? 0,
    goal: user?.goal ?? "maintain",
    dailyCalorieIntake: user?.dailyCalorieIntake ?? 2000,
    dailyCalorieBurn: user?.dailyCalorieBurn ?? 400,
  })

  const handleEdit = () => {
    setEditData({
      age: user?.age ?? 0,
      weight: user?.weight ?? 0,
      height: user?.height ?? 0,
      goal: user?.goal ?? "maintain",
      dailyCalorieIntake: user?.dailyCalorieIntake ?? 2000,
      dailyCalorieBurn: user?.dailyCalorieBurn ?? 400,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editData.age || !editData.weight || !editData.height) {
      toast.error("Age, weight and height are required")
      return
    }
    setIsSaving(true)
    try {
      const { data } = await strapiApi.user.update(user?.id ?? "", editData)
      setUser((prev) => prev ? { ...prev, ...data } : prev)
      setIsEditing(false)
      toast.success("Profile updated!")
    } catch {
      toast.error("Failed to update profile")
    }
    setIsSaving(false)
  }

  const handleGenerateDietPlan = async () => {
    if (!user?.age || !user?.weight || !user?.height || !user?.goal) {
      toast.error("Please complete your profile first")
      return
    }
    setIsLoadingDiet(true)
    try {
      const plan = await generateDietPlan({
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        dailyCalorieIntake: user.dailyCalorieIntake || 2200,
      })
      setDietPlan(plan)
      toast.success("Diet plan generated!")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to generate diet plan"
      toast.error(msg)
    }
    setIsLoadingDiet(false)
  }

  const profileItems = [
    { label: "Username", value: user?.username, icon: UserIcon },
    { label: "Email", value: user?.email, icon: UserIcon },
    { label: "Age", value: user?.age ? `${user.age} years` : "-", icon: CalendarIcon },
    { label: "Weight", value: user?.weight ? `${user.weight} kg` : "-", icon: WeightIcon },
    { label: "Height", value: user?.height ? `${user.height} cm` : "-", icon: RulerIcon },
    { label: "Goal", value: user?.goal ? goalLabels[user.goal as keyof typeof goalLabels] : "-", icon: TargetIcon },
    { label: "Daily Calorie Intake", value: user?.dailyCalorieIntake ? `${user.dailyCalorieIntake} kcal` : "-", icon: Utensils },
    { label: "Daily Calorie Burn", value: user?.dailyCalorieBurn ? `${user.dailyCalorieBurn} kcal` : "-", icon: Flame },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your fitness profile information</p>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} className="px-4! py-2.5!">
              <PencilIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-3 lg:max-w-2xl">
        {isEditing ? (
          <Card>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <Input label="Age" type="number" value={editData.age} onChange={(v) => setEditData({ ...editData, age: Number(v) })} placeholder="e.g. 25" min={1} required />
              <Input label="Weight (kg)" type="number" value={editData.weight} onChange={(v) => setEditData({ ...editData, weight: Number(v) })} placeholder="e.g. 70" min={1} required />
              <Input label="Height (cm)" type="number" value={editData.height} onChange={(v) => setEditData({ ...editData, height: Number(v) })} placeholder="e.g. 175" min={1} required />
              <Select label="Goal" value={editData.goal} onChange={(v) => setEditData({ ...editData, goal: String(v) as typeof editData.goal })} options={goalOptions} required placeholder="Select your goal" />
              <Input label="Daily Calorie Intake (kcal)" type="number" value={editData.dailyCalorieIntake} onChange={(v) => setEditData({ ...editData, dailyCalorieIntake: Number(v) })} placeholder="e.g. 2200" min={1} required />
              <Input label="Daily Calorie Burn (kcal)" type="number" value={editData.dailyCalorieBurn} onChange={(v) => setEditData({ ...editData, dailyCalorieBurn: Number(v) })} placeholder="e.g. 400" min={1} required />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        ) : (
          profileItems.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label}>
                <div className="profile-info-row">
                  <Icon className="w-5 h-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-medium uppercase">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white mt-1">{item.value}</p>
                  </div>
                </div>
              </Card>
            )
          })
        )}

        {/* AI Diet Plan */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">AI Diet Plan</h3>
            </div>
            <button
              onClick={handleGenerateDietPlan}
              disabled={isLoadingDiet}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              {isLoadingDiet ? "Generating..." : "Generate Plan"}
            </button>
          </div>
          {dietPlan ? (
            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-2">
              {dietPlan.split("\n").map((line, i) => {
                const trimmed = line.replace(/\*\*(.*?)\*\*/g, "$1").replace(/^#+\s*/, "").replace(/^\*\s/, "\u2022 ")
                if (!trimmed.trim()) return <br key={i} />
                if (line.startsWith("#")) return <p key={i} className="font-semibold text-slate-800 dark:text-white mt-3">{trimmed}</p>
                return <p key={i}>{trimmed}</p>
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Click "Generate Plan" to get a personalized diet plan based on your profile.</p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Profile

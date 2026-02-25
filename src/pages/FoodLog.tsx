import { useEffect, useRef, useState } from "react"
import { PlusIcon, Trash2Icon, UtensilsIcon, SparklesIcon, CameraIcon, XIcon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Button from "../components/ui/Button"
import strapiApi from "../services/strapiApi"
import { mealTypeOptions, mealColors, mealIcons } from "../assets/assets"
import toast from "react-hot-toast"
import type { FormData } from "../types"
import { analyzeFoodSnap, analyzeFoodImage } from "../services/geminiService"

const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs, fetchFoodLogs } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSnapForm, setShowSnapForm] = useState(false)
  const [snapInput, setSnapInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string>("")
  const [imageMime, setImageMime] = useState<string>("image/jpeg")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    calories: 0,
    mealType: "",
  })

  useEffect(() => {
    fetchFoodLogs()
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const todayLogs = allFoodLogs.filter((log) => log.date === today || log.createdAt?.split("T")[0] === today)
  const totalCalories = todayLogs.reduce((sum, item) => sum + item.calories, 0)

  const handleSubmit = async () => {
    if (!formData.name || !formData.calories || !formData.mealType) {
      toast.error("Please fill all fields")
      return
    }
    setIsSubmitting(true)
    try {
      const { data } = await strapiApi.foodLogs.create({ data: formData })
      setAllFoodLogs((prev) => [...prev, data])
      setFormData({ name: "", calories: 0, mealType: "" })
      setShowForm(false)
      toast.success("Food entry added!")
    } catch {
      toast.error("Failed to add entry")
    }
    setIsSubmitting(false)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    setImageMime(file.type)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      // result is data:image/jpeg;base64,<data>
      const base64 = result.split(",")[1]
      setImageBase64(base64)
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleImageAnalysis = async () => {
    if (!imageBase64) { toast.error("Please select an image first"); return }
    setIsAnalyzing(true)
    try {
      const result = await analyzeFoodImage(imageBase64, imageMime)
      setFormData({ name: result.name, calories: result.calories, mealType: formData.mealType })
      setShowImageForm(false)
      setImagePreview(null)
      setImageBase64("")
      setShowForm(true)
      const extras = result.protein ? ` | P: ${result.protein}g C: ${result.carbs}g F: ${result.fat}g` : ""
      toast.success(`Detected: ${result.name} (~${result.calories} kcal${extras})`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Image analysis failed"
      toast.error(msg)
    }
    setIsAnalyzing(false)
  }

  const handleFoodSnap = async () => {
    if (!snapInput.trim()) {
      toast.error("Please describe the food")
      return
    }
    setIsAnalyzing(true)
    try {
      const result = await analyzeFoodSnap(snapInput)
      setFormData({ name: result.name, calories: result.calories, mealType: formData.mealType })
      setShowSnapForm(false)
      setSnapInput("")
      setShowForm(true)
      toast.success(`Detected: ${result.name} (~${result.calories} kcal)`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "AI analysis failed"
      toast.error(msg)
    }
    setIsAnalyzing(false)
  }

  const handleDelete = async (documentId: string) => {
    try {
      await strapiApi.foodLogs.delete(documentId)
      setAllFoodLogs((prev) => prev.filter((f) => f.documentId !== documentId))
      toast.success("Entry deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  // Group by meal type
  const grouped = todayLogs.reduce((acc, log) => {
    const type = log.mealType || "snack"
    if (!acc[type]) acc[type] = []
    acc[type].push(log)
    return acc
  }, {} as Record<string, typeof todayLogs>)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Food Log</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your daily nutrition</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setShowImageForm(!showImageForm); setShowSnapForm(false); setShowForm(false) }} className="px-4! py-2.5!">
              <CameraIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Photo Snap</span>
            </Button>
            <Button variant="secondary" onClick={() => { setShowSnapForm(!showSnapForm); setShowImageForm(false); setShowForm(false) }} className="px-4! py-2.5!">
              <SparklesIcon className="w-4 h-4" />
              <span className="hidden sm:inline">AI Food Snap</span>
            </Button>
            <Button onClick={() => { setShowForm(!showForm); setShowSnapForm(false); setShowImageForm(false) }} className="px-4! py-2.5!">
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Add Food</span>
            </Button>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="flex items-center gap-6 mt-5">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Today's Total</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span></p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Meals</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{todayLogs.length}</p>
          </div>
        </div>
      </div>

      {/* Photo Food Analysis */}
      {showImageForm && (
        <div className="p-4 lg:p-6 lg:max-w-2xl">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Photo Food Analysis</h3>
              </div>
              <button onClick={() => { setShowImageForm(false); setImagePreview(null); setImageBase64("") }} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">Take or upload a photo of your food — AI will identify it and estimate calories.</p>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
            {!imagePreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center gap-3 hover:border-emerald-400 transition-colors cursor-pointer"
              >
                <CameraIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-400">Tap to take a photo or choose from gallery</p>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Food preview" className="w-full max-h-60 object-cover" />
                  <button
                    onClick={() => { setImagePreview(null); setImageBase64(""); if (fileInputRef.current) fileInputRef.current.value = "" }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleImageAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Photo"}
                  </Button>
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* AI Food Snap Form */}
      {showSnapForm && (
        <div className="p-4 lg:p-6 lg:max-w-2xl">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">AI Food Snap</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Describe your food and AI will estimate the calories automatically.</p>
            <div className="space-y-4">
              <Input
                label="Describe your food"
                value={snapInput}
                onChange={(v) => setSnapInput(String(v))}
                placeholder="e.g. a bowl of oatmeal with banana and honey"
              />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleFoodSnap} disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze Food"}
                </Button>
                <Button variant="secondary" onClick={() => { setShowSnapForm(false); setSnapInput("") }}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Food Form */}
      {showForm && (
        <div className="p-4 lg:p-6 lg:max-w-2xl">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Add Food Entry</h3>
            <div className="space-y-4">
              <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: String(v) })} placeholder="e.g. Grilled Chicken Salad" required />
              <Input label="Calories" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} placeholder="e.g. 350" min={1} required />
              <Select label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: String(v) })} options={mealTypeOptions} required placeholder="Select meal type" />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Entry"}</Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Food Log List */}
      <div className="p-4 lg:p-6 space-y-4 lg:max-w-4xl">
        {todayLogs.length === 0 ? (
          <Card className="text-center py-12">
            <UtensilsIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No food logged today</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Tap "Add Food" to start tracking your meals</p>
          </Card>
        ) : (
          Object.entries(grouped).map(([mealType, logs]) => {
            const MealIcon = mealIcons[mealType as keyof typeof mealIcons] || UtensilsIcon
            const colorClass = mealColors[mealType as keyof typeof mealColors] || "bg-slate-100 text-slate-600"
            const mealTotal = logs.reduce((sum, l) => sum + l.calories, 0)

            return (
              <Card key={mealType}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <MealIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-white capitalize">{mealType}</h3>
                      <p className="text-xs text-slate-400">{logs.length} item{logs.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{mealTotal} kcal</span>
                </div>
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="food-entry-item">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{log.name}</p>
                        <p className="text-xs text-slate-400">{log.calories} kcal</p>
                      </div>
                      {log.documentId && (
                        <button onClick={() => handleDelete(log.documentId!)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default FoodLog

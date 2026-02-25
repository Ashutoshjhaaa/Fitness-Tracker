import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User, Flame } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/AppContext"
import type { ProfileFormData, UserData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Slider from "../components/ui/Slider"
import strapiApi from "../services/strapiApi"
import { goalOptions } from "../assets/assets"


 
 const Onboarding = () => {

  const [step, setStep] = useState(1)
  const {user, setOnboardingCompleted, fetchUser} = useAppContext()
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 25,
    weight: 70,
    goal: 'maintain',
    height: 170,
    dailyCalorieBurn: 400,
    dailyCalorieIntake: 2000,
  })

  const totalSteps = 4;

  const updateField = (field: keyof ProfileFormData, value: string | number)=>{
    setFormData({...formData,[field]: value})
  }
  const handleNext = async () => {
    if(step === 1) {
      if(!formData.age || Number(formData.age) < 13 || Number(formData.age) > 120) {
        return toast("Age is required")
  }
}
    if(step < totalSteps) {
      setStep(step + 1)
    } else {
      const userData = {
        ...formData,
        age: formData.age,
        weight: formData.weight,
        height: formData.height ? formData.height : null,
        createAt: new Date().toISOString(),
      };
      localStorage.setItem('fitnessUser', JSON.stringify(userData));
      await strapiApi.user.update(user?.id || "", userData as unknown as Partial<UserData>)
      toast.success("Profile setup complete!")
      setOnboardingCompleted(true);
      fetchUser(user?.token || "")
 
  }
}



   return (
     <>
     <Toaster/>
     <div className="onboarding-container">
      {/* Header */}
      <div className="p-6 pt-12 onboarding-wrapper">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <PersonStanding className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">FitTrack</h1>

        </div>
        <p className="text-slate-500
        dark:text-slate-400 mt-4">Let's personalize your experience</p>

      </div>
      {/* Progress Indicator */}
      <div className="px-6 mb-8 onboarding-wrapper">
        <div className="flex gap-2 max-w-2xl">
          {[1,2,3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              

      
   ))}

     </div>
     <p className="text-sm text-slate-400 mt-3">Step {step} of {totalSteps}</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 onboarding-wrapper">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8 mt-12">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"><User className="size-6 text-emerald-600 dark:text-emerald-400"/></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">How old are you?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">This helps us calculate your daily calorie needs.</p>
              </div>
            </div>
            <Input label="Age" type="number" className="max-w-2xl" value={formData.age} onChange={(v) => updateField('age', v)} placeholder="Enter your age " min={13} max={120} required />
          </div>
        )}

         {step === 2 && (
          <div className="space-y-6 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-8 mt-12">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"><ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400"/></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your measurements</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Help us track your progress.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 max-w-2xl">
            <Input label="Weight (kg)" type="number"  value={formData.weight} onChange={(v) => updateField('weight', v)} placeholder="Enter your weight" min={20} max={300} required />

             <Input label="Height (cm)" type="number"  value={formData.height} onChange={(v) => updateField('height', v)} placeholder="Enter your height" min={100} max={250}  />
          </div>
            </div>
        )}

      

         {step === 3 && (
          <div className="space-y-6 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-8 mt-12">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"><Target className="size-6 text-emerald-600 dark:text-emerald-400"/></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">What's your goal?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">We'll tailor your experience.</p>
              </div>
            </div>

            
            {/* options */}

            <div className="space-y-4 max-w-lg">
              {goalOptions.map((option) => (
                <button 
                  key={option.value}
                  onClick={()=>updateField('goal', option.value)}
                 className={`onboarding-option-btn ${formData.goal === option.value ? 'ring-2 ring-emerald-500' : ''}`}>
                  <span className="text-base text-slate-700 dark:text-slate-200">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-8 mt-12">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center"><Flame className="size-6 text-emerald-600 dark:text-emerald-400"/></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Set your daily targets</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Customize your calorie and burn goals.</p>
              </div>
            </div>
            <div className="space-y-8 max-w-2xl">
              <Slider
                label="Daily Calorie Intake"
                min={1200}
                max={4000}
                step={100}
                value={formData.dailyCalorieIntake}
                onChange={(v) => updateField('dailyCalorieIntake', v)}
                unit="kcal"
              />
              <Slider
                label="Daily Calorie Burn Goal"
                min={100}
                max={1000}
                step={50}
                value={formData.dailyCalorieBurn}
                onChange={(v) => updateField('dailyCalorieBurn', v)}
                unit="kcal"
              />
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="p-6 pb-10 onboarding-wrapper">
        <div className="flex gap-3 lg:justify-end">
          {step > 1 && (
            <Button variant="secondary" onClick={()=>setStep(step > 1 ? step-1 : 1)}className="max-lg:flex-1 lg:px-10">
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5"/>
                Back
              </span>
              
            </Button>
          )}
            <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
              <span className="flex items-center justify-center gap-2">
                  {step === totalSteps ? 'Get Started' : 'continue'}
                <ArrowRight className="w-5 h-5"/>
                
              </span>
              
            </Button>
              

            </div>
          
        </div>
      </div>
     </>
   )
 }
 
 export default Onboarding
 
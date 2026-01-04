import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Activity, Target, User } from "lucide-react";
import heroImage from "@assets/generated_images/clean_modern_fitness_lifestyle_hero_image.png";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(10).max(100),
  gender: z.enum(["male", "female", "other"]),
  height: z.coerce.number().min(100).max(250), // cm
  startWeight: z.coerce.number().min(30).max(300), // kg
  goalWeight: z.coerce.number().min(30).max(300),
  goalDuration: z.coerce.number().min(1).max(24), // months
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
});

type FormData = z.infer<typeof schema>;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { setProfile } = useApp();
  const [step, setStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      age: 27,
      gender: "male",
      height: 180,
      startWeight: 86,
      goalWeight: 80,
      goalDuration: 2,
      activityLevel: "moderate",
    },
  });

  const onSubmit = (data: FormData) => {
    setProfile({
      ...data,
      currentWeight: data.startWeight,
      startDate: new Date().toISOString(),
    });
    setLocation("/");
  };

  const steps = [
    {
      title: "Let's get to know you",
      description: "We need some basic details to build your plan.",
      fields: ["name", "age", "gender"],
      icon: User
    },
    {
      title: "Your Body Metrics",
      description: "Accurate measurements help us calculate your needs.",
      fields: ["height", "startWeight"],
      icon: Activity
    },
    {
      title: "Set Your Goals",
      description: "Where do you want to be in the future?",
      fields: ["goalWeight", "goalDuration", "activityLevel"],
      icon: Target
    },
  ];

  const nextStep = async () => {
    const fields = steps[step].fields as (keyof FormData)[];
    const isValid = await form.trigger(fields);
    if (isValid) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 bg-secondary/20 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(162, 230, 210, 0.4) 0%, transparent 70%)' }}></div>
        <div className="relative z-10 max-w-lg text-center">
          <img 
            src={heroImage} 
            alt="Healthy Lifestyle" 
            className="w-full h-auto mb-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-1000"
          />
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground/90 mb-4">Start Your Journey Today</h1>
          <p className="text-lg text-muted-foreground">"The only bad workout is the one that didn't happen."</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold">
                {step + 1}
              </span>
              <span className="text-sm font-medium text-muted-foreground">of {steps.length}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{steps[step].title}</h2>
            <p className="text-muted-foreground">{steps[step].description}</p>
          </div>

          <form className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">First Name</Label>
                      <Input id="name" {...form.register("name")} placeholder="e.g. Alex" className="h-12 text-lg" />
                      {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" {...form.register("age")} className="h-12 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select onValueChange={(val) => form.setValue("gender", val as any)} defaultValue={form.getValues("gender")}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" {...form.register("height")} className="h-12 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startWeight">Current Weight (kg)</Label>
                      <Input id="startWeight" type="number" {...form.register("startWeight")} className="h-12 text-lg" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                        <Input id="goalWeight" type="number" {...form.register("goalWeight")} className="h-12 text-lg border-primary/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goalDuration">Duration (months)</Label>
                        <Input id="goalDuration" type="number" {...form.register("goalDuration")} className="h-12 text-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Activity Level</Label>
                      <RadioGroup onValueChange={(val) => form.setValue("activityLevel", val as any)} defaultValue={form.getValues("activityLevel")} className="grid grid-cols-1 gap-2">
                        {["sedentary", "light", "moderate", "active"].map((level) => (
                          <div key={level}>
                            <RadioGroupItem value={level} id={level} className="peer sr-only" />
                            <Label
                              htmlFor={level}
                              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                            >
                              <span className="capitalize text-lg">{level}</span>
                              <Check className="w-4 h-4 opacity-0 peer-data-[state=checked]:opacity-100" />
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 flex justify-between">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="h-12 px-6">
                  Back
                </Button>
              ) : <div></div>}
              
              <Button type="button" onClick={nextStep} className="h-12 px-8 text-lg group">
                {step === steps.length - 1 ? "Start Plan" : "Next Step"}
                {step < steps.length - 1 && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { addDays, format, differenceInDays } from "date-fns";

export type UserProfile = {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  goalDuration: number; // months
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  startDate: string;
};

export type DailyLog = {
  date: string;
  weight?: number; // Added weight here
  water: number; // ml
  calories: number;
  exercise: number; // minutes
  meals: { id: string; name: string; calories: number; type: "breakfast" | "lunch" | "dinner" | "snack" }[];
  workouts: { id: string; name: string; duration: number; type: string }[];
};

type AppState = {
  profile: UserProfile | null;
  logs: Record<string, DailyLog>;
  setProfile: (profile: UserProfile) => void;
  updateLog: (date: string, update: Partial<DailyLog>) => void;
  addMeal: (date: string, meal: any) => void;
  addWorkout: (date: string, workout: any) => void;
  reset: () => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("vitalife_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem("vitalife_logs");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("vitalife_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("vitalife_logs", JSON.stringify(logs));
  }, [logs]);

  const updateLog = (date: string, update: Partial<DailyLog>) => {
    setLogs((prev) => {
      const current = prev[date] || {
        date,
        water: 0,
        calories: 0,
        exercise: 0,
        meals: [],
        workouts: [],
      };
      return {
        ...prev,
        [date]: { ...current, ...update },
      };
    });
  };

  const addMeal = (date: string, meal: any) => {
    setLogs((prev) => {
      const current = prev[date] || {
        date,
        water: 0,
        calories: 0,
        exercise: 0,
        meals: [],
        workouts: [],
      };
      return {
        ...prev,
        [date]: {
          ...current,
          calories: current.calories + meal.calories,
          meals: [...current.meals, { ...meal, id: Math.random().toString() }],
        },
      };
    });
  };

  const addWorkout = (date: string, workout: any) => {
    setLogs((prev) => {
      const current = prev[date] || {
        date,
        water: 0,
        calories: 0,
        exercise: 0,
        meals: [],
        workouts: [],
      };
      return {
        ...prev,
        [date]: {
          ...current,
          exercise: current.exercise + workout.duration,
          workouts: [...current.workouts, { ...workout, id: Math.random().toString() }],
        },
      };
    });
  };

  const reset = () => {
    setProfile(null);
    setLogs({});
    localStorage.removeItem("vitalife_profile");
    localStorage.removeItem("vitalife_logs");
  };

  return (
    <AppContext.Provider value={{ profile, logs, setProfile, updateLog, addMeal, addWorkout, reset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

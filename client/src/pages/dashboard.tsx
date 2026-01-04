import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, Droplets, Flame, Scale, Trophy } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "wouter";

export default function Dashboard() {
  const { profile, logs } = useApp();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs[today] || { water: 0, calories: 0, exercise: 0 };
  
  // Calculate daily calorie target (BMR + Activity - Deficit)
  // Simple approximation: BMR = 10*weight + 6.25*height - 5*age + 5 (male)
  // Let's just use a standard calculation for the mockup
  const bmr = profile ? (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'male' ? 5 : -161) : 2000;
  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = bmr * (activityMultipliers[profile?.activityLevel || 'moderate'] || 1.2);
  const targetCalories = Math.round(tdee - 500); // 500 deficit
  
  const weightData = Object.keys(logs)
    .sort()
    .slice(-7)
    .map(date => ({
      date: format(new Date(date), "MMM d"),
      weight: logs[date]?.weight || profile?.currentWeight
    }));
    
  if (weightData.length === 0 && profile) {
      weightData.push({ date: 'Start', weight: profile.startWeight });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.name}</h1>
          <p className="text-muted-foreground">You're on day {Math.max(1, Math.floor((Date.now() - new Date(profile?.startDate || new Date()).getTime()) / (1000 * 60 * 60 * 24)))} of your journey.</p>
        </div>
        <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Goal: {profile?.goalWeight}kg
            </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLog.calories} <span className="text-sm text-muted-foreground font-normal">/ {targetCalories}</span></div>
            <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full transition-all" style={{ width: `${Math.min(100, (todayLog.calories / targetCalories) * 100)}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(todayLog.water / 1000).toFixed(1)}L <span className="text-sm text-muted-foreground font-normal">/ 2.5L</span></div>
             <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, (todayLog.water / 2500) * 100)}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercise</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLog.exercise} <span className="text-sm text-muted-foreground font-normal">min</span></div>
             <p className="text-xs text-muted-foreground mt-2">Active lifestyle goal: 30m/day</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currentWeight} kg</div>
            <p className="text-xs text-muted-foreground mt-2">
               {(profile?.startWeight || 0) - (profile?.currentWeight || 0) > 0 ? 'Lost' : 'Gained'} {Math.abs((profile?.startWeight || 0) - (profile?.currentWeight || 0)).toFixed(1)} kg total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                    <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 shadow-sm bg-primary text-primary-foreground border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div>
                    <div className="text-4xl font-bold mb-1">{(profile?.currentWeight || 0) - 1} kg</div>
                    <p className="text-primary-foreground/80">Only 1kg to go for your next milestone!</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium italic">"Consistency is what transforms average into excellence."</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

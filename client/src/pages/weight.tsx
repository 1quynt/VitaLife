import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Scale, TrendingDown, Target } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Label } from "@/components/ui/label";

export default function Weight() {
  const { profile, logs, updateLog, setProfile } = useApp();
  const today = format(new Date(), "yyyy-MM-dd");
  
  const [currentWeightInput, setCurrentWeightInput] = useState("");

  const handleLogWeight = () => {
    if (currentWeightInput && profile) {
      const weight = parseFloat(currentWeightInput);
      updateLog(today, { weight });
      setProfile({ ...profile, currentWeight: weight });
      setCurrentWeightInput("");
    }
  };

  const weightData = Object.keys(logs)
    .sort()
    .map(date => ({
      date: format(new Date(date), "MMM d"),
      weight: logs[date]?.weight || null
    }))
    .filter(d => d.weight !== null);

  // Add start weight to beginning
  if (profile) {
    weightData.unshift({ date: 'Start', weight: profile.startWeight });
  }

  // Add goal line data (simplified)
  const goalLine = profile ? [
      { weight: profile.goalWeight }, 
      { weight: profile.goalWeight }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Weight Tracker</h1>
            <p className="text-muted-foreground">Monitor your progress towards your goal.</p>
        </div>
        <div className="flex items-end gap-2 p-4 bg-card rounded-lg border shadow-sm">
            <div className="space-y-2">
                <Label>Log Today's Weight</Label>
                <div className="flex gap-2">
                    <Input 
                        type="number" 
                        placeholder={`${profile?.currentWeight} kg`} 
                        value={currentWeightInput} 
                        onChange={(e) => setCurrentWeightInput(e.target.value)}
                        className="w-32" 
                    />
                    <Button onClick={handleLogWeight}>Save</Button>
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-full">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-2xl font-bold">{profile?.currentWeight} kg</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-full">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Goal</p>
                        <p className="text-2xl font-bold">{profile?.goalWeight} kg</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-full">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Difference</p>
                        <p className="text-2xl font-bold text-primary">
                            {profile ? (profile.currentWeight - profile.goalWeight).toFixed(1) : 0} kg
                        </p>
                        <p className="text-xs text-muted-foreground">Left to lose</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="h-[400px]">
        <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Plus, Dumbbell, Timer, Activity } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Exercise() {
  const { logs, addWorkout } = useApp();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs[today] || { workouts: [], exercise: 0 };

  const [isOpen, setIsOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: "", duration: "", type: "cardio" });

  const handleAddWorkout = () => {
    if (newWorkout.name && newWorkout.duration) {
      addWorkout(today, { 
        name: newWorkout.name, 
        duration: parseInt(newWorkout.duration), 
        type: newWorkout.type 
      });
      setIsOpen(false);
      setNewWorkout({ name: "", duration: "", type: "cardio" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercise</h1>
            <p className="text-muted-foreground">Log your workouts and stay active.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
                <Plus className="w-4 h-4" /> Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Workout Name</Label>
                <Input value={newWorkout.name} onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})} placeholder="e.g. Morning Run" />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" value={newWorkout.duration} onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} placeholder="30" />
              </div>
              <Button onClick={handleAddWorkout} className="w-full">Log Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                        <Timer className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Time</p>
                        <p className="text-2xl font-bold">{todayLog.exercise} min</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                        <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Workouts</p>
                        <p className="text-2xl font-bold">{todayLog.workouts?.length || 0}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Streak</p>
                        <p className="text-2xl font-bold">3 Days</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
        </CardHeader>
        <CardContent>
            {todayLog.workouts?.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No workouts logged today. Get moving!</p>
                 </div>
            ) : (
                <div className="space-y-4">
                    {todayLog.workouts?.map((workout, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{workout.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{workout.type || 'General'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{workout.duration} min</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

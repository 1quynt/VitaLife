import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Plus, Utensils, Flame } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Diet() {
  const { logs, addMeal, profile } = useApp();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs[today] || { meals: [], calories: 0 };
  
  const bmr = profile ? (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'male' ? 5 : -161) : 2000;
  const tdee = bmr * 1.55; 
  const targetCalories = Math.round(tdee - 500);

  const [isOpen, setIsOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "", type: "breakfast" });

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories) {
      addMeal(today, { 
        name: newMeal.name, 
        calories: parseInt(newMeal.calories), 
        type: newMeal.type 
      });
      setIsOpen(false);
      setNewMeal({ name: "", calories: "", type: "breakfast" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Diet Plan</h1>
            <p className="text-muted-foreground">Track your meals and calories.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
                <Plus className="w-4 h-4" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Meal Name</Label>
                <Input value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} placeholder="e.g. Oatmeal with berries" />
              </div>
              <div className="space-y-2">
                <Label>Calories</Label>
                <Input type="number" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})} placeholder="350" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newMeal.type} onValueChange={(val) => setNewMeal({...newMeal, type: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMeal} className="w-full">Add Meal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Calories Remaining</p>
                <p className="text-4xl font-bold text-primary">{Math.max(0, targetCalories - todayLog.calories)}</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {["breakfast", "lunch", "dinner", "snack"].map((type) => (
            <Card key={type}>
                <CardHeader className="py-4">
                    <CardTitle className="capitalize text-lg flex items-center gap-2">
                        <span className={`w-2 h-8 rounded-full ${
                            type === 'breakfast' ? 'bg-orange-400' :
                            type === 'lunch' ? 'bg-green-400' :
                            type === 'dinner' ? 'bg-blue-400' : 'bg-purple-400'
                        }`} />
                        {type}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                    {todayLog.meals?.filter((m) => m.type === type).length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No meals logged yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {todayLog.meals?.filter((m) => m.type === type).map((meal, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                    <span className="font-medium">{meal.name}</span>
                                    <span className="text-sm text-muted-foreground">{meal.calories} kcal</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

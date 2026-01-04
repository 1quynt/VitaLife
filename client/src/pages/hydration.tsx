import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Droplets, Plus, Minus, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hydration() {
  const { logs, updateLog } = useApp();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs[today] || { water: 0 };
  const target = 2500; // 2.5L

  const addWater = (amount: number) => {
    const current = todayLog.water || 0;
    updateLog(today, { water: Math.max(0, current + amount) });
  };

  const percentage = Math.min(100, ((todayLog.water || 0) / target) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-8 text-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Hydration</h1>
            <p className="text-muted-foreground">Stay hydrated to keep your body functioning perfectly.</p>
        </div>

        <div className="relative h-80 w-64 mx-auto bg-blue-50 border-4 border-blue-100 rounded-[3rem] overflow-hidden shadow-xl">
             {/* Water Level */}
             <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500 opacity-80"
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
             >
                <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400 opacity-50 blur-sm animate-pulse" />
             </motion.div>
             
             {/* Bubbles Animation could go here */}

             <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                <span className="text-5xl font-bold text-slate-800 drop-shadow-sm">{todayLog.water || 0}</span>
                <span className="text-sm font-medium text-slate-600">ml</span>
             </div>
        </div>

        <div className="space-y-4">
            <p className="text-sm font-medium">Daily Goal: {target}ml</p>
            <div className="flex justify-center gap-4">
                <Button variant="outline" size="icon" onClick={() => addWater(-250)} className="h-12 w-12 rounded-full border-2">
                    <Minus className="w-6 h-6" />
                </Button>
                <Button size="lg" onClick={() => addWater(250)} className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                    <Plus className="w-5 h-5 mr-2" /> Add 250ml
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <Droplets className="text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Remaining</p>
                            <p className="font-bold">{Math.max(0, target - (todayLog.water || 0))}ml</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <Activity className="text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-bold">{percentage >= 100 ? "Great Job!" : "Keep Drinking"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

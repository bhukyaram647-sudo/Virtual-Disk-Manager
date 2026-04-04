import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, isFirebaseConfigured } from "@/firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, Clock, HardDrive } from "lucide-react";

interface SavedSimulation {
  id: string;
  algorithm: string;
  totalSeekTime: number;
  averageSeekTime: number;
  requests: number[];
  head: number;
  cylinders: number;
  createdAt: any;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#06b6d4", "#ec4899"];

export default function DashboardPage() {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }
    const fetchSims = async () => {
      try {
        const q = query(
          collection(db, "simulations"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setSimulations(snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedSimulation)));
      } catch {
        // Firestore may not be configured yet
      } finally {
        setLoading(false);
      }
    };
    fetchSims();
  }, [user]);

  // Aggregate data for comparison chart
  const algoStats: Record<string, { total: number; count: number }> = {};
  simulations.forEach(s => {
    if (!algoStats[s.algorithm]) algoStats[s.algorithm] = { total: 0, count: 0 };
    algoStats[s.algorithm].total += s.totalSeekTime;
    algoStats[s.algorithm].count++;
  });
  const chartData = Object.entries(algoStats).map(([name, { total, count }]) => ({
    name: name.toUpperCase(), avgSeek: Math.round(total / count),
  }));

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="glass rounded-2xl p-12 max-w-md mx-auto">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Sign in to save simulations and view your dashboard.</p>
          <a href="/auth" className="inline-block px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track and compare your simulation history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{simulations.length}</p>
              <p className="text-sm text-muted-foreground">Total Simulations</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Object.keys(algoStats).length}</p>
              <p className="text-sm text-muted-foreground">Algorithms Used</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {simulations.length > 0 ? Math.round(simulations.reduce((a, s) => a + s.averageSeekTime, 0) / simulations.length) : 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg Seek Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Average Seek Time by Algorithm</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
              <Bar dataKey="avgSeek" radius={[8, 8, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Simulation History</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : simulations.length === 0 ? (
          <p className="text-muted-foreground text-sm">No simulations saved yet. Run a simulation and it will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Algorithm</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Cylinders</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Head</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total Seek</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Avg Seek</th>
              </tr></thead>
              <tbody>
                {simulations.map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{s.algorithm.toUpperCase()}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.cylinders}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.head}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{s.totalSeekTime}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.averageSeekTime?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

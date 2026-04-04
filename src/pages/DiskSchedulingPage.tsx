import { useState, useCallback } from "react";
import { fcfs, sstf, scan, cscan, look, clook, SchedulingResult, AlgorithmName } from "@/lib/algorithms/diskScheduling";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, RotateCcw, Shuffle, ChevronDown } from "lucide-react";

const ALGO_MAP = { fcfs, sstf, scan, cscan, look, clook };
const ALGO_LABELS: Record<AlgorithmName, string> = { fcfs: "FCFS", sstf: "SSTF", scan: "SCAN", cscan: "C-SCAN", look: "LOOK", clook: "C-LOOK" };
const COLORS: Record<AlgorithmName, string> = { fcfs: "#3b82f6", sstf: "#8b5cf6", scan: "#22c55e", cscan: "#f59e0b", look: "#06b6d4", clook: "#ec4899" };

export default function DiskSchedulingPage() {
  const [cylinders, setCylinders] = useState(200);
  const [head, setHead] = useState(50);
  const [requestStr, setRequestStr] = useState("98, 183, 37, 122, 14, 124, 65, 67");
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmName>("fcfs");
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [animStep, setAnimStep] = useState(-1);
  const [comparing, setComparing] = useState(false);
  const [compareResults, setCompareResults] = useState<Record<string, SchedulingResult>>({});

  const parseRequests = () => requestStr.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < cylinders);

  const runAlgorithm = useCallback(() => {
    const requests = parseRequests();
    if (requests.length === 0) return;
    const algo = ALGO_MAP[selectedAlgo];
    const needsDir = ['scan', 'cscan', 'look', 'clook'].includes(selectedAlgo);
    const r = needsDir
      ? (algo as typeof scan)(head, requests, cylinders, direction)
      : (algo as typeof fcfs)(head, requests);
    setResult(r);
    setAnimStep(-1);
    setComparing(false);
  }, [selectedAlgo, head, requestStr, cylinders, direction]);

  const compareAll = useCallback(() => {
    const requests = parseRequests();
    if (requests.length === 0) return;
    const results: Record<string, SchedulingResult> = {};
    for (const [name, fn] of Object.entries(ALGO_MAP)) {
      const needsDir = ['scan', 'cscan', 'look', 'clook'].includes(name);
      results[name] = needsDir
        ? (fn as typeof scan)(head, requests, cylinders, direction)
        : (fn as typeof fcfs)(head, requests);
    }
    setCompareResults(results);
    setComparing(true);
    setResult(null);
  }, [head, requestStr, cylinders, direction]);

  const randomize = () => {
    const count = 8 + Math.floor(Math.random() * 8);
    const reqs = Array.from({ length: count }, () => Math.floor(Math.random() * cylinders));
    setRequestStr(reqs.join(", "));
    setHead(Math.floor(Math.random() * cylinders));
  };

  const animate = () => {
    if (!result) return;
    setAnimStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= result.seekSequence.length - 1) clearInterval(interval);
      setAnimStep(step);
    }, 500);
  };

  const chartData = result ? result.seekSequence.map((pos, i) => ({ step: i, position: pos })) : [];
  const animatedData = animStep >= 0 ? chartData.slice(0, animStep + 2) : chartData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Disk Scheduling Simulator</h1>
        <p className="text-muted-foreground">Configure parameters and visualize how different algorithms schedule disk I/O requests.</p>
      </div>

      {/* Input Panel */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Cylinders</label>
            <input type="number" value={cylinders} onChange={e => setCylinders(+e.target.value)} min={1}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Initial Head Position</label>
            <input type="number" value={head} onChange={e => setHead(+e.target.value)} min={0} max={cylinders - 1}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Algorithm</label>
            <div className="relative">
              <select value={selectedAlgo} onChange={e => setSelectedAlgo(e.target.value as AlgorithmName)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none">
                {Object.entries(ALGO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Direction</label>
            <div className="relative">
              <select value={direction} onChange={e => setDirection(e.target.value as 'left' | 'right')}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none">
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Request Queue (comma-separated)</label>
          <input value={requestStr} onChange={e => setRequestStr(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-mono" />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={runAlgorithm} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity text-sm">
            <Play className="w-4 h-4" /> Run
          </button>
          <button onClick={compareAll} className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity text-sm">
            Compare All
          </button>
          <button onClick={randomize} className="px-5 py-2.5 rounded-xl glass font-semibold flex items-center gap-2 hover:bg-muted transition-all text-sm">
            <Shuffle className="w-4 h-4" /> Random
          </button>
          {result && (
            <button onClick={animate} className="px-5 py-2.5 rounded-xl glass font-semibold flex items-center gap-2 hover:bg-muted transition-all text-sm">
              <RotateCcw className="w-4 h-4" /> Animate
            </button>
          )}
        </div>
      </div>

      {/* Single Result */}
      {result && !comparing && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Head Movement — {ALGO_LABELS[selectedAlgo]}</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={animatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="step" label={{ value: "Step", position: "insideBottom", offset: -5 }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, cylinders]} label={{ value: "Cylinder", angle: -90, position: "insideLeft" }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                <Line type="linear" dataKey="position" stroke={COLORS[selectedAlgo]} strokeWidth={2.5} dot={{ fill: COLORS[selectedAlgo], r: 4 }} animationDuration={300} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Seek Time</span><span className="font-bold text-primary">{result.totalSeekTime}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Average Seek Time</span><span className="font-bold">{result.averageSeekTime.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Requests Served</span><span className="font-bold">{result.order.length}</span></div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Execution Order</h3>
              <div className="flex flex-wrap gap-2">
                {result.order.map((r, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-medium">{r}</span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6 max-h-48 overflow-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Steps</h3>
              <div className="space-y-1.5 text-xs font-mono">
                {result.steps.map((s, i) => (
                  <div key={i} className="flex justify-between text-muted-foreground">
                    <span>{s.from} → {s.to}</span>
                    <span className="text-foreground font-medium">+{s.seek}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare All */}
      {comparing && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Algorithm Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Algorithm</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total Seek</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Avg Seek</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(compareResults).sort((a, b) => a[1].totalSeekTime - b[1].totalSeekTime).map(([name, r]) => (
                    <tr key={name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[name as AlgorithmName] }} />
                        {ALGO_LABELS[name as AlgorithmName]}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">{r.totalSeekTime}</td>
                      <td className="py-3 px-4 text-right font-mono">{r.averageSeekTime.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Head Movement Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="step" type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, cylinders]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                {Object.entries(compareResults).map(([name, r]) => (
                  <Line key={name} data={r.seekSequence.map((pos, i) => ({ step: i, [name]: pos }))} dataKey={name} name={ALGO_LABELS[name as AlgorithmName]}
                    stroke={COLORS[name as AlgorithmName]} strokeWidth={2} dot={false} type="linear" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

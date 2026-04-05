import { Link } from "react-router-dom";
import { HardDrive, Disc, FolderOpen, BarChart3, Zap, Shield } from "lucide-react";
import LiquidEther from "@/components/ui/LiquidEther";

const features = [
  { icon: Disc, title: "Disk Scheduling", desc: "Simulate FCFS, SSTF, SCAN, C-SCAN, LOOK & C-LOOK algorithms with animated visualizations", to: "/disk-scheduling" },
  { icon: FolderOpen, title: "File Allocation", desc: "Explore Sequential, Linked & Indexed allocation with interactive block grids", to: "/file-allocation" },
  { icon: BarChart3, title: "Performance Dashboard", desc: "Compare algorithms side-by-side with detailed metrics and charts", to: "/dashboard" },
];

const highlights = [
  { icon: Zap, title: "Real-time Animation", desc: "Watch disk head movement step by step" },
  { icon: Shield, title: "Cloud Sync", desc: "Save and revisit simulations with Firebase" },
  { icon: BarChart3, title: "Algorithm Comparison", desc: "Compare seek times across all algorithms" },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="relative pt-20 pb-10 px-4 text-center overflow-hidden">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ height: 600 }}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8">
            <HardDrive className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Operating Systems Concepts Visualized</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Virtual Disk</span>
            <br />Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Interactive simulator for disk scheduling algorithms and file allocation techniques.
            Visualize, compare, and understand OS concepts in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/disk-scheduling"
              className="px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary hover:opacity-90 transition-all"
            >
              Start Simulating
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3 rounded-xl glass font-semibold hover:bg-muted transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, to }) => (
            <Link key={title} to={to} className="glass rounded-2xl p-8 hover:glow-primary transition-all group">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4">
        <div className="glass rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-center mb-8">Why VDiskManager?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

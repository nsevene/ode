import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { CoreWebVitals } from "@/components/performance/CoreWebVitals";

export default function PerformancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <PerformanceMonitor />
        <CoreWebVitals />
      </div>
    </div>
  );
}
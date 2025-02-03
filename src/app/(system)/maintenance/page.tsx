import CountDown from "@/app/components/CountDown";
import { maintenanceNotice } from "@/config";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 text-center border border-white/20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
        <span className="text-yellow-400">🛠</span> Scheduled Maintenance
      </h1>

      <div className="text-gray-300 text-sm sm:text-lg mt-3 sm:mt-4 leading-relaxed">
        {maintenanceNotice.message}
      </div>

      {maintenanceNotice.additionalInfo && (
        <div className="p-3 sm:p-4 mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm sm:text-base">
          {maintenanceNotice.additionalInfo}
        </div>
      )}

      {/* Countdown Timer */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center">
        <p className="text-xs sm:text-sm text-gray-300">
          Estimated completion in
        </p>
        <span className="ml-2 px-2 sm:px-3 py-1 rounded-lg text-white font-semibold text-xs sm:text-sm flex  items-center gap-2">
          <CountDown
            className="pt-3 pb-1 text-2xl"
            targetDate={new Date(maintenanceNotice.end.date)}
          />
          <span
            className={cn(
              "text-xs font-medium px-1 py-0.5 rounded-sm select-none",
              maintenanceNotice.end.probability === "high"
                ? "bg-green-500/50 border border-green-500/70"
                : "bg-red-500/50 border border-red-500/70"
            )}
          >
            {maintenanceNotice.end.probability === "high"
              ? "High Probability"
              : "Low Probability"}
          </span>
        </span>
      </div>
    </div>
  );
}

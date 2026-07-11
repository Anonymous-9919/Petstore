import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string; size?: number }>;

const colorMap: Record<string, string> = {
  green: "from-green-500 to-emerald-500",
  blue: "from-blue-500 to-cyan-500",
  orange: "from-orange-500 to-amber-500",
  purple: "from-purple-500 to-pink-500",
  red: "from-red-500 to-rose-500",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "orange",
}: {
  label: string;
  value: string;
  icon: IconType;
  color?: keyof typeof colorMap;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { Progress } from "@/components/ui/progress";

type Props = {
  fullName: string;
  ridingName: string;
  province: string;
  population: number;
  supports: number;
  goal: number;
};

const MPProgressItem: React.FC<Props> = ({
  fullName,
  ridingName,
  province,
  population,
  supports,
  goal,
}) => {
  const pct = Math.min(100, Math.round((supports / Math.max(goal, 1)) * 100));
  const remaining = Math.max(goal - supports, 0);
  const ready = pct >= 100;

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{province}</div>
          <div className="font-semibold text-gray-900">{ridingName}</div>
          <div className="text-sm text-gray-700">{fullName}</div>
          <div className="text-xs text-gray-500 mt-1">Riding population: {population.toLocaleString()}</div>
        </div>
        <div className={`text-xs font-medium ${ready ? "text-green-700" : "text-gray-600"}`}>
          {ready ? "Ready to send" : `${remaining} left`}
        </div>
      </div>

      <div className="mt-3">
        <Progress value={pct} />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
        <div>
          {supports} of {goal} supporters
        </div>
        <div>{pct}%</div>
      </div>
    </div>
  );
};

export default MPProgressItem;

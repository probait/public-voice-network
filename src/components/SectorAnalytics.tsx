
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const SectorAnalytics = () => {
  const sectorData = [
    {
      sector: "Employment",
      concerns: 487,
      topConcern: "Job displacement from automation",
      percentage: 21
    },
    {
      sector: "Healthcare",
      concerns: 412,
      topConcern: "AI bias in diagnostics",
      percentage: 18
    },
    {
      sector: "Privacy",
      concerns: 356,
      topConcern: "Data collection without consent",
      percentage: 15
    },
    {
      sector: "Education",
      concerns: 298,
      topConcern: "AI replacing teachers",
      percentage: 13
    },
    {
      sector: "Ethics",
      concerns: 267,
      topConcern: "Algorithmic discrimination",
      percentage: 11
    },
    {
      sector: "Economy",
      concerns: 234,
      topConcern: "Small business adaptation costs",
      percentage: 10
    },
    {
      sector: "Regulation",
      concerns: 189,
      topConcern: "Lack of oversight frameworks",
      percentage: 8
    },
    {
      sector: "Other",
      concerns: 104,
      topConcern: "Environmental impact of AI",
      percentage: 4
    }
  ];

  const chartConfig = {
    concerns: {
      label: "Number of Concerns",
      color: "#dc2626"
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution of Concerns by Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <XAxis 
                  dataKey="sector" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="concerns" fill="var(--color-concerns)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectorData.map((sector) => (
          <Card key={sector.sector} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{sector.sector}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Concerns:</span>
                  <span className="font-semibold">{sector.concerns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <span className="font-semibold">{sector.percentage}%</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                  <p className="text-sm font-medium text-gray-800">{sector.topConcern}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectorAnalytics;

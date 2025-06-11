
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const RegionalAnalytics = () => {
  const provincialData = [
    { province: "ON", name: "Ontario", submissions: 687, topConcern: "Employment automation", color: "#dc2626" },
    { province: "QC", name: "Quebec", submissions: 523, topConcern: "Language preservation in AI", color: "#2563eb" },
    { province: "BC", name: "British Columbia", submissions: 445, topConcern: "Tech sector worker rights", color: "#16a34a" },
    { province: "AB", name: "Alberta", submissions: 298, topConcern: "Energy sector AI transition", color: "#ca8a04" },
    { province: "MB", name: "Manitoba", submissions: 134, topConcern: "Rural healthcare AI access", color: "#9333ea" },
    { province: "SK", name: "Saskatchewan", submissions: 89, topConcern: "Agricultural data ownership", color: "#dc2626" },
    { province: "NS", name: "Nova Scotia", submissions: 76, topConcern: "Maritime industry changes", color: "#2563eb" },
    { province: "NB", name: "New Brunswick", submissions: 45, topConcern: "Bilingual AI services", color: "#16a34a" },
    { province: "NL", name: "Newfoundland", submissions: 32, topConcern: "Resource sector automation", color: "#ca8a04" },
    { province: "PE", name: "Prince Edward Island", submissions: 12, topConcern: "Tourism industry AI", color: "#9333ea" },
    { province: "YT", name: "Yukon", submissions: 4, topConcern: "Northern connectivity", color: "#dc2626" },
    { province: "NT", name: "Northwest Territories", submissions: 2, topConcern: "Indigenous data rights", color: "#2563eb" }
  ];

  const chartConfig = {
    submissions: {
      label: "Submissions",
      color: "#dc2626"
    }
  };

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions by Province/Territory</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provincialData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="province" 
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="submissions" fill="var(--color-submissions)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={provincialData.slice(0, 6)} // Top 6 provinces for readability
                    dataKey="submissions"
                    nameKey="province"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ province, percent }) => `${province} ${(percent * 100).toFixed(0)}%`}
                  >
                    {provincialData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Provincial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {provincialData.map((region) => (
          <Card key={region.province} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>{region.name}</span>
                <span className="text-sm font-normal text-gray-500">({region.province})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Submissions:</span>
                  <span className="font-semibold">{region.submissions}</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                  <p className="text-sm font-medium text-gray-800">{region.topConcern}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegionalAnalytics;

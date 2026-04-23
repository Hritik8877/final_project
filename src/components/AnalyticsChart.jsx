"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AnalyticsChart({ data }) {
  // Aggregate data for the chart: Students per Course
  const chartData = data.map((course) => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
    students: course.students,
  }));

  const colors = ["#4F46E5", "#0EA5E9", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899"];

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#fff",
            }}
            cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
          />
          <Bar dataKey="students" radius={[6, 6, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

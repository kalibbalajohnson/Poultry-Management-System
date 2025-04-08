import Navbar2 from "../components/navBar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "chart.js/auto";
import Layout from "@/components/layout";
import { Feather, Home, Stethoscope, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Eggs",
    color: "#2563eb",
  },
  mobile: {
    label: "Deaths",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Navbar2 />
        <main className="flex-grow px-8 py-6">
          <div className="space-y-4 mb-10">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                Export Data
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {[
                { title: "Birds", value: 50000, icon: <Feather size={24} className="text-gray-700" /> },
                { title: "Houses Monitored", value: 10, icon: <Home size={24} className="text-gray-700" /> },
                { title: "Diagnoses", value: 1000, icon: <Stethoscope size={24} className="text-gray-700" /> },
                { title: "Staff", value: 200, icon: <Users size={24} className="text-gray-700" /> },
              ].map((sensor, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-full sm:w-56 h-24 p-4 shadow rounded-lg"
                >
                  <CardHeader className="flex justify-between p-0">
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="text-gray-700 text-sm">{sensor.title}</CardTitle>
                      {sensor.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl text-gray-800 mt-1 font-bold">{sensor.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="pl-12 pr-28">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;

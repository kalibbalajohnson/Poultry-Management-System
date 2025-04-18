import Navbar2 from "../components/navBar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "chart.js/auto";
import Layout from "@/components/layout";
import { Feather, Home, Boxes, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query";
import { Staff } from "@/components/dataTable/staffColumns";
import { House } from "@/components/dataTable/houseColumns";
import { Batch } from "@/components/dataTable/batchColumns";

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
  const accessToken = localStorage.getItem('accessToken');
  const { data: staff = [] } = useQuery<Staff[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/user/staff', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch staff data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch staff data:', err);
        throw err;
      }
    },
    refetchInterval: 3000,
  });

  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ['houses'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/house', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch house data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch house data:', err);
        throw err;
      }
    },
    refetchInterval: 3000,
  });

  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ['batches'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/batch', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch batch data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch batch data:', err);
        throw err;
      }
    },
    refetchInterval: 3000,
  });

  const batchesCount = batches?.length;
  const birds = batches
    ?.filter((batch) => batch.isArchived !== true)
    .reduce((total, batch) => total + (batch.quantity || 0), 0);
  const housesCount = houses?.filter((house) => house.isMonitored === true).length;
  const staffCount = staff?.filter((person) => person.role === "Worker").length;

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
                { title: "Total Birds", value: birds, icon: <Feather size={24} className="text-gray-700" /> },
                { title: "Houses Monitored", value: housesCount, icon: <Home size={24} className="text-gray-700" /> },
                { title: "Batches", value: batchesCount, icon: <Boxes size={24} className="text-gray-700" /> },
                { title: "Workers", value: staffCount, icon: <Users size={24} className="text-gray-700" /> },
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

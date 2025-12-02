"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface AnalyticsData {
  totalCustomers: number;
  totalBookings: number;
  totalOrders: number;
  revenueGrowth: { month: string; value: number }[];
  bookingGrowth: { month: string; value: number }[];
  orderGrowth: { month: string; value: number }[];
}

export default function AdminReportsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch("https://curls-api.onrender.com/reports")  // Removed '/admin' prefix
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((json) => setData(json))
    .catch((err) => {
      console.error("Failed to fetch reports:", err);
      setError(err.message);
    });
}, []);
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Reports & Analytics</h1>
        <div className="text-red-500">Error loading reports: {error}. Please check backend server.</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Reports & Analytics</h1>
        <div>Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Reports & Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Customers" value={data.totalCustomers} />
        <StatCard title="Total Bookings" value={data.totalBookings} />
        <StatCard title="Total Orders" value={data.totalOrders} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AnalyticsChart title="Revenue Growth" data={data.revenueGrowth} />
        <AnalyticsChart title="Booking Growth" data={data.bookingGrowth} />
        <AnalyticsChart title="Order Growth" data={data.orderGrowth} />
      </div>
    </div>
  );
}

// ----------------------
// COMPONENTS
// ----------------------

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="shadow-md border-gray-200">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
}

function AnalyticsChart({
  title,
  data,
}: {
  title: string;
  data: { month: string; value: number }[];
}) {
  return (
    <Card className="shadow-md border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="h-64 w-full min-h-[16rem]">  {/* Added w-full and min-h */}
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>  {/* Added min props */}
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Payment {
  createdAt: string;
  amount: number;
  status?: "pending" | "succeeded" | "failed";
  type?: string;
  productName?: string;
  email?: string;
  user?: { email?: string };
  booking?: { bridalWig?: { wigName?: string }; email?: string };
  order?: { product?: { wigName?: string }; email?: string };
}

export default function AdminHome() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>(Array(12).fill(0));

  const adminName = "Francine";

 useEffect(() => {
  const loadDashboard = async () => {
    const token = localStorage.getItem("token");
    console.log("📦 Dashboard token:", token);

    if (!token) {
      console.log("❌ No token found, redirecting to login");
      window.location.href = "/login";
      return;
    }

    const res = await fetch(
      "https://curls-api.onrender.com/payments/admin/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📡 Dashboard response status:", res.status);

    if (!res.ok) {
      console.log("❌ Unauthorized dashboard access");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    setTotalRevenue(data.totalRevenue);
    setTotalBookings(data.totalBookings);
    setTotalOrders(data.totalOrders);
    setMonthlyTotals(data.monthlyTotals);
    setTransactions(data.recentPayments);
  };

  loadDashboard();
}, []);


  return (
    <div className="p-4 md:p-6 bg-white min-h-screen font-inter space-y-8">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#17181A]">
          Welcome Back, {adminName}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">Welcome to your Dashboard</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {/* REVENUE */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col">
          <span className="text-gray-600 text-sm">Revenue</span>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">
            MWK {totalRevenue.toLocaleString()}
          </p>
          <Link href="/admin/reports/revenue">
            <button className="mt-4 px-3 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              → View Report
            </button>
          </Link>
        </div>

        {/* TOTAL SALES */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col">
          <span className="text-gray-600 text-sm">Total Sales</span>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">{totalOrders}</p>
          <Link href="/admin/reports/sales">
            <button className="mt-4 px-3 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              → View Report
            </button>
          </Link>
        </div>

        {/* TOTAL RENTALS */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col">
          <span className="text-gray-600 text-sm">Total Rentals</span>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">{totalBookings}</p>
          <Link href="/admin/reports/rentals">
            <button className="mt-4 px-3 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              → View Report
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TRANSACTIONS TABLE */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 lg:col-span-2 overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-lg font-semibold text-black">Latest Transactions</h2>
            <Link href="/dashboard/transactions">
              <button className="px-3 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50 text-sm whitespace-nowrap">
                → View All Transactions
              </button>
            </Link>
          </div>

          <div className="divide-y divide-gray-200 min-w-[600px]">
            {transactions.slice(0, 6).map((tx: Payment, index: number) => {
              const productName =
                tx.booking?.bridalWig?.wigName ||
                tx.order?.product?.wigName ||
                tx.productName ||
                "Unknown";

              const email =
                tx.user?.email ||
                tx.email ||
                tx.booking?.email ||
                tx.order?.email ||
                "—";

              return (
                <div key={index} className="py-3 grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 text-sm items-center">
                  {/* Date */}
                  <span className="text-gray-500 whitespace-nowrap text-xs sm:text-sm">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      : "—"}
                  </span>

                  {/* Product Name */}
                  <span className="font-medium text-gray-700 truncate">{productName}</span>

                  {/* Type */}
                  <span className="capitalize text-gray-700 whitespace-nowrap">{tx.type || "—"}</span>

                  {/* Email */}
                  <span className="text-gray-600 truncate">{email}</span>

                  {/* Status */}
                  <span className="whitespace-nowrap">
                    {tx.status === "succeeded" ? (
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">
                        Payment successful
                      </span>
                    ) : tx.status === "pending" ? (
                      <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-xs">
                        Pending
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">
                        Failed
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SALES ANALYTICS */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
          <div className="flex items-end gap-1 h-48 min-w-[300px]">
            {monthlyTotals.map((value, index) => {
              const max = Math.max(...monthlyTotals, 1);
              const barHeight = (value / max) * 100;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-4 md:w-6 bg-green-500 rounded transition-all"
                    style={{ height: `${barHeight}%`, opacity: 0.85 }}
                  ></div>
                  <span className="text-[9px] md:text-xs text-gray-400 mt-1">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

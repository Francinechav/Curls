"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  status: string;
  type: string;
  method: string;
  booking?: {
    firstName: string;
    lastName: string;
    bridalWig?: { wigName: string };
  };
  order?: {
    first_name: string;
    last_name: string;
    product?: { wigName: string };
  };
  user?: { email: string };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // empty = placeholder
  const [typeFilter, setTypeFilter] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const resPayments = await fetch(
          "http://localhost:8080/payments/admin/all"
        );
        const payData = await resPayments.json();
        setPayments(payData);

        const resRevenue = await fetch(
          "http://localhost:8080/payments/admin/total-revenue"
        );
        const revData = await resRevenue.json();
        setTotalRevenue(revData.totalRevenue);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchPayments();
  }, []);

  // FILTER LOGIC
  const filteredPayments = payments.filter((p) => {
    const fullName =
      (p.booking?.firstName || p.order?.first_name || "") +
      " " +
      (p.booking?.lastName || p.order?.last_name || "");

    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || p.status === statusFilter;

    const matchesType =
      !typeFilter || p.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 if filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Payments Management
      </h1>
      <p className="text-gray-500 mb-6">
        Track customer payments, revenue, and transactions
      </p>

      {/* TOTAL REVENUE */}
      <div className="mt-6 text-sm text-gray-700 font-medium">
        Total Revenue:{" "}
        <span className="font-semibold text-gray-900">MWK {totalRevenue}</span>
      </div>
      <br />

      {/* FILTERS CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-gray-800 font-medium mb-3">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-400 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent focus:outline-none flex-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status dropdown with placeholder */}
          <select
            className="bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
          </select>

          {/* Type dropdown with placeholder */}
          <select
            className="bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Select Payment Type</option>
            <option value="booking">Booking</option>
            <option value="order">Order</option>
          </select>
        </div>
      </div>

      {/* PAYMENTS TABLE CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Payments ({filteredPayments.length})
        </h2>
        <p className="text-gray-500 mb-4">View and manage all customer payments</p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b">
              <th className="py-3">Customer</th>
              <th className="py-3">Transaction ID</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
              <th className="py-3">Type</th>
              <th className="py-3">Product / Wig</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPayments.map((p) => {
              const customerFirst = p.booking?.firstName || p.order?.first_name;
              const customerLast = p.booking?.lastName || p.order?.last_name;
              const wigOrProduct =
                p.booking?.bridalWig?.wigName ||
                p.order?.product?.wigName ||
                "—";

              return (
                <tr
                  key={p.id}
                  className="border-b last:border-0 text-sm hover:bg-gray-50 border-gray-200"
                >
                  {/* CUSTOMER */}
                  <td className="py-4">
                    <div className="font-medium text-gray-900">
                      {customerFirst} {customerLast}
                    </div>
                    <div className="text-gray-500 text-xs">{p.user?.email}</div>
                  </td>

                  {/* TRANSACTION ID */}
                  <td className="py-4 text-gray-800">{p.transactionId}</td>

                  {/* AMOUNT */}
                  <td className="py-4 font-medium text-gray-900">MWK {p.amount}</td>

                  {/* STATUS BADGE */}
                  <td className="py-4">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                          p.status === "succeeded"
                            ? "bg-black text-white"
                            : p.status === "pending"
                            ? "bg-gray-200 text-gray-700"
                            : p.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* TYPE BADGE */}
                  <td className="py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      {p.type}
                    </span>
                  </td>

                  {/* PRODUCT / WIG */}
                  <td className="py-4 text-gray-700">{wigOrProduct}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

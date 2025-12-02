"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SpecialOrder {
  id: number;
  texture: string;
  colour: string;
  length: string;
  doubleDrawn?: boolean;
  highlight?: boolean;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  district?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phoneNumber?: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

// Delivery = 7 days from order date
const calculateDeliveryDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [breakpoint]);

  return isMobile;
}

export default function AdminSpecialOrdersPage() {
  const [orders, setOrders] = useState<SpecialOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [showWigModal, setShowWigModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SpecialOrder | null>(null);
  const itemsPerPage = 15;
  const isMobile = useIsMobile();

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://curls-api.onrender.com/special-orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: "pending" | "processing" | "completed" | "cancelled") => {
  await fetch(`https://curls-api.onrender.com/special-orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  setOrders((prev) =>
    prev.map((o) =>
      o.id === id ? { ...o, status: newStatus as SpecialOrder["status"] } : o
    )
  );
};


  const filteredOrders = orders.filter((o) => {
    const fullName = `${o.first_name || ""} ${o.last_name || ""}`.toLowerCase();
    const email = (o.email || "").toLowerCase();
    const searchMatch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === "All Status" || o.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">📦 Special Orders Admin</h1>
      <p className="text-gray-500 mb-6">Manage all special hair orders</p>

      {/* FILTERS */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-gray-800 font-medium mb-3">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 w-full">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent focus:outline-none flex-1 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>pending</option>
            <option>processing</option>
            <option>completed</option>
            <option>cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Orders ({filteredOrders.length})
        </h2>
        <p className="text-gray-500 mb-4 text-sm">
          Manage and view customer special orders
        </p>

        <table className="w-full min-w-[600px] sm:min-w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-300">
              <th className="py-2 px-1 sm:px-3">Customer</th>
              <th className="py-2 px-1 sm:px-3">Order Details</th>
              <th className="py-2 px-1 sm:px-3">Amount</th>
              <th className="py-2 px-1 sm:px-3">Delivery</th>
              <th className="py-2 px-1 sm:px-3">Status</th>
            
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o.id} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="py-2 px-1 sm:px-3">
                  <div className="font-medium text-gray-900 text-xs sm:text-sm">
                    {o.first_name} {o.last_name}
                  </div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">
                    {o.email} <br /> {o.phoneNumber}
                  </div>
                </td>

                <td className="py-2 px-1 sm:px-3 text-gray-700 text-xs sm:text-sm">
                  <p><strong>Texture:</strong> {o.texture}</p>
                  <p><strong>Colour:</strong> {o.colour}</p>
                  <p><strong>Length:</strong> {o.length}</p>
                  {o.doubleDrawn && <p>✨ Double Drawn</p>}
                  {o.highlight && <p>🎨 Highlight</p>}
                </td>

                <td className="py-2 px-1 sm:px-3 text-gray-900 font-medium text-xs sm:text-sm">
                  MWK {o.totalAmount.toLocaleString()}
                  <div className="text-gray-500 text-[10px] sm:text-xs">
                    Deposit: MWK {o.depositAmount.toLocaleString()}
                  </div>
                </td>

                <td className="py-2 px-1 sm:px-3 font-semibold text-green-700 text-xs sm:text-sm">
                  {calculateDeliveryDate(o.createdAt)}
                </td>

                <td className="py-2 px-1 sm:px-3">
                 <select
  value={o.status}
  onChange={(e) =>
    updateStatus(
      o.id,
      e.target.value as "pending" | "processing" | "completed" | "cancelled"
    )
  }
  className="border text-black rounded-lg px-2 py-1 text-xs sm:text-sm bg-white w-full"
>
  <option value="pending">pending</option>
  <option value="processing">processing</option>
  <option value="completed">completed</option>
  <option value="cancelled">cancelled</option>
</select>

                </td>

              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                  No orders match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex flex-wrap justify-center sm:justify-end mt-4 gap-2 text-sm">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">Page {currentPage} of {totalPages || 1}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showWigModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowWigModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Order Details
            </h2>
            <p className="text-gray-700 text-sm"><strong>Customer:</strong> {selectedOrder.first_name} {selectedOrder.last_name}</p>
            <p className="text-gray-700 text-sm"><strong>Email:</strong> {selectedOrder.email}</p>
            <p className="text-gray-700 text-sm"><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
            <p className="text-gray-700 text-sm"><strong>Texture:</strong> {selectedOrder.texture}</p>
            <p className="text-gray-700 text-sm"><strong>Colour:</strong> {selectedOrder.colour}</p>
            <p className="text-gray-700 text-sm"><strong>Length:</strong> {selectedOrder.length}</p>
            {selectedOrder.doubleDrawn && <p className="text-gray-700 text-sm">✨ Double Drawn</p>}
            {selectedOrder.highlight && <p className="text-gray-700 text-sm">🎨 Highlight</p>}
            <p className="text-gray-700 text-sm"><strong>Total:</strong> MWK {selectedOrder.totalAmount.toLocaleString()}</p>
            <p className="text-gray-700 text-sm"><strong>Deposit:</strong> MWK {selectedOrder.depositAmount.toLocaleString()}</p>
            <p className="text-gray-700 text-sm"><strong>Delivery:</strong> {calculateDeliveryDate(selectedOrder.createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

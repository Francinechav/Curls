"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Order {
  id: number;
  totalAmount: string;
  depositAmount: string;
  balanceAmount: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
  product?: InternationalProduct;
  user?: { id: number; email: string };
  payments?: any[];
}

interface InternationalProduct {
  id: number;
  wigName: string;
  Colour: string;
  lengths?: string[];
  description?: string;
  price: number;
  deliveryDays?: number;
  active?: boolean;
  imageUrl?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedWig, setSelectedWig] = useState<InternationalProduct | null>(null);
  const [showWigModal, setShowWigModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetch("https://curls-api.onrender.com/orders/admin/all")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error);
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch(`https://curls-api.onrender.com/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    setActiveOrderId(id);
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order.first_name.toLowerCase().includes(search) ||
      order.last_name.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search) ||
      order.phoneNumber.toLowerCase().includes(search) ||
      order.product?.wigName?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const finalOrders = (viewHistory
    ? filteredOrders.filter((o) => o.status === "completed")
    : filteredOrders.filter((o) => o.status !== "completed")
  ).sort((a, b) => b.id - a.id);

  const totalPages = Math.ceil(finalOrders.length / itemsPerPage);
  const paginatedOrders = finalOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, viewHistory]);

  const handleCloseModal = () => {
    setShowWigModal(false);
    setTimeout(() => setActiveOrderId(null), 200);
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
        Order Management
      </h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage all customer orders and payments
      </p>

      {/* FILTERS */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-gray-800 font-medium mb-3">Filters</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* SEARCH */}
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

          {/* STATUS */}
          <select
            className="bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>pending</option>
            <option>processing</option>
            <option>completed</option>
          </select>
        </div>
      </div>

      {/* HISTORY BUTTON */}
      <button
        onClick={() => setViewHistory(!viewHistory)}
        className="mb-4 px-4 py-2 rounded-lg bg-black text-white text-xs sm:text-sm hover:bg-gray-800 transition w-full sm:w-auto"
      >
        {viewHistory ? "Back to Active Orders" : "View Order History"}
      </button>

      {/* TABLE WRAPPER */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {viewHistory ? "Completed Orders" : "Orders"} ({finalOrders.length})
        </h2>
        <p className="text-gray-500 mb-4 text-sm">
          {viewHistory
            ? "Viewing all completed orders"
            : "Manage and view customer orders"}
        </p>

        <table className="w-full min-w-[600px] sm:min-w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-300">
              <th className="py-2 px-1 sm:px-3">Customer</th>
              <th className="py-2 px-1 sm:px-3">Product</th>
              <th className="py-2 px-1 sm:px-3">Total</th>
              <th className="py-2 px-1 sm:px-3">Status</th>
              <th className="py-2 px-1 sm:px-3">View</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr
                key={o.id}
                className={`border-b border-gray-300 last:border-0 hover:bg-gray-50 ${
                  activeOrderId === o.id ? "bg-gray-200" : ""
                }`}
              >
                <td className="py-2 px-1 sm:px-3">
                  <div className="font-medium text-gray-900 text-xs sm:text-sm">
                    {o.first_name} {o.last_name}
                  </div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">
                    {o.email}
                  </div>
                </td>

                <td className="py-2 px-1 sm:px-3 text-gray-700 text-xs sm:text-sm">
                  {o.product?.wigName || "—"}
                </td>

                <td className="py-2 px-1 sm:px-3 text-gray-900 font-medium text-xs sm:text-sm">
                  MWK {o.totalAmount}
                </td>

                <td className="py-2 px-1 sm:px-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border text-black rounded-lg px-2 py-1 text-xs sm:text-sm bg-white w-full"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="completed">completed</option>
                  </select>
                </td>

                <td className="py-2 px-1 sm:px-3 text-gray-700 flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center text-xs sm:text-sm">
                  {o.product?.wigName || "—"}
                  {o.product && (
                    <button
                      onClick={() => {
                        setSelectedWig(o.product ?? null);
                        setShowWigModal(true);
                        setActiveOrderId(o.id);
                      }}
                      className="text-[#856e91] underline"
                    >
                      View Wig
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {finalOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  {viewHistory
                    ? "No completed orders yet"
                    : "No orders match your filters"}
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

      {/* WIG MODAL */}
      {showWigModal && selectedWig && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
            >
              ✕
            </button>

            <h2 className="text-lg text-black font-semibold mb-2 break-words">
              {selectedWig.wigName}
            </h2>

            {selectedWig.imageUrl && (
              <img
                src={`https://curls-api.onrender.com${selectedWig.imageUrl}`}
                alt={selectedWig.wigName}
                className="mb-2 rounded-lg w-full object-cover max-h-60 mx-auto"
              />
            )}

            <p className="text-gray-600 text-sm mb-1">
              <strong>Colour:</strong> {selectedWig.Colour}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Lengths:</strong> {selectedWig.lengths?.join(", ") || "—"}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Price:</strong> MWK {selectedWig.price}
            </p>

            {selectedWig.description && (
              <p className="text-gray-600 text-sm mt-2 break-words">
                <strong>Description:</strong> {selectedWig.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

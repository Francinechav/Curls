"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Booking {
  id: number;
  bookingDate: string;
  amount: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bridalWig?: {
    wigName: string;
    imageUrl?: string;
    Colour?: string;
    lengths?: string[];
    price?: number;
    description?: string;
  };
  user?: { id: number; email?: string };
  payments?: any[];
  blockedDates?: { date: string; status: string }[];
}

// Hook to detect mobile screens
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

export default function AdminRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [wigFilter, setWigFilter] = useState("All Wigs");

  const [showWigModal, setShowWigModal] = useState(false);
  const [selectedWig, setSelectedWig] = useState<Booking["bridalWig"] | null>(null);
  const [activeBookingId, setActiveBookingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const isMobile = useIsMobile();

  useEffect(() => {
    fetch("http://localhost:8080/bookings/admin/all")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(console.error);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
    const email = b.email.toLowerCase();
    const searchMatch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "All Status" || b.status === statusFilter;
    const wigMatch = wigFilter === "All Wigs" || b.bridalWig?.wigName === wigFilter;
    return searchMatch && statusMatch && wigMatch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm, statusFilter, wigFilter]);

  const handleCloseModal = () => {
    setShowWigModal(false);
    setTimeout(() => setActiveBookingId(null), 200);
  };

  useEffect(() => {
    document.body.style.overflow = showWigModal && !isMobile ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showWigModal, isMobile]);

  return (
    <div className="p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        Wig Rental Management
      </h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage all wig bookings and rentals
      </p>

      {/* FILTERS */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-gray-800 font-medium mb-3">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full">
            <Search size={18} className="text-black" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent text-black focus:outline-none flex-1 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>pending</option>
            <option>confirmed</option>
          </select>

          <select
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 w-full"
            value={wigFilter}
            onChange={(e) => setWigFilter(e.target.value)}
          >
            <option>All Wigs</option>
            <option>Body wave</option>
            <option>Straight</option>
            <option>Water wave</option>
            <option>Kinky</option>
          </select>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Bookings ({filteredBookings.length})
        </h2>
        <p className="text-gray-500 mb-4 text-sm">
          Manage and view customer wig rental bookings
        </p>

        <table className="w-full min-w-[600px] sm:min-w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-300">
              <th className="py-2 px-1 sm:px-3">Customer</th>
              <th className="py-2 px-1 sm:px-3">Wig</th>
              <th className="py-2 px-1 sm:px-3">Booking Date</th>
              <th className="py-2 px-1 sm:px-3">Amount</th>
              <th className="py-2 px-1 sm:px-3">Status</th>
              <th className="py-2 px-1 sm:px-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedBookings.map((b) => (
              <tr
                key={b.id}
                className={`border-b border-gray-200 last:border-0 text-sm hover:bg-gray-50 ${
                  activeBookingId === b.id ? "bg-gray-100" : ""
                }`}
              >
                <td className="py-2 px-1 sm:px-3">
                  <div className="font-medium text-gray-900 text-xs sm:text-sm">
                    {b.firstName} {b.lastName}
                  </div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">{b.email}</div>
                </td>
                <td className="py-2 px-1 sm:px-3 text-gray-700 text-xs sm:text-sm">{b.bridalWig?.wigName || "—"}</td>
                <td className="py-2 px-1 sm:px-3 text-gray-700 text-xs sm:text-sm">{b.bookingDate}</td>
                <td className="py-2 px-1 sm:px-3 font-medium text-gray-900 text-xs sm:text-sm">MWK {b.amount}</td>
                <td className="py-2 px-1 sm:px-3">
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${b.status === "confirmed" ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="py-2 px-1 sm:px-3">
                  {b.bridalWig && (
                    <button
                      onClick={() => { setSelectedWig(b.bridalWig!); setShowWigModal(true); setActiveBookingId(b.id); }}
                      className="text-[#856e91] text-xs sm:text-sm underline"
                    >
                      View Wig
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                  No bookings match your filters
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

      {/* WIG MODAL */}
      {selectedWig && (
        isMobile ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4 shadow">
            <h2 className="text-lg font-semibold mb-3">{selectedWig.wigName}</h2>
            {selectedWig.imageUrl && (
              <img src={`http://localhost:8080${selectedWig.imageUrl}`} alt={selectedWig.wigName} className="w-full rounded-lg mb-3 object-cover" />
            )}
            <div className="text-gray-700 text-sm space-y-2">
              {selectedWig.Colour && <p><strong>Colour:</strong> {selectedWig.Colour}</p>}
              {selectedWig.lengths && <p><strong>Lengths:</strong> {selectedWig.lengths.join(", ")}</p>}
              {selectedWig.price && <p><strong>Price:</strong> MWK {selectedWig.price}</p>}
              {selectedWig.description && <p><strong>Description:</strong> {selectedWig.description}</p>}
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg max-h-[90vh] overflow-auto relative">
              <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl">✕</button>
              <h2 className="text-lg font-semibold mb-3">{selectedWig.wigName}</h2>
              {selectedWig.imageUrl && (
                <img src={`http://localhost:8080${selectedWig.imageUrl}`} alt={selectedWig.wigName} className="w-full rounded-lg mb-3 object-cover" />
              )}
              <div className="text-gray-700 text-sm space-y-2">
                {selectedWig.Colour && <p><strong>Colour:</strong> {selectedWig.Colour}</p>}
                {selectedWig.lengths && <p><strong>Lengths:</strong> {selectedWig.lengths.join(", ")}</p>}
                {selectedWig.price && <p><strong>Price:</strong> MWK {selectedWig.price}</p>}
                {selectedWig.description && <p><strong>Description:</strong> {selectedWig.description}</p>}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

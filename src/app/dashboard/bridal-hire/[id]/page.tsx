"use client";

import { use, useEffect, useState } from "react";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BridalWig = {
  id: number;
  wigName: string;
  lengths: string[];
  price: number;
  discount?: number;
  imageUrl?: string;
  description?: string;
  product?: { id: number };
};

type Booking = {
  id: number;
  bookingDate: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function AdminWigDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [wig, setWig] = useState<BridalWig | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWigModal, setShowWigModal] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // Fetch wig details
        const wigRes = await fetch(`https://curls-api.onrender.com/bridal-hire/${id}`);
        if (!wigRes.ok) throw new Error("Wig not found");
        const wigData = await wigRes.json();
        setWig(wigData);

        // Fetch bookings and sort by date (newest first)
        const bookingRes = await fetch(`https://curls-api.onrender.com/bookings/by-wig/${id}`);
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          const sortedBookings = Array.isArray(bookingData)
            ? bookingData.sort(
                (a, b) =>
                  new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
              )
            : [];
          setBookings(sortedBookings);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (loading)
    return <div className="p-10 text-gray-600 text-center">Loading...</div>;

  if (error || !wig)
    return <div className="p-10 text-red-500 text-center">Wig not found: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-[#faf7f9] font-sans">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      {/* Main Content: 2 columns */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Wig Image + Details */}
        <div className="flex flex-col text-black items-center md:w-1/3 bg-white shadow rounded-2xl p-4">
          <img
            src={wig.imageUrl ? `https://curls-api.onrender.com${wig.imageUrl}` : "/placeholder.jpg"}
            alt={wig.wigName}
            className="w-120 h-80 object-cover rounded-xl mb-4 cursor-pointer hover:scale-105 transition duration-300"
            onClick={() => setShowWigModal(true)}
          />
          <h1 className="text-xl font-bold text-center">{wig.wigName}</h1>
          {wig.description && (
            <p className="text-gray-600 mt-2 text-center text-sm">{wig.description}</p>
          )}
          <div className="mt-4 w-full text-center space-y-2 text-gray-700">
            <p>
              <span className="font-medium text-gray-500">Price: </span>
              MWK {wig.price}{" "}
              {wig.discount && (
                <span className="text-green-600 font-medium">({wig.discount}% off)</span>
              )}
            </p>
            <p>
              <span className="font-medium text-gray-500">Lengths: </span>
              {wig.lengths.join(", ")}
            </p>
            {wig.product && (
              <p>
                <span className="font-medium text-gray-500">Product ID: </span>
                {wig.product.id}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Bookings List */}
        <div className="flex-1 bg-white shadow rounded-2xl p-4 overflow-y-auto max-h-[70vh]">
          <h2 className="text-xl text-black font-bold mb-4">Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-black font-semibold text-sm">
                      {b.firstName} {b.lastName}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {b.email}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {b.phoneNumber}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-1 mt-1 md:mt-0">
                    <p className="text-gray-500 text-xs">
                      <strong>Date:</strong>{" "}
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(
                        b.status
                      )}`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Wig Modal */}
      {showWigModal && wig && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative shadow-xl">
            <button
              onClick={() => setShowWigModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
            >
              ✕
            </button>
            <img
              src={wig.imageUrl ? `https://curls-api.onrender.com${wig.imageUrl}` : "/placeholder.jpg"}
              alt={wig.wigName}
              className="rounded-xl w-full h-64 mb-4 object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">{wig.wigName}</h2>
            {wig.description && <p className="text-gray-600 mb-2">{wig.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type IntlWig = {
  id: number;
  wigName: string;
  Colour: string;
  lengths: string[];
  price: number;
  imageUrl?: string;
  description?: string;
  product?: { id: number };
  active: boolean;
};

type Order = {
  id: number;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  transactionId?: string | null;
  status: "pending" | "processing" | "completed";
};

export default function InternationalWigDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [wig, setWig] = useState<IntlWig | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWigModal, setShowWigModal] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // Fetch wig details
        const wigRes = await fetch(`https://curls-api.onrender.com/international-products/${id}`);
        if (!wigRes.ok) throw new Error("Wig not found");
        const wigData = await wigRes.json();
        setWig(wigData);

        // Fetch orders regardless of wig.active
        const orderRes = await fetch(`https://curls-api.onrender.com/orders/by-wig/${id}`);
        if (orderRes.ok) {
          const orderData: Order[] = await orderRes.json();
          // Sort newest first
          const sortedOrders = orderData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setOrders(sortedOrders);
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
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (loading)
    return <div className="p-10 text-gray-600 text-center">Loading...</div>;
  if (error || !wig)
    return <div className="p-10 text-red-500 text-center">Wig not found: {error}</div>;

  const statusText = wig.active ? "Available" : "Sold";

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
            <p><span className="font-medium text-gray-500">Colour: </span>{wig.Colour}</p>
            <p><span className="font-medium text-gray-500">Lengths: </span>{wig.lengths.join(", ")}</p>
            <p><span className="font-medium text-gray-500">Price: </span>MWK {wig.price}</p>
            <p>
              <span className="font-medium text-gray-500">Status: </span>
              <span className={wig.active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {statusText}
              </span>
            </p>
            {wig.product && <p><span className="font-medium text-gray-500">Product ID: </span>{wig.product.id}</p>}
          </div>
        </div>

        {/* Right Column: Orders List */}
        {!wig.active && (
          <div className="flex-1 bg-white shadow rounded-2xl p-4 overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl text-black font-bold mb-4">Order Details ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No order info found.</p>
            ) : (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="text-black font-semibold text-sm">{order.customerName}</p>
                      <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                      <p className="text-gray-500 text-xs">{order.customerPhone}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-1 mt-1 md:mt-0 text-gray-500 text-xs">
                      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                      {order.transactionId && <p><strong>Txn ID:</strong> {order.transactionId}</p>}
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
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

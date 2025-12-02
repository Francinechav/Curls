"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Package,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txRef) return;

      try {
        const res = await fetch(
          `https://curls-api.onrender.com/payments/verify/${txRef}`
        );
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error("Error verifying payment:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [txRef]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Verifying your payment...
      </div>
    );
  }

  if (!orderData || orderData.paychangu_status !== "success") {
    return (
      <div className="flex justify-center items-center h-screen flex-col text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
        <p className="text-gray-700 max-w-md">
          We couldn’t verify your payment. Please try again or contact support.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-pink-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors"
        >
          Go back to Home
        </a>
      </div>
    );
  }

  const order = orderData.payment?.order;

  return (
    <section className="min-h-screen bg-white py-10 px-4 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl max-w-5xl w-full p-6 md:p-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle className="text-[#856e91] w-10 h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#856e91]">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-sm">
              Transaction Reference: <strong>{txRef}</strong>
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE — PRODUCT IMAGE + STATUS */}
          <div className="flex flex-col">

            {order?.product?.imageUrl && (
              <div className="rounded-xl overflow-hidden border shadow-sm">
                <img
                  src={`https://curls-api.onrender.com${order.product.imageUrl}`}
                  alt={order.product.wigName}
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            <div className="mt-4 text-center">
              <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                Payment Confirmed
              </span>
            </div>

            <button
              className="mt-6  bg-[#856e91] hover:bg-[#594a61] text-white py-3 rounded-xl font-semibold transition"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </button>
          </div>

          {/* RIGHT SIDE — ORDER SUMMARY */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-[#856e91] mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-700">

              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Total Price:</strong> MWK {order.totalAmount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Deposit Paid:</strong> MWK {order.depositAmount}
                </p>
              </div>

              <p>
                <strong>Colour:</strong> {order.product?.Colour}
              </p>
              <p>
                <strong>Length:</strong>{" "}
                {order.product?.lengths?.join(", ")} inches
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p>
                  <strong>First Name:</strong> {order.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {order.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phoneNumber}
                </p>

                <p>
               <strong>District:</strong> {order.district || "N/A"}
               </p>
              </div>

              <p className="mt-4 text-sm italic text-gray-500">
                A confirmation email has been sent to{" "}
                <strong>{order.email}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

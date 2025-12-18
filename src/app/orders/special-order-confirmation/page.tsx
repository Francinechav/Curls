"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, CreditCard, Package, Info } from "lucide-react";

interface SpecialOrder {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
  district?: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  deliveryWindowDays: number;
  texture: string;
  colour: string;
  length: string;
  description?: string;
}

interface VerifyPaymentResponse {
  paychangu_status: "success" | "failed" | "pending";
  order: SpecialOrder | null;
  orderType: "special" | "normal" | null;
}



export default function SpecialOrderConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");

 const [orderData, setOrderData] =
  useState<VerifyPaymentResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txRef) return;

      try {
        const res = await fetch(
          `https://curls-api.onrender.com/payments/verify/${txRef}`
        );
        const data = await res.json();

console.log("🔍 FULL VERIFY RESPONSE:", data);
console.log("🧾 PAYMENT:", data?.payment);
console.log("✨ SPECIAL ORDER FROM RESPONSE:", data?.payment?.specialOrder);
console.log("📦 ORDER FROM RESPONSE:", data?.order);

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

  // Payment failed
  if (!orderData || orderData.paychangu_status !== "success") {
    return (
      <div className="flex justify-center items-center h-screen flex-col text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
        <p className="text-gray-700 max-w-md">
          We couldn’t verify your payment for your special order.
        </p>

        {/* ❌ FIXED: replaced <a> with <Link> */}
        <Link
          href="/"
          className="mt-6 inline-block bg-pink-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

const order = orderData?.order ?? null;



if (!order) {
  return (
    <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
      Invalid order data.
    </div>
  );
}

  return (
    <section className="min-h-screen bg-white py-10 px-4 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle className="text-[#856e91] w-10 h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#856e91]">
              Special Order Confirmed!
            </h1>
            <p className="text-gray-600 text-sm">
              Transaction Reference: <strong>{txRef}</strong>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold text-[#856e91] mb-4">
            Special Order Summary
          </h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-500" />
              <p><strong>Order ID:</strong> {order.id}</p>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p><strong>Estimated Delivery:</strong> {order.deliveryWindowDays} days</p>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <p><strong>Total Price:</strong> MWK {order.totalAmount}</p>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <p><strong>Deposit Paid:</strong> MWK {order.depositAmount}</p>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <p><strong>Balance Remaining:</strong> MWK {order.balanceAmount}</p>
            </div>

            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-500" />
              <p><strong>Texture:</strong> {order.texture}</p>
            </div>

            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-500" />
              <p><strong>Color:</strong> {order.colour}</p>
            </div>

            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-500" />
              <p><strong>Length:</strong> {order.length}</p>
            </div>

            <p><strong>Description:</strong> {order.description}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p><strong>First Name:</strong> {order.first_name}</p>
              <p><strong>Last Name:</strong> {order.last_name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phoneNumber}</p>
              <p><strong>District:</strong> {order.district || "N/A"}</p>
            </div>

            <p className="mt-4 text-sm italic text-gray-500">
              A confirmation email has been sent to <strong>{order.email}</strong>.
            </p>

            {/* ❌ FIXED: removed window.location.href */}
            <button
              className="mt-6 bg-[#856e91] hover:bg-[#594a61] text-white py-3 rounded-xl font-semibold transition w-full"
              onClick={() => router.push("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

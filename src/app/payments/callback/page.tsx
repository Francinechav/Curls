export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "edge";


import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const txRef = searchParams.get("tx_ref");
    const type = searchParams.get("type");

    if (!txRef) {
      setStatus("Transaction reference missing.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
        try {
      const res = await fetch("https://curls-api.onrender.com/orders/admin/all");
      const data = await res.json();

        if (data.paychangu_status === "success") {
  setStatus("Payment successful! Redirecting to confirmation...");

  setTimeout(() => {
    if (type === "international") {
      router.push(`/orders/order-confirmation?tx_ref=${txRef}`);
    } else if (type === "special") {
      router.push(`/orders/special-order-confirmation?tx_ref=${txRef}`);
    } else {
      router.push(`/rent/booking-confirmation?tx_ref=${txRef}`);
    }
  }, 2000);

        } else if (data.paychangu_status === "pending") {
          setStatus("Payment is still pending. Please wait a few minutes.");
        } else {
          setStatus("Payment failed or cancelled. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Error verifying payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f9] px-6">
      <p className="text-2xl font-semibold text-gray-900">{status}</p>
      {!loading && (
        <button
          className="mt-6 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
          onClick={() => router.push("/rent")}
        >
          Go Back to Rent Page
        </button>
      )}
    </div>
  );
}

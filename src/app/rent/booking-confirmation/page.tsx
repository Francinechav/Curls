"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image"; 
import axios from "axios";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";




interface BridalWig {
  wigName: string;
  imageUrl?: string;
}

interface Booking {
  txRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bookingDate: string;
  amount: number;
  bridalWig?: BridalWig;
}


export default function BookingConfirmation() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!txRef) return;
try {
  const res = await axios.get<Booking>(
    `https://curls-api.onrender.com/bookings/by-txref/${txRef}`
  );
  setBooking(res.data);
} catch (err) {
  console.error(err);
} finally {
  setLoading(false);
}

    };

    fetchBooking();
  }, [txRef]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Verifying your booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col  justify-center items-center h-screen text-center px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Booking Not Found ❌
        </h1>
        <p className="text-gray-700">
          We could not find your booking. Please check your details or contact support.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-10 px-4 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl max-w-5xl w-full p-6 md:p-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle className="text-[#856e91] w-10 h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#856e91]">
              Your Booking is Confirmed!
            </h1>
            <p className="text-gray-600 text-sm">
              Booking Reference: <strong>{booking.txRef}</strong>
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="flex flex-col">

            {/* Wig Image */}
            {booking.bridalWig?.imageUrl && (
              <div className="rounded-xl overflow-hidden border shadow-sm">
                <Image
                  src={`https://curls-api.onrender.com${booking.bridalWig.imageUrl}`}
                  alt={booking.bridalWig.wigName}
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            {/* Status */}
            <div className="mt-4 text-center">
              <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>

            {/* Back Button */}
            <button
              className="mt-6  bg-[#856e91] hover:bg-[#594a61] text-white py-3 rounded-xl font-semibold transition"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </button>
          </div>

          {/* RIGHT SIDE — BOOKING SUMMARY */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Booking Summary
            </h2>

            <div className="space-y-4 text-gray-700">

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Name:</strong> {booking.firstName} {booking.lastName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Email:</strong> {booking.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Phone:</strong> {booking.phoneNumber}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Booking Date:</strong> {booking.bookingDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <p>
                  <strong>Amount Paid:</strong> MWK {booking.amount}
                </p>
              </div>

              {booking.bridalWig?.wigName && (
                <p>
                  <strong>Wig Booked:</strong> {booking.bridalWig.wigName}
                </p>
              )}

              <p className="text-sm italic text-gray-500 mt-4">
                A confirmation email has been sent to{" "}
                <strong>{booking.email}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

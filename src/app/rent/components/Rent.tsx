"use client";

import Image from "next/image"; 
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BridalHire {
  id: number;
  wigName: string;
  lengths: string[] | null;
  price: string;
  available: boolean;
  description?: string;
  imageUrl?: string;
}

interface BlockedBooking {
  date: string;
}
interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function Rent() {
  const [wigs, setWigs] = useState<BridalHire[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWig, setSelectedWig] = useState<BridalHire | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [filter, setFilter] = useState("All");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  


  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fields: (keyof Customer)[] = ["first_name", "last_name", "email", "phone"];


  // Fetch wigs
  useEffect(() => {
    const fetchWigs = async () => {
      try {
        const res = await fetch("https://curls-api.onrender.com/bridal-hire");
        const data = await res.json();
        setWigs(data);
      } catch (err) {
        console.error("Error fetching wigs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWigs();
  }, []);

  // Fetch blocked dates
  useEffect(() => {
    if (!selectedWig) return;
    const fetchDates = async () => {
      try {
        const res = await fetch(
          `https://curls-api.onrender.com/bookings/blocked/${selectedWig.id}`
        );
        const data = await res.json();
        const dates = data.map((b: BlockedBooking) => new Date(b.date + "T00:00:00"));
        setBlockedDates(dates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDates();
    setSelectedDate(null);
  }, [selectedWig]);

  // Handle payment
  const handlePayNow = async () => {
    if (!selectedWig || !selectedDate)
      return alert("Please select a wig and date.");

    if (!customer.first_name || !customer.last_name || !customer.email || !customer.phone)
      return alert("Fill all customer fields.");

    setSubmitting(true);

    try {
      const res = await fetch("https://curls-api.onrender.com/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bridal_hire",
          amount: parseFloat(selectedWig.price),
          currency: "MWK",
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phoneNumber: customer.phone,
          meta: {
            wigId: selectedWig.id,
            bookingDate: selectedDate.toISOString().slice(0, 10),
          },
        }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else alert("Payment failed");
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 FILTERING LOGIC
  const filteredWigs = filter === "All"
    ? wigs
    : wigs.filter((wig) =>
        wig.wigName.toLowerCase().includes(filter.toLowerCase())
      );

 useEffect(() => {
  if (modalOpen) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }
}, [modalOpen]);
 
      if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading wigs...
      </div>
    );
    

// Add this inside your Rent() component




  }

  return (
    <section className="min-h-screen bg-[#faf7f9] py-10 px-4 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <button className="px-6 py-2 bg-[#856e91] text-white rounded-full text-sm font-medium">
          Rent Now
        </button>

        <div className="flex gap-2 flex-wrap">
          {["All", "Kinky", "Straight", "Body wave", "Water wave"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                filter === f
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
     
      <h6 className="text-2xl sm:text-3xl font-semibold  text-gray-900 max-w-7xl mx-auto mt-6">
        Popular selection
      </h6>
      <h5 className="text-sm text-gray-500 ml-8  mt-1">Tap on a wig to select</h5>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

         {filteredWigs.map((wig) => (
 <div
  key={wig.id}
  onClick={() => {
    setSelectedWig(wig);
    setModalOpen(true);
  }}
    className="flex flex-col cursor-pointer"
  >
    {/* Wig image */}
    <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
      <Image
        src={wig.imageUrl ? `https://curls-api.onrender.com${wig.imageUrl}` : "/placeholder.png"}
        alt={wig.wigName}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Status & lengths */}
    <div className="flex gap-2 flex-wrap mt-3 items-center">
      <span
        className={`px-3 py-[6px] rounded-full text-xs font-medium ${
          wig.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {wig.available ? "Available" : "Unavailable"}
      </span>

      {wig.lengths?.map((len) => (
        <span
          key={len}
          className="px-3 py-[6px] rounded-full text-xs font-medium bg-gray-100 text-gray-700"
        >
          {len} Inches
        </span>
      ))}
    </div>

    {/* Name & price */}
    <p className="font-medium text-gray-900 text-sm sm:text-[15px] mt-2 leading-tight">
      {wig.wigName}
    </p>
    <p className="text-[16px] sm:text-[18px] font-bold text-gray-900 mt-1">
      MWK {parseFloat(wig.price).toLocaleString()}
    </p>

    {/* Smaller RENT NOW BUTTON */}
    {wig.available && (
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent the parent div click from double-firing
          setSelectedWig(wig);
          setModalOpen(true);
        }}
        className="mt-2 px-3 py-1 rounded-full bg-[#856e91] text-white text-sm font-medium hover:bg-[#6e5a78] transition w-max"
      >
        Rent Now
      </button>
    )}
  </div>
))}

        </div>

        {/* If filter returns 0 results */}
        {filteredWigs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No wigs match “{filter}”.
          </p>
        )}
      </div>

      {/* Modal */}
{/* MODAL */}
{modalOpen && selectedWig && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto"
    aria-modal="true"
    role="dialog"
  >
    <div className="flex justify-center items-start sm:items-center min-h-[100vh]">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden 
                   flex flex-col md:flex-row relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-40"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>

        {/* LEFT PANEL - Responsive Image Block */}
        <div className="md:w-1/2 bg-gray-50 p-4 sm:p-5 border-b md:border-b-0 md:border-r overflow-y-auto">

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            {selectedWig.wigName}
          </h2>

          {/* RESPONSIVE IMAGE CONTAINER */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm">
  <Image
    src={selectedWig.imageUrl ? `https://curls-api.onrender.com${selectedWig.imageUrl}` : "/placeholder.png"}
    alt={selectedWig.wigName}
    className="w-full h-full object-cover"
  />
</div>


          {/* Price */}
          <div className="mt-6 space-y-1">
            <p className="text-gray-800 font-medium text-base sm:text-lg">Rental Price</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#856e91]">
              MWK {parseFloat(selectedWig.price).toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">* 3-day hire price</p>
          </div>

          {/* Availability Tag */}
          <div className="mt-4">
            <span
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${
                selectedWig.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedWig.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-1/2 p-4 sm:p-5overflow-y-auto">
          
          {/* Date picker */}
          <div className="mb-4">
            <p className="font-semibold text-black mb-2 text-sm sm:text-base">Select Booking Date</p>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              excludeDates={blockedDates}
              placeholderText="Pick a date"
              className="border rounded-xl p-3 w-full text-gray-500 text-sm sm:text-base focus:ring-2 focus:ring-[#856e91]"
            />
          </div>

          {/* Customer form */}
          {/* Customer form */}
<div className="space-y-3 mb-6">
  {fields.map((field) => (
    <input
      key={field}
      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
      placeholder={field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
      className="border text-gray-600 border-gray-300 rounded-xl p-3 w-full 
                 text-sm sm:text-base focus:ring-2 focus:ring-[#856e91]"
      value={customer[field]}
      onChange={(e) => setCustomer({ ...customer, [field]: e.target.value })}
    />
  ))}
</div>


          {/* Pay Button */}
          {/* Terms & Conditions Checkbox */}
<div className="flex items-start gap-2 mb-4">
  <input
    type="checkbox"
    checked={agree}
    onChange={(e) => setAgree(e.target.checked)}
    className="mt-1 h-4 w-4"
  />
  <p className="text-sm text-gray-600">
    I accept and agree to the{" "}
    <button
  type="button"
  onClick={() => setShowTerms(true)}
  className="text-[#856e91] underline font-medium"
>
  Terms & Conditions
</button>

  </p>
</div>

{showTerms && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] p-4 flex justify-center items-start overflow-y-auto">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto">

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        onClick={() => setShowTerms(false)}
      >
        ✕
      </button>

      {/* CONTENT */}
       <h1 className="text-xl font-semibold">Terms & Conditions</h1>

          {/* START OF YOUR EXACT TEXT */}

          <section className="space-y-4 text-sm leading-relaxed">

            <h2 className="font-semibold text-lg">1. Introduction</h2>

            <p>1.1 These Terms & Conditions (“Agreement”) govern all transactions between Curls (“we”, “us”, “our”) and our customers (“you”, “your”) for (a) purchasing wigs (sales), and (b) hiring wigs (bridal rental).</p>

            <p>1.2 By placing an order with us (either for purchase or hire), you accept these terms in full.</p>

            <h2 className="font-semibold text-lg mt-6">2. Applicable Law</h2>

            <p>2.1 This Agreement is governed by the laws of the Republic of Malawi, including but not limited to:</p>

            <ul className="list-disc ml-5 space-y-1">
              <li>The Consumer Protection Act, 2003, which grants consumers rights to clear information, fair treatment, and prompt compensation for damages. (Malawi Legal Information Institute)</li>
              <li>The Sale of Goods Act, Chapter 48:01, which governs contracts for the sale of goods. (Malawi Legal Information Institute)</li>
              <li>The Electronic Transactions and Cyber Security Act, when contracts are made electronically, which requires that before concluding an electronic contract we disclose, among others: a description of the goods, full cost (including delivery), payment terms, delivery conditions, and refund policy. (Malawi Legal Information Institute)</li>
            </ul>

            <p>2.2 Under the Consumer Protection Act, any standard-form contract clauses that unfairly limit your consumer rights may be interpreted in your favor. (Malawi Legal Information Institute)</p>

            <p>2.3 We commit to providing goods that meet Malawi’s standards, aligning with obligations under consumer law. (WipoLex)</p>

            <h2 className="font-semibold text-lg mt-6">3. Definitions</h2>

            <ul className="list-disc ml-5 space-y-1">
              <li>Order: Your request to purchase or rent a wig, placed via our platform, in writing, or otherwise.</li>
              <li>Deposit / Advance Payment: The 50% of the total purchase price you pay up front to secure your wig order.</li>
              <li>Rental Period: For bridal hire, three days in total — the day before the event, the event day, and the day after.</li>
              <li>Late Return Penalty: A fixed fee (MWK 30,000) you owe if you do not return a hired wig when due.</li>
              <li>Approved Hairstylist: A hair professional that we have vetted and pre-approved to do installations during wig rental.</li>
            </ul>

            <h2 className="font-semibold text-lg mt-6">SERVICE 1) Wig Ordering – Terms</h2>

            <h3 className="font-semibold">4.1 Placing an Order</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>When you place an order to purchase a wig, you are required to pay 50% of the total price in advance (“deposit”) to secure the order and demonstrate your intent to buy.</li>
              <li>The balance (the remaining 50%) is due before dispatch/delivery (or as otherwise explicitly agreed).</li>
            </ul>

            <h3 className="font-semibold">4.2 Order Confirmation & Contract</h3>

            <p>• Once we receive your deposit, we will send an order confirmation in writing (email, WhatsApp, or whichever method was agreed). This constitutes acceptance of your order and forms a binding contract under the Sale of Goods Act.</p>

            <h3 className="font-semibold">4.3 Delivery Timeframe</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>We commit to delivering your wig within 14 working days from the date of your deposit/payment, unless we expressly agree on a different timeframe.</li>
              <li>If we fail to deliver within the 14 working days (or other agreed timeframe), you are entitled to an immediate refund of all funds paid (including the 50% deposit), unless you agree in writing to a new delivery date.</li>
            </ul>

            <h3 className="font-semibold">4.4 Refunds / Cancellations</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>In the event of a cancellation by you, before dispatch: we may retain a reasonable administrative fee (to be clearly disclosed), but we will refund the rest.</li>
              <li>If we cancel (e.g., we cannot supply your order), we will refund all amounts paid without undue delay.</li>
            </ul>

            <h3 className="font-semibold">4.5 Quality, Defects & Returns</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>You have the right to inspect the wig upon delivery. If there is a defect, you must notify us within a reasonable time. Under the Consumer Protection Act, you may be entitled to a replacement, repair, or refund. (FAOLEX)</li>
              <li>We will clearly describe the wig (materials, length, color, etc.) before you place your order, as required by consumer law. (Malawi Legal Information Institute)</li>
              <li>All wigs we supply will meet the relevant Malawi standards, where such standards apply. (WipoLex)</li>
            </ul>

            <h2 className="font-semibold text-lg mt-6">SERVICE 1) Wig Bridal Rental (Hire) – Terms</h2>

            <h3 className="font-semibold">5.1 Rental Duration & Fees</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>The standard hire period is three (3) days: the day before the event, the day of the event, and the day after the event.</li>
              <li>The rental fee will be clearly indicated in your hire agreement and agreed in writing before payment.</li>
            </ul>

            <h3 className="font-semibold">5.2 Payment for Hire</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>A security deposit (or part thereof) may be required; this will be agreed in writing prior to the rental.</li>
              <li>The rental fee (and deposit, if applicable) must be paid before we hand over the wig to you (or the approved stylist).</li>
            </ul>

            <h3 className="font-semibold">5.3 Approved Hairstylist Requirement</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>For installations (putting on or styling the wig), only pre-approved, reputable hairstylists may be used. We will provide a list of approved stylists, and you must choose from that list (unless otherwise agreed).</li>
              <li>If installation is done by someone other than our approved stylists, we may void part of the rental agreement or refuse liability for damage.</li>
            </ul>

            <h3 className="font-semibold">5.4 Return of Wig</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>The wig must be returned to us (or our specified address) by the end of the third day (the day after the event), in substantially the same condition as when handed over (fair wear and tear excepted).</li>
              <li>If you fail to return the wig by the due date, you will incur a penalty fee of MWK 30,000 per day (or a fixed fee, whichever we specify), unless otherwise agreed in writing.</li>
            </ul>

            <h3 className="font-semibold">5.5 Damage, Loss, or Excessive Wear</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>If the wig is damaged, lost, or excessively worn beyond reasonable use, you may be liable for repair costs, replacement cost, or a portion of the deposit.</li>
              <li>We will assess the condition and communicate any charges to you promptly.</li>
            </ul>

            <h3 className="font-semibold">5.6 Deposit Return</h3>

            <p>• After the wig is returned and inspected, we will return the security deposit (minus any damages / unpaid fees) within a reasonable time.</p>

            <h2 className="font-semibold text-lg mt-6">6. General Provisions</h2>

            <ul className="list-disc ml-5 space-y-1">
              <li>We acknowledge your rights under the Consumer Protection Act, including the right to clear information about prices, delivery, returns, and refunds. (WIPO)</li>
              <li>Our contracts and terms will be in clear, understandable language. The Consumer Protection Act requires that standard-form contracts not be unfair or ambiguous. (Malawi Legal Information Institute)</li>
              <li>We will issue you a written invoice, receipt, or business record for every transaction, including details of price, payment, delivery/return terms. (WipoLex)</li>
              <li>If the contract is made electronically (e.g., via online store, WhatsApp, email), we will comply with disclosure obligations under the Electronic Transactions Act: cost, delivery terms, refund policy, etc. (Malawi Legal Information Institute)</li>
              <li>We will retain records of the contract (for example, archived in our system) as required by law. (Malawi Legal Information Institute)</li>
              <li>We are liable for our obligations under this Agreement. However, we are not liable for any loss or damage caused by your use of the wig beyond normal wear, or by non-approved stylists (for hire).</li>
              <li>Our liability is subject to limits allowed by applicable law; we will not exclude liabilities disallowed by consumer protection law (e.g., gross negligence, fraud).</li>
              <li>In the event of a dispute, we prefer to resolve matters amicably. Please contact us first.</li>
              <li>You also have the right to pursue remedies under Malawian consumer law, including through the relevant authorities. Under the Consumer Protection Act, courts/competent authorities can order rescission, compensation, variation of contract terms, etc. (Malawi Legal Information Institute)</li>
              <li>If needed, the subordinate courts in Malawi have jurisdiction over consumer protection claims. (Malawi Legal Information Institute)</li>
              <li>We reserve the right to amend these Terms & Conditions. For existing orders or hires, we will not apply changes retroactively without your consent.</li>
            </ul>

          </section>

          {/* END OF YOUR EXACT FULL TEXT */}
        </div>
      </div>
)}


{/* Pay Button */}
<button
  disabled={!agree || submitting}
  className={`w-full py-3 rounded-xl font-semibold text-sm sm:text-base shadow transition 
    ${!agree 
      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
      : "bg-[#856e91] hover:bg-[#6e5a78] text-white"
    } 
    ${submitting ? "opacity-50 cursor-not-allowed" : ""}
  `}
  onClick={handlePayNow}
>
  {submitting ? "Processing..." : "Pay Now"}
</button>


        </div>
      </div>
    </div>
  </div>
)}

  
    </section>
  );
}

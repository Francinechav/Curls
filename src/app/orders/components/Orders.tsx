"use client";

import { useEffect, useState } from "react";
import SpecialOrderPricingTables from "../components/special-order-pricing";
import Image from "next/image"; 

interface InternationalProduct {
  id: number;
  wigName: string;
  lengths: string[];
  price: string;
  description?: string;
  active: boolean;
  imageUrl?: string;
}

interface SpecialOrder {
  texture: "" | Texture;
  colour: string;
  length: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  district: "",
  doubleDrawn?: boolean; // optional
  highlight?: boolean;   // optional
  comments?: string;

}


type Texture = "body_wave" | "straight" | "water_wave" | "kinky";

export default function Orders() {
  const [products, setProducts] = useState<InternationalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InternationalProduct | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<"international" | "special" | null>(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);



  // Customer info
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    district: "",
  });

  // Special Order info
 const [specialOrder, setSpecialOrder] = useState<SpecialOrder>({
  texture: "" as Texture | "",
  colour: "",
  length: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  district: "",
  doubleDrawn: false,
  highlight: false,
  comments: "",  
});

 
const customerFields: (keyof typeof customer)[] = ["first_name", "last_name", "email", "phone", "district"];
const specialFields: (keyof SpecialOrder)[] = ["first_name", "last_name", "email", "phone", "district"];


const SPECIAL_SHIPPING_FEE = 18000; 

const getSpecialOrderPrice = () => {
  const { texture, length, doubleDrawn, highlight } = specialOrder;
  if (!texture || !length) return 0;

  const len = parseInt(length);
  let basePrice = 0;

  // Body Wave & Straight
  if (texture === "body_wave" || texture === "straight") {
    const priceMap: Record<number, number> = {
      12: 395000,
      14: 425000,
      16: 455000,
      18: 485000,
      20: 515000,
      22: 545000,
      24: 575000,
      26: 605000,
      28: 655000,
      30: 705000
    };
    basePrice = priceMap[len] || 0;

    // Double Drawn add-on (only for straight in original)
    if (doubleDrawn && texture === "straight") {
      const increments = Math.floor((len - 12) / 2) + 1; // 12" counts as first step
      basePrice += increments * 55000;
    }
  }

  // Water Wave & Kinky
  if (texture === "water_wave" || texture === "kinky") {
    const priceMap: Record<number, number> = {
      14: 410000,
      16: 440000,
      18: 470000,
      20: 500000,
      22: 530000,
      24: 560000,
      26: 590000
    };
    basePrice = priceMap[len] || 0;
  }

  // Highlight add-on (any texture)
  if (highlight) {
    basePrice += 25000;
  }

  // Add the fixed shipping fee for special orders
  const totalWithShipping = basePrice + SPECIAL_SHIPPING_FEE;

  return totalWithShipping;
};


  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://curls-api.onrender.com/international-products");
        const data = await res.json();
        setProducts(data.filter((p: InternationalProduct) => p.active));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [modalOpen]);

  // Handle International Product Payment
  const handlePayNow = async () => {
  if (!selectedProduct) return alert("Please select a product.");
  if (!customer.first_name || !customer.last_name || !customer.email || !customer.phone ||
    !customer.district )
    return alert("Please fill in your contact details.");
  if (!agree) return alert("You must accept Terms & Conditions.");

  setPayLoading(true);

  try {
    const depositAmount = parseFloat(selectedProduct.price);

    const res = await fetch("https://curls-api.onrender.com/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "international",
        amount: depositAmount,
        currency: "MWK",
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phoneNumber: customer.phone,
        meta: { productId: selectedProduct.id, district: customer.district },
      }),
    });

    const data = await res.json();
    if (data.checkout_url) window.location.href = data.checkout_url;
    else alert("Failed to initiate payment.");
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setPayLoading(false);
  }
};


  // Handle Special Order Payment
const handleSpecialOrderPay = async () => {
  const { texture, colour, length, first_name, last_name, email, phone, district } = specialOrder;
  if (!texture || !colour || !length) return alert("Please fill texture, colour, and length.");
  if (!first_name || !last_name || !email || !phone || !district)
    return alert("Please fill contact details including district.");
  if (!agree) return alert("You must accept Terms & Conditions.");

  setPayLoading(true);

  try {
    const totalAmount = getSpecialOrderPrice();
    const depositAmount = totalAmount / 2;

    const res = await fetch("https://curls-api.onrender.com/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "special",
        amount: depositAmount,
        currency: "MWK",
        first_name,
        last_name,
        email,
        phoneNumber: phone,
        meta: {
          type: "special",
          texture,
          colour,
          length,
          totalPrice: totalAmount,
          shipping: SPECIAL_SHIPPING_FEE,
          deposit: depositAmount,
          district,
        },
      }),
    });

    const data = await res.json();
    if (data.checkout_url) window.location.href = data.checkout_url;
    else alert("Failed to initiate payment.");
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setPayLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <>
      {/* PAGE HEADER */}
      <section className="min-h-screen bg-[#faf7f9] py-10 px-4 sm:px-6 lg:px-12">
{/* HEADER / INTRO */}
<div className="max-w-6xl mx-auto mb-14 px-4 sm:px-6 lg:px-12">
  {/* Title */}
  <h1 className="text-4xl sm:text-5xl font-semibold text-[#856e91] mb-6 tracking-tight text-center sm:text-left">
    Our Wig Collection
  </h1>

  {/* Description */}
  <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center sm:text-left">
    At <span className="font-semibold text-[#856e91]">Curls</span>, every wig is carefully sourced 
    directly from <span className="font-semibold text-gray-900">Dragon City</span> — 
    Johannesburg’s largest premium human-hair wholesale super-hub. Each piece is hand-selected 
    by our personal shopper to ensure perfect texture, fullness, and finish.
  </p>

  {/* Sourcing & Delivery */}
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-[#856e91] mb-2">Sourcing & Delivery</h2>
    <p className="text-gray-600 leading-relaxed mb-4">
      We allow a maximum of <strong>14 calendar days</strong> for sourcing and cross-border transport into Malawi. 
      If your order is not delivered within this timeframe, you are entitled to a full refund on your deposit.
    </p>
    <p className="text-gray-700 text-lg leading-relaxed">
      Prices shown include wig cost + personal shopper fees. Shipping from South Africa → Malawi: MWK 18,000 (charged at checkout).{" "}
      <button
        onClick={() => setPricingModalOpen(true)}
        className="text-[#856e91] underline font-semibold hover:text-[#6b5475]"
      >
        VIEW PRICE LIST
      </button>
    </p>
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-10 mt-6 justify-center sm:justify-start">
    <button
      className="px-5 py-4 bg-[#856e91] text-white rounded-full font-semibold text-lg shadow-md hover:bg-[#6d5978] transition-all duration-300 mb-4 sm:mb-0"
      onClick={() => {
        setOrderType("special");
        setModalOpen(true);
      }}
    >
      Make a Special Order
    </button>

    <a
      href="/shop"
      className="px-8 py-4 bg-[#856e91] text-white rounded-full font-semibold text-lg shadow-md hover:bg-[#6d5978] transition-all duration-300 text-center"
    >
      Shop Available Wigs
    </a>
  </div>


<br></br>

<br></br>
<br></br>
  {/* Subheader */}
  <div className="sm:text-left">
    <h2 className="text-2xl  text-[#856e91] text-center font-bold mb-2">Or Shop Wigs Already in Stock</h2>
    <p className="text-gray-600 text-center mb-4">
      Browse our collection of ready-to-ship wigs available now. No waiting, just choose your style and get it delivered fast.
    </p>
  </div>
</div>


        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="cursor-pointer flex flex-col">
              <div
                className="w-full h-[350px] rounded-3xl overflow-hidden bg-gray-100"
                onClick={() => {
                  setSelectedProduct(product);
                  setOrderType("international");
                  setModalOpen(true);
                }}
              >
               <Image
  src={product.imageUrl || "/placeholder.png"}
  alt={product.wigName}
  className="w-full h-full object-cover"
/>

              </div>

              <p className="font-medium text-gray-900 mt-3">{product.wigName}</p>
              <p className="text-[18px] font-bold text-gray-900 mt-2">
                MWK {parseFloat(product.price).toLocaleString()}
              </p>

              <button
                className="mt-2 px-4 py-2 bg-[#856e91] text-white text-sm rounded-full hover:bg-[#594a61]"
                onClick={() => {
                  setSelectedProduct(product);
                  setOrderType("international");
                  setModalOpen(true);
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
  
      </section>

      {/* MODAL */}
{modalOpen && (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
    <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-4xl mx-auto flex flex-col md:flex-row relative
                    md:items-start overflow-visible">
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
        onClick={() => setModalOpen(false)}
      >
        ✕
      </button>

      {/* LEFT PANEL (Matches Rent Page Style) */}
      <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col justify-start items-center">

        {/* INTERNATIONAL PRODUCT */}
        {orderType === "international" && selectedProduct && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {selectedProduct.wigName} Wig
            </h2>

            <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm">
             <Image
  src={selectedProduct.imageUrl || "/placeholder.png"}
  alt={selectedProduct.wigName}
  className="w-full h-full max-h-[60vh] object-cover"
/>

            </div>

            <p className="mt-4 text-gray-800 font-medium">Full Price:</p>
            <p className="text-xl font-bold text-[#856e91]">
              MWK {parseFloat(selectedProduct.price).toLocaleString()}
            </p>
          </>
        )}

        {/* SPECIAL ORDER */}
        {orderType === "special" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Special Order
            </h2>

            <div className="w-full space-y-3">

              {/* Texture */}
              <select
                className="border p-3 rounded-xl w-full"
                value={specialOrder.texture}
                onChange={(e) =>
                  setSpecialOrder({ ...specialOrder, texture: e.target.value as Texture })
                }
              >
                <option value="">Select Texture</option>
                <option value="body_wave">Body Wave</option>
                <option value="straight">Straight</option>
                <option value="water_wave">Water Wave</option>
                <option value="kinky">Kinky</option>
              </select>

              {/* Colour */}
              <select
                className="border p-3 rounded-xl w-full"
                value={specialOrder.colour}
                onChange={(e) =>
                  setSpecialOrder({ ...specialOrder, colour: e.target.value })
                }
              >
                <option value="">Select Colour</option>
                <option value="brown_highlights">Brown Highlights</option>
              </select>

              {/* Length */}
              <select
                className="border p-3 rounded-xl w-full"
                value={specialOrder.length}
                onChange={(e) =>
                  setSpecialOrder({ ...specialOrder, length: e.target.value })
                }
              >
                <option value="">Select Length</option>
                {[12, 14, 16, 18, 20, 22, 24, 26, 28].map((len) => (
                  <option key={len} value={len}>
                    {len} inches
                  </option>
                ))}
              </select>

              {/* Add-ons */}
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={specialOrder.doubleDrawn}
                    onChange={(e) =>
                      setSpecialOrder({ ...specialOrder, doubleDrawn: e.target.checked })
                    }
                  />
                  Double Drawn
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={specialOrder.highlight}
                    onChange={(e) =>
                      setSpecialOrder({ ...specialOrder, highlight: e.target.checked })
                    }
                  />
                  Highlight
                </label>
              </div>

              {/* Price Box */}
              {specialOrder.length && specialOrder.texture && (
                <div className="mt-4 bg-white border p-4 rounded-2xl shadow-sm">
                  <p className="font-medium">Base Price:</p>
                  <p className="text-lg font-bold text-[#856e91]">
                    MWK {(getSpecialOrderPrice() - SPECIAL_SHIPPING_FEE).toLocaleString()}
                  </p>

                  <p className="mt-2 font-medium">Shipping:</p>
                  <p className="font-semibold">
                    MWK {SPECIAL_SHIPPING_FEE.toLocaleString()}
                  </p>

                  <p className="mt-2 font-medium">Total Price:</p>
                  <p className="text-lg font-bold text-[#856e91]">
                    MWK {getSpecialOrderPrice().toLocaleString()}
                  </p>

                  <p className="mt-2 font-medium">Deposit (50%):</p>
                  <p className="font-semibold">
                    MWK {(getSpecialOrderPrice() / 2).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Deposit will be 50% of total price.
            </p>
          </>
        )}
      </div>

      {/* RIGHT PANEL (FORM — Same Rent Page Style) */}
      <div className="md:w-1/2 p-6 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">

       {customerFields.map((field) => (
  <input
    key={field}
    type={
      field === "email"
        ? "email"
        : field === "phone"
        ? "tel"
        : "text"
    }
    placeholder={
      field === "first_name"
        ? "First Name"
        : field === "last_name"
        ? "Last Name"
        : field === "email"
        ? "Email"
        : field === "phone"
        ? "Phone Number"
        : "Enter Location (District)"
    }
    className="border p-3 rounded-xl w-full"
   value={
  orderType === "international"
    ? String(customer[field])
    : String(specialOrder[field as keyof SpecialOrder] ?? "")
}

    onChange={(e) =>
      orderType === "international"
        ? setCustomer({ ...customer, [field]: e.target.value })
        : setSpecialOrder({ ...specialOrder, [field]: e.target.value })
    }
  />
))}


        {/* TERMS */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <p className="text-sm text-gray-600">
            I accept the{" "}
            <button
              onClick={() => setShowTerms(true)}
              className="text-[#856e91] underline"
            >
              Terms & Conditions
            </button>
          </p>
        </div>

        {/* BUTTON */}
        <button
  disabled={!agree || payLoading}
  className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
    !agree || payLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#856e91] hover:bg-[#6b5475]"
  }`}
  onClick={orderType === "international" ? handlePayNow : handleSpecialOrderPay}
>
  {payLoading ? (
    <span className="animate-pulse">Loading...</span>
  ) : orderType === "international" ? (
    "Pay"
  ) : (
    "Pay Deposit"
  )}
</button>

      </div>
    </div>
  </div>
)}


{pricingModalOpen && (
  <div className="fixed inset-0 z-50 overflow-auto bg-black/50 p-4">
    <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative shadow-xl mx-auto max-h-[90vh] flex flex-col">
      
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-2xl"
        onClick={() => setPricingModalOpen(false)}
      >
        ✕
      </button>

      {/* MODAL HEADER */}
      <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Pricing Table</h2>

      {/* CONTENT */}
      <div className="overflow-auto">
        <SpecialOrderPricingTables />
      </div>
    </div>
  </div>
)}



      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] p-4 flex justify-center items-start overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowTerms(false)}
            >
              ✕
            </button>
            {/* Insert your long terms text here */}
            <h1 className="text-xl font-semibold mb-4">Terms & Conditions</h1>
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
          </div>
        </div>
      )}
    </>
  );
}

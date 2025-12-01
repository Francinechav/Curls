"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I pay for a wig order?",
    a: "You pay 50% in advance (deposit) when placing your order, and the remaining 50% before delivery (or as agreed).",
  },
  {
    q: "What happens if you cannot deliver within 14 working days?",
    a: "If we fail to deliver by the agreed date (maximum 14 working days), you are entitled to a full refund unless you agree to a new delivery date in writing.",
  },
  {
    q: "Can I cancel my order after paying the deposit?",
    a: "Yes, but cancellation terms apply. We may retain a reasonable administrative fee depending on how far your wig has progressed.",
  },
  {
    q: "What if the wig has a defect?",
    a: "Notify us immediately. Under Malawian consumer law, you may be entitled to repair, replacement, or a refund depending on the issue.",
  },
  {
    q: "For wig hire, do I get to keep the wig overnight?",
    a: "Yes. Wig hire lasts three days (day before event, event day, and day after).",
  },
  {
    q: "What if I don’t return the wig on time?",
    a: "A penalty fee of MWK 30,000 (or as in your contract) applies for late returns.",
  },
  {
    q: "Can I use any hairstylist during my hire?",
    a: "No — only our pre-approved hairstylists may install or style the wig to protect the unit.",
  },
  {
    q: "What condition should the wig be in when I return it?",
    a: "Return it in similar condition (fair wear and tear allowed). Damage or loss may attract repair or replacement charges.",
  },
  {
    q: "When will I get my security deposit back?",
    a: "After inspection of the returned wig. Refund is processed within a reasonable time minus any deductions.",
  },
  {
    q: "I paid electronically — can you archive our contract?",
    a: "Yes. Electronic contracts are archived as required by the Electronic Transactions and Cyber Security Act.",
  },
  {
    q: "What if I have a complaint or dispute?",
    a: "Contact us first. You also have rights under the Consumer Protection Act to seek redress with authorities or courts.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqq" className="w-full flex flex-col items-center py-20 px-4 md:px-8 lg:px-0 bg-white">
      {/* Title */}
      <p className="text-sm tracking-widest text-gray-500 uppercase">
        FAQ
      </p>

      <h2 className="text-3xl md:text-4xl font-serif text-black text-center mt-2 max-w-3xl">
        You’ve got questions. we’ve got{" "}
        <span className="text-yellow-500 font-serif">Answers</span>
      </h2>

      {/* FAQ List */}
      <div className="mt-16 w-full max-w-3xl space-y-6">
        {faqs.map((item, i) => (
          <div key={i} className="border-b border-gray-300 pb-4">
            {/* QUESTION ROW */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between text-black items-center text-left focus:outline-none"
            >
              <span className="text-gray-800 text-lg">{item.q}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ANSWER */}
            {openIndex === i && (
              <p className="mt-3 text-gray-600 leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Contact Us Button */}
      <div className="mt-12">
        <a
          href="/contactus"
          className="bg-[#856e91] hover:bg-[#594a61] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 text-center block md:inline-block"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}

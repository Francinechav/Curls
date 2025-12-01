"use client";

import React from "react";

interface PriceRow {
  length: string;
  price: string;
  note?: string;
}

export default function SpecialOrderPricingTables() {
  const straightAndBodyWaveBase: PriceRow[] = [
    { length: "12\"", price: "395,000" },
    { length: "14\"", price: "425,000" },
    { length: "16\"", price: "455,000" },
    { length: "18\"", price: "485,000" },
    { length: "20\"", price: "515,000" },
    { length: "22\"", price: "545,000" },
    { length: "24\"", price: "575,000" },
    { length: "26\"", price: "605,000" },
    { length: "28\"", price: "655,000", note: "(+50k increment applied)" },
    { length: "30\"", price: "705,000", note: "(+50k increment applied)" },
  ];

  const doubleDrawnAddon: PriceRow[] = [
    { length: "12\"", price: "55,000 per 2-inch length" },
    { length: "14\"", price: "55,000 per 2-inch length" },
    { length: "16\"", price: "55,000 per 2-inch length" },
    { length: "18\"", price: "55,000 per 2-inch length" },
    { length: "20\"", price: "55,000 per 2-inch length" },
    { length: "22\"", price: "55,000 per 2-inch length" },
    { length: "24\"", price: "55,000 per 2-inch length" },
    { length: "26\"", price: "55,000 per 2-inch length" },
    { length: "28\"", price: "55,000 per 2-inch length" },
    { length: "30\"", price: "55,000 per 2-inch length" },
  ];

  const highlightAddon: PriceRow[] = [
    { length: "All Lengths", price: "25,000 flat rate" },
  ];

  const deepKinkyBase: PriceRow[] = [
    { length: "14\"", price: "410,000" },
    { length: "16\"", price: "440,000" },
    { length: "18\"", price: "470,000" },
    { length: "20\"", price: "500,000" },
    { length: "22\"", price: "530,000" },
    { length: "24\"", price: "560,000" },
    { length: "26\"", price: "590,000" },
  ];

  const renderTable = (title: string, data: PriceRow[]) => (
    <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white mb-8">
      <h3 className="text-xl font-bold text-gray-900 px-4 py-3 bg-gray-100 border-b">
        {title}
      </h3>
      <table className="min-w-full text-gray-700">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-4 text-left font-semibold">Length (inches)</th>
            <th className="p-4 text-left font-semibold">Price (MWK)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-gray-200 hover:bg-gray-50 transition`}
            >
              <td className="p-4">{row.length}</td>
              <td className="p-4 font-medium">
                {row.price} {row.note && <span className="text-gray-500">{row.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Special Order Pricing
      </h2>

      {/* Straight & Body Wave Base */}
      {renderTable("STRAIGHT & BODY WAVE HAIR (BASE PRICING)", straightAndBodyWaveBase)}

      {/* Double Drawn Add-on */}
      {renderTable("DOUBLE-DRAWN (ADD-ON OPTION)", doubleDrawnAddon)}

      {/* Highlight Add-on */}
      {renderTable("COLOUR ADD-ON (HIGHLIGHT OPTION)", highlightAddon)}

      {/* Deep Kinky Curly Base */}
      {renderTable("DEEP KINKY CURLY TEXTURE (BASE PRICING)", deepKinkyBase)}

      <p className="mt-4 text-gray-600 text-sm text-center">
        Shipping (South Africa → Malawi Express Shipping): MWK 18,000
      </p>
    </div>
  );
}

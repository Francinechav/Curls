export default function Terms() {

  return (
    <div className="min-h-screen bg-[#d7d0e4] flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b">

          <div className="flex items-center gap-1">
            <span className="text-purple-600 font-medium border-b-2 border-purple-600">
              English
            </span>
          </div>
        </div>
   
        {/* CONTENT */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto text-gray-800 space-y-7">

          <h1 className="text-xl font-semibold">Terms & Conditions — Curls</h1>

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
    </div>
  );
}

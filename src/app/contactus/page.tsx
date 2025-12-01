"use client";
import { useState } from "react";
import Image from "next/image";

export default function Contactus() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Message sent!");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e7e0f1] flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-[40px] w-full max-w-6xl grid md:grid-cols-2 overflow-hidden shadow-xl">
        
        {/* LEFT IMAGE PANEL */}
        <div className="relative h-[600px] md:h-auto">
          <Image
            src="/three.jpg"
            alt="Curls Models"
            fill
            className="object-cover"
          />

          <div className="absolute bottom-10 left-10 text-white max-w-xs">
            <h2 className="text-4xl italic font-serif mb-2">Curls</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Experience unmatched quality, comfort, and beauty designed
              Experience unmatched quality, comfort, and beauty designed
            </p>

           
          </div>
        </div>

        {/* RIGHT CONTACT FORM */}
        <div className="p-10">
          <h2 className="text-4xl font-serif mb-3">Contact Us</h2>
          <p className="text-sm text-gray-600 mb-6">
            Have question or want assistance? Reach out to us,
            and our team will get back to you...
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                required
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                required
              />
            </div>

            {/* Email */}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-gray-100 outline-none"
              required
            />

            {/* Phone */}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 rounded-xl bg-gray-100 outline-none"
              required
            />

            {/* Message */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full p-3 rounded-xl bg-gray-100 outline-none h-32"
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full text-sm"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

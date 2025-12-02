"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";

type BridalWig = {
  id: number;
  wigName: string;
  lengths: string[];
  price: number;
  discount?: number;
  imageUrl?: string;
  description?: string;
  product: { id: number; type: string };
};

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

type IntlWig = {
  id: number;
  wigName: string;
  Colour: string;
  lengths: string[];
  price: number;
  imageUrl?: string;
  description?: string;
  product: { id: number; type: string };
  active: boolean;
};

type WigItem = BridalWig | IntlWig;


type ProductOption = { id: number; type: string };

function ProductCard({
  image,
  title,
  subtitle,
  badge,
  priceLabel,
  link,
}: {
  image: string;
  title: string;
  subtitle?: string;
  badge?: { text: string; variant: "green" | "red" };
  priceLabel?: string | JSX.Element;
  link: string;
})

{
  return (
    <article className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(15,15,15,0.06)]">
      {/* image area: use responsive container with fixed aspect (4:3) */}
      <div className="w-full relative bg-gray-100 flex items-center justify-center overflow-hidden">
        <div className="w-full" style={{ paddingTop: "75%" }}>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 leading-snug">
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 truncate" title={subtitle}>
            {subtitle}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-700 font-medium">{priceLabel}</div>

          <div className="flex items-center gap-3">
            {badge && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  badge.variant === "green"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {badge.text}
              </span>
            )}

            <a
              href={link}
              className="text-xs underline underline-offset-4 text-gray-700 hover:text-gray-900"
            >
              View details
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-0 shadow-[0_4px_18px_rgba(15,15,15,0.04)]">
      <div className="w-full" style={{ paddingTop: "75%" }} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text", placeholder = "", required = false }: FormInputProps)  {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-100"
      />
    </div>
  );
}

export default function AdminWigsPageFull() {
  const [activeTab, setActiveTab] = useState<"bridal" | "international">("bridal");
  const [bridalWigs, setBridalWigs] = useState<BridalWig[]>([]);
  const [internationalWigs, setInternationalWigs] = useState<IntlWig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");

  const [image, setImage] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productType, setProductType] = useState<"bridal_hire" | "international" | "">("");

  // Fixed formData: added Texture field
  const [formData, setFormData] = useState({
    Texture: "",
    wigName: "",
    Colour: "",
    lengths: "",
    price: "",
    description: "",
    discount: "",
    productId: "",
  });

  useEffect(() => {
    fetchData();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const bridalRes = await fetch("https://curls-api.onrender.com/bridal-hire/admin/all");
      const intlRes = await fetch("https://curls-api.onrender.com/international-products/admin/all");
      const bridalJson = await bridalRes.json();
      const intlJson = await intlRes.json();
      setBridalWigs(Array.isArray(bridalJson) ? bridalJson : bridalJson?.data ?? []);
      setInternationalWigs(Array.isArray(intlJson) ? intlJson : intlJson?.data ?? []);
    } catch (err) {
      console.error("Fetch wigs error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("https://curls-api.onrender.com/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products ?? []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      Texture: "",
      wigName: "",
      Colour: "",
      lengths: "",
      price: "",
      description: "",
      discount: "",
      productId: "",
    });
    setImage(null);
    setProductType("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productType) return alert("Please select a product type.");
    if (!formData.productId) return alert("Please select a product.");
    if (!formData.Texture || !formData.lengths || !formData.price)
      return alert("Required fields missing.");

    const submissionData = new FormData();
    submissionData.append("wigName", formData.Texture); // Texture maps to wigName
    submissionData.append("lengths", formData.lengths);
    submissionData.append("price", formData.price);
    submissionData.append("description", formData.description);
    submissionData.append("productId", formData.productId);
    if (productType === "bridal_hire") {
      if (formData.discount) submissionData.append("discount", formData.discount);
    } else {
      submissionData.append("Colour", formData.Colour);
    }
    if (image) submissionData.append("image", image);

    const endpoint =
      productType === "bridal_hire"
        ? "https://curls-api.onrender.com/bridal-hire/add"
        : "https://curls-api.onrender.com/international-products/upload";

    try {
      const res = await fetch(endpoint, { method: "POST", body: submissionData });
      if (!res.ok) throw new Error("Server error");
      alert("Wig Added Successfully!");
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Failed to add wig: " + (err as Error).message);
    }
  };

  const activeList = activeTab === "bridal" ? bridalWigs : internationalWigs;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...activeList];

    if (q) {
  const query = q.toLowerCase();

  list = list.filter((item: WigItem) => {
    const name = item.wigName?.toLowerCase() || "";
   const colour =
  "Colour" in item && item.Colour
    ? item.Colour.toLowerCase()
    : "";
 // Only IntlWig has this
    const lengths = item.lengths?.join(", ").toLowerCase() || "";

    return (
      name.includes(query) ||
      colour.includes(query) ||
      lengths.includes(query)
    );
  });
}

    if (sort === "price-asc") {
  list.sort((a: WigItem, b: WigItem) => {
    return a.price - b.price
;
  });
}

if (sort === "price-desc") {
  list.sort((a: WigItem, b: WigItem) => {
    return a.price - b.price
;
  });
}

return list;

  }, [activeList, query, sort]);

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 md:p-10">
      <header className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Wigs Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Curate, upload and manage bridal & international wigs.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-[#856e91] hover:bg-[#594a61] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:brightness-95 transition self-start sm:self-auto"
          >
            + Add Wig
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex gap-2 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("bridal")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
                activeTab === "bridal"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600"
              }`}
            >
              Bridal Hire
            </button>
            <button
              onClick={() => setActiveTab("international")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
                activeTab === "international"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600"
              }`}
            >
              International
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            <label className="text-sm text-gray-500">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="new">Newest</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="relative w-full sm:w-72 md:w-96">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wigs, colour or length..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              ⌕
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `${filtered.length} items`}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto mt-6 sm:mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            No wigs found. Try adjusting search or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((item: any) => {
              const isIntl = activeTab === "international";
              const title = item.wigName;
              const subtitle = activeTab === "international" && "Colour" in item
  ? `Colour: ${item.Colour} • ${item.lengths.join(", ")} inches`
  : `Length: ${item.lengths.join(", ")} inches`;
              const priceLabel = isIntl
                ? `£${item.price}`
                : `£${item.price}${item.discount ? ` • £${item.discount} Member` : ""}`;
             const badge =
  activeTab === "international" && "active" in item
    ? {
        text: item.active ? "Available" : "Sold",
        variant: item.active ? ("green" as const) : ("red" as const),
      }
    : undefined;


              const imageSrc = item.imageUrl
                ? `https://curls-api.onrender.com${item.imageUrl}`
                : "/placeholder.jpg";
              const link = isIntl
                ? `/dashboard/international/${item.id}`
                : `/dashboard/bridal-hire/${item.id}`;

              return (
                <ProductCard
                  key={item.id}
                  image={imageSrc}
                  title={title}
                  subtitle={subtitle}
                  badge={badge}
                  priceLabel={priceLabel}
                  link={link}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Modal (responsive + scroll-safe) */}
     {showModal && (
  <div className="fixed inset-0 z-50 flex justify-center items-start md:items-center bg-black/40 overflow-y-auto p-4 sm:p-6">
    <div className="bg-white w-full max-w-xl sm:max-w-2xl md:max-w-4xl rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 border-b border-gray-100">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Add new wig</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create a listing for bridal or international products.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
          className="text-gray-500 hover:text-gray-800 text-3xl md:text-2xl mt-2 md:mt-0"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[80vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6"
        >
          {/* LEFT SECTION */}
          <div className="md:col-span-2 space-y-4 sm:space-y-5">

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setProductType("bridal_hire")}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                    productType === "bridal_hire"
                      ? "bg-[#856e91] border-[#856e91] text-white"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  Bridal hire
                </button>

                <button
                  type="button"
                  onClick={() => setProductType("international")}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                    productType === "international"
                      ? "bg-[#856e91] border-[#856e91] text-white"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  International
                </button>
              </div>
            </div>

            {/* Form fields based on type */}
            {productType && (
              <>
                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3"
                  >
                    <option value="">Select product</option>
                    {products
                      .filter((p) => {
                        const normalized = p.type?.toLowerCase();
                        return productType === "bridal_hire"
                          ? normalized?.includes("bridal")
                          : normalized?.includes("international");
                      })
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.type} – id {p.id}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput
                    label="Enter texture"
                    name="Texture"
                    value={formData.Texture}
                    onChange={handleInputChange}
                    required
                  />

                  {productType === "international" ? (
                    <FormInput
                      label="Colour"
                      name="Colour"
                      value={formData.Colour}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <FormInput
                      label="Discount (%)"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="0"
                    />
                  )}

                  <FormInput
                    label="Lengths (comma separated)"
                    name="lengths"
                    value={formData.lengths}
                    onChange={handleInputChange}
                    placeholder="12,14,16"
                    required
                  />

                  <FormInput
                    label="Price (local currency)"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    type="number"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3"
                    placeholder="Short description for the product"
                  />
                </div>
              </>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col gap-4">

            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>

            {/* Preview */}
            <div className="w-full h-44 sm:h-56 md:h-48 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-xs text-gray-400 px-2">
                  <div>Image preview</div>
                  <div className="text-[11px] mt-1">Recommended ratio: 4:3 or 3:2</div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!productType || !formData.productId}
              className="w-full py-3 rounded-xl bg-[#856e91] hover:bg-[#594a61] text-white font-semibold disabled:opacity-50 transition"
            >
              Add wig
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

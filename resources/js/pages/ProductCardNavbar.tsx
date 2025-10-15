import { useState } from "react";

export default function ProductCardNavbar() {
  const [active, setActive] = useState("Best Seller");

  const tabs = ["Best Seller", "Low Price", "High Price"];

  return (
    <div className="flex gap-2 px-10 py-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-4 text-2xl font-bold transition-transform duration-300 ${
            active === tab
              ? "text-black underline decoration-blue-500 decoration-2 underline-offset-4 scale-102"
              : "text-[#AFAFAF] hover:text-black hover:underline hover:decoration-blue-500 hover:underline-offset-4 hover:scale-102"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

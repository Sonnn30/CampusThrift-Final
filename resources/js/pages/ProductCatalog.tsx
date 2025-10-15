import ProductCatalogNavbar from "./ProductCatalogNavbar";
import ProductCard from "./ProductCard";
import ProductCardNavbar from "./ProductCardNavbar";
import { useEffect } from "react";

export default function ProductCatalog({ user, role, isLoggedIn, products }) {
    console.log(role)
  useEffect(() => {
    if (!user) {
      alert("Please Login First");
    }
  }, [user]);

  return (
    <div className="text-playfair-display">
      <ProductCatalogNavbar user={user} role={role} isLoggedIn={isLoggedIn} />
      <div className={!isLoggedIn ? "opacity-50 pointer-events-none" : ""}>
        <ProductCardNavbar />
        <ProductCard role={role} products={products}/>
      </div>
    </div>
  );
}

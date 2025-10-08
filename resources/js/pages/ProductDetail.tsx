import { useState } from "react";
import { usePage } from "@inertiajs/react";
import ProductCard_ProductGrid from "./ProductCard_ProductGrid";
import { Inertia } from "@inertiajs/inertia";

export default function ProductDetail() {
  const { props } = usePage();
  const { role = "Buyer", product = {}, otherProducts = [] } = props;

  // Ambil maksimal 5 gambar dari backend
  const images = Array.isArray(product?.images)
    ? product.images.slice(0, 5)
    : ["/placeholder.jpg"];

  // Default image
  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg");

  // Navigasi
  function goToSellerPage() {
    window.location.href = `/${role}/product`;
  }

  function goToEditPage() {
    if (product?.id) {
      Inertia.visit(`/Seller/product/edit/${product.id}`);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mx-auto px-6 py-10 space-y-10 bg-[#ECEEDF]">
      {/* Product Detail Section */}
      <div className="inline-flex max-w-[1274px] gap-10 mx-auto flex-wrap lg:flex-nowrap">
        {/* Left Section - Thumbnails */}
        <div className="flex gap-4 w-full lg:w-auto justify-center">
          <div className="flex flex-col justify-center items-center gap-3 min-h-[503px]">
            {images.map((img, i) => (
              <img
                key={i}
                src={img || "/placeholder.jpg"}
                alt={`Foto ${i}`}
                onClick={() => setSelectedImage(img)}
                className={`w-[105px] h-[89px] object-cover border cursor-pointer rounded-md ${
                  selectedImage === img ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <img
            src={selectedImage || "/placeholder.jpg"}
            alt="Foto Produk"
            className="w-[618px] h-[503px] object-cover border flex-shrink-0 rounded-md"
          />
        </div>

        {/* Right Section - Product Info */}
        <div className="relative w-full lg:w-[495px]">
          {role === "Seller" && (
            <div
              className="cursor-pointer absolute top-0 right-0"
              onClick={goToEditPage}
            >
              <img
                src="/edit.png"
                alt="edit"
                className="w-[40px] h-[40px] hover:scale-110 transition-transform"
              />
            </div>
          )}

          <h1 className="text-[40px] font-bold">
            {product?.name ?? "Product Name"}
          </h1>
          <p className="text-[36px] font-bold mb-2">
            Rp{Number(product?.price ?? 0).toLocaleString("id-ID")}
          </p>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold mb-1">Description:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Array.isArray(product?.description) ? (
                product.description.map((d, i) => <li key={i}>{d}</li>)
              ) : (
                <li>{product?.description ?? "No description provided."}</li>
              )}
            </ul>
          </div>

          {/* Shipping Information */}
          <div className="flex flex-col mb-6 -mt-2">
            <h2 className="font-semibold mb-2">Shipping Information</h2>
            <div className="flex flex-col text-sm text-gray-700 w-full max-w-[400px] min-w-50">
              {/* Shipping Methods */}
              <div className="mb-3 flex border rounded-lg overflow-hidden divide-x h-[66px]">
                {Array.isArray(product?.shipping?.method) &&
                product.shipping.method.length > 0 ? (
                  product.shipping.method.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 flex-1 px-3 py-2 bg-[#ECEEDF]"
                    >
                      <img
                        src={
                          m === "COD"
                            ? "/cash-on-delivery.png"
                            : "/pickup.png"
                        }
                        alt={m}
                      />
                      <span className="text-[20px]">{m}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500 w-full text-center">
                    No shipping methods available.
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex flex-col items-left justify-between border rounded-lg px-3 py-2 bg-[#ECEEDF] h-[101px]">
                <div
                  className="flex items-center justify-between mb-1 cursor-pointer"
                  onClick={goToSellerPage}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="/shop.png"
                      className="w-[27px] h-[27px]"
                      alt="shop"
                    />
                    <span>{product?.shipping?.seller ?? "Unknown Seller"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-800 text-sm">
                      ({product?.shipping?.ratings ?? 0}){" "}
                      {product?.shipping?.reviews ?? 0}K Reviews
                    </span>
                  </div>
                </div>
                <hr />
                <div className="flex items-center gap-2">
                  <img
                    src="/placeholder-2.png"
                    className="w-[27px] h-[27px]"
                    alt="location"
                  />
                  <span>
                    {product?.shipping?.location ?? "Location not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Another Items */}
      <div className="w-full px-6 py-4">
        <h1 className="text-[48px] font-bold mb-6">Another Item</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start justify-center">
          {Array.isArray(otherProducts) && otherProducts.length > 0 ? (
            otherProducts.map((p) => (
              <ProductCard_ProductGrid key={p.id} role={role} product={p} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Tidak ada produk lain untuk ditampilkan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

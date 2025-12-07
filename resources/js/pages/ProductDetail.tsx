import { useState } from "react";
import { usePage } from "@inertiajs/react";
import ProductCard_ProductGrid from "./ProductCard_ProductGrid";
import { Inertia } from "@inertiajs/inertia";
import useTranslation from "@/Hooks/useTranslation";
import ProductCatalogNavbar from "./ProductCatalogNavbar";

export default function ProductDetail() {
  const { props } = usePage();
  const { role = "Buyer", product: productRaw, otherProducts = [] } = props;
  const product: ProductType = productRaw as ProductType;
  const user = (props as any)?.auth?.user ?? props?.user ?? null;
  const isLoggedIn = Boolean(user);

  // CRITICAL: Check if current user is the product owner (only owner can edit)
  const isProductOwner = user && role === "Seller" && user.id === product?.seller_id;

  // Ambil maksimal 5 gambar dari backend
  const images = Array.isArray(product?.images)
    ? product.images.slice(0, 5)
    : ["/placeholder.jpg"];

    type ReviewType = {
      buyer: string;
      date: string;
      text: string;
      rating: number;
    };

    type ProductType = {
      id: number;
      name: string;
      price: number;
      description: string[];
      images: string[];
      seller_id?: number;
      shipping: {
        method: string[];
        seller: string;
        location: string;
        reviews: number;
        ratings: number;
      };
      reviews: ReviewType[];
    };

  // Default image
  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg");

  // Navigasi
  const getLocale = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})\//);
    return match ? match[1] : 'id';
  };

  function goToSellerPage() {
    const sellerId = product?.seller_id ?? null;
    const locale = getLocale();
    if (sellerId) {
      // Navigate to buyer-facing product listing filtered by seller id
      window.location.href = `/${locale}/Seller/product?user_id=${sellerId}`;
    } else {
      // fallback to current role's product page
      window.location.href = `/${locale}/${role}/product`;
    }
  }

  function goToEditPage() {
    if (product?.id) {
      const locale = getLocale();
      Inertia.visit(`/${locale}/Seller/product/edit/${product.id}`);
    }
  }

  function goToMakeAppointment() {
    if (role === "Buyer") {
      const locale = getLocale();
      window.location.href = `/${locale}/COD/date?product_id=${product.id}`;
    } else {
      alert("Just Buyer Can Make Appointment! Please Log In With Buyer Role");
    }
  }

  function goToChat() {
    const sellerId = product?.seller_id;
    const locale = getLocale();
    if (sellerId && role === "Buyer") {
      window.location.href = `/${locale}/Buyer/chat/${sellerId}`;
    } else if (sellerId && role === "Seller") {
      window.location.href = `/${locale}/Seller/chat/${sellerId}`;
    } else {
      alert("Chat not available");
    }
  }

  const {t} = useTranslation()
  return (
    <>
      <ProductCatalogNavbar user={user} role={role} isLoggedIn={isLoggedIn} compact />
    <div className="flex flex-col justify-center items-center mx-auto px-3 sm:px-4 md:px-6 pt-10 pb-6 md:pb-10 space-y-6 md:space-y-10 bg-[#ECEEDF] min-h-screen">

      {/* Product Detail Section */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left Section - Images */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:flex-1">
            {/* Thumbnails - Horizontal on mobile, Vertical on desktop */}
            <div className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img || "/placeholder.jpg"}
                  alt={`Foto ${i}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] lg:w-[105px] lg:h-[89px] object-cover border cursor-pointer rounded-md flex-shrink-0 ${
                    selectedImage === img ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Main Image - Responsive */}
            <div className="w-full lg:flex-1 flex justify-center">
              <img
                src={selectedImage || "/placeholder.jpg"}
                alt="Foto Produk"
                className="w-full max-w-[618px] h-[300px] sm:h-[400px] lg:h-[503px] object-cover border rounded-md shadow-lg"
              />
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="relative w-full lg:w-[495px] lg:flex-shrink-0">
            {/* CRITICAL: Only show edit button if user is the product owner */}
            {isProductOwner && (
              <div
                className="cursor-pointer absolute top-0 right-0 z-10"
                onClick={goToEditPage}
              >
                <img
                  src="/edit.png"
                  alt="edit"
                  className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] hover:scale-110 transition-transform"
                />
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold pr-10 lg:pr-0">
              {product?.name ?? "Product Name"}
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-[36px] font-bold mb-4 text-green-700">
              Rp{Number(product?.price ?? 0).toLocaleString("id-ID")}
            </p>

            {/* Description */}
            <div className="mb-4 lg:mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('Description')}:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                {Array.isArray(product?.description) ? (
                  product.description.map((d, i) => <li key={i}>{d}</li>)
                ) : (
                  <li>{product?.description ?? "No description provided."}</li>
                )}
              </ul>
            </div>

            {/* Shipping Information */}
            <div className="flex flex-col mb-4 lg:mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('Shipping')}</h2>
              <div className="flex flex-col text-sm text-gray-700 w-full">
                {/* Shipping Methods */}
                <div className="mb-3 flex border rounded-lg overflow-hidden divide-x min-h-[60px] lg:h-[66px]">
                  {Array.isArray(product?.shipping?.method) &&
                  product.shipping.method.length > 0 ? (
                    product.shipping.method.map((m, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 flex-1 px-2 sm:px-3 py-2 bg-[#ECEEDF]"
                      >
                        <img
                          src={
                            m === "COD"
                              ? "/cash-on-delivery.png"
                              : "/pickup.png"
                          }
                          alt={m}
                          className="w-[24px] h-[24px] sm:w-auto sm:h-auto"
                        />
                        <span className="text-sm sm:text-base lg:text-[20px] font-medium">{m}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 w-full text-center">
                      {t('NoShipping')}
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                <div className="flex flex-col justify-between border rounded-lg px-3 py-3 bg-[#ECEEDF] min-h-[101px]">
                  <div
                    className="flex items-center justify-between mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={goToSellerPage}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="/shop.png"
                        className="w-[24px] h-[24px] sm:w-[27px] sm:h-[27px]"
                        alt="shop"
                      />
                      <span className="text-sm sm:text-base font-medium truncate max-w-[150px] sm:max-w-none">
                        {product?.shipping?.seller ?? "Unknown Seller"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-gray-800 text-xs sm:text-sm">
                        ({product?.shipping?.ratings ?? 0}){" "}
                        <span className="hidden sm:inline">
                          {product?.shipping?.reviews ?? 0} {t('Reviews')}
                        </span>
                        <span className="sm:hidden">
                          {product?.shipping?.reviews ?? 0}
                        </span>
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src="/placeholder-2.png"
                      className="w-[24px] h-[24px] sm:w-[27px] sm:h-[27px]"
                      alt="location"
                    />
                    <span className="text-sm sm:text-base">
                      {product?.shipping?.location ?? "Location not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full">
              <div
                className="flex-1 border-2 rounded-lg h-[50px] sm:h-[60px] flex items-center justify-center bg-[#ECEEDF] text-lg sm:text-2xl lg:text-[32px] cursor-pointer hover:bg-[#e4e3dd] transition-colors font-semibold"
                onClick={goToMakeAppointment}
              >
                <button className="cursor-pointer px-2">
                  <span className="hidden sm:inline">{t('Make Appointment')}</span>
                  <span className="sm:hidden">Appointment</span>
                </button>
              </div>
              {role === "Buyer" && (
                <div
                  className="border-2 rounded-lg h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] flex items-center justify-center bg-[#ECEEDF] cursor-pointer hover:bg-[#e4e3dd] transition-colors flex-shrink-0"
                  onClick={goToChat}
                  title="Chat with Seller"
                >
                  <img src="/ProductCard_assets/chat.png" alt="chat" className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col w-full max-w-[1400px] mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{t('Reviews')}</h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
            product.reviews.map((rev: any, i: number) => (
              <div key={i} className="border rounded-lg p-3 sm:p-4 bg-white shadow-md w-[240px] sm:w-64 flex-shrink-0 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
                  <span className="font-semibold text-sm sm:text-base truncate">{rev.buyer ?? rev.reviewer?.name ?? 'Unknown'}</span>
                  <span className="text-gray-500 text-xs sm:text-sm">{rev.date ?? (rev.created_at ? new Date(rev.created_at).toLocaleDateString() : '')}</span>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm mb-2 line-clamp-3">{rev.text ?? rev.comment ?? ''}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-sm">{'⭐'.repeat(rev.rating ?? 0)}</span>
                  <span className="text-gray-500 text-xs">{(rev.rating ?? 0)}/5</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">{t('NoReview')}</p>
          )}
        </div>
      </div>

      {/* Another Items Section */}
      <div className="w-full max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-[48px] font-bold mb-4 lg:mb-6">{t('Another Item')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Array.isArray(otherProducts) && otherProducts.length > 0 ? (
            otherProducts.map((p) => (
              <ProductCard_ProductGrid key={p.id} role={role} product={p} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center text-sm sm:text-base">
              {t('NoProduct')}
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

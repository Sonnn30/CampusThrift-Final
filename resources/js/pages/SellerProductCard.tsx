import ProductCard_ProductGrid from './ProductCard_ProductGrid';

export default function SellerProductCard({ role, products }) {
    return (
        <div className="w-full min-h-[400px] bg-gray-50">
            {/* Container with responsive padding */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                {products && products.length > 0 ? (
                    <>
                        {/* Products Header */}
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                                Products ({products.length})
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                {role === "Seller" ? "Manage your product listings" : "Browse available products"}
                            </p>
                        </div>

                        {/* Product Grid - Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-15 md:gap-6 lg:gap-20 xl:gap-1 2xl:gap-10 items-start">
                            {products.map((product) => (
                                <ProductCard_ProductGrid
                                    key={product.id}
                                    role={role}
                                    product={product}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State - Enhanced & Responsive */
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
                        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
                            {/* Empty Icon */}
                            <div className="mb-6">
                                <svg
                                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>

                            {/* Empty Message */}
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                                No Products Yet
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                {role === "Seller"
                                    ? "Start selling by adding your first product!"
                                    : "This seller hasn't uploaded any products yet."}
                            </p>

                            {/* Action Button (Only for Seller) */}
                            {role === "Seller" && (
                                <button
                                    onClick={() => window.location.href = `/${role}/product/add`}
                                    className="w-full sm:w-auto px-6 py-3 bg-[#BBDCE5] hover:bg-[#A8D2E0] text-gray-800 font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Add Your First Product
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

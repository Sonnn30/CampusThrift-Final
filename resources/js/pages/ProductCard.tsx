import ProductCard_ProductGrid from './ProductCard_ProductGrid'

export default function ProductCard({role, products}) {
    console.log('[ProductCard] role', role, 'products length', Array.isArray(products) ? products.length : 0);
    return (
        <div className="w-full flex justify-around">
            {/* Responsive Grid Layout:
                - Mobile (< 640px): 1 column
                - Small Tablet (640px - 767px): 2 columns
                - Tablet (768px - 1023px): 3 columns
                - Laptop (1024px+): MAX 4 columns
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-10 sm:gap-y-6 md:gap-6 lg:gap-x-30 xl:gap-x-60 2xl:gap-x-8">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard_ProductGrid
                            key={product.id}
                            role={role}
                            product={product}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-sm sm:text-base">
                            No products available at the moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

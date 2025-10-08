import ProductCard_ProductGrid from './ProductCard_ProductGrid'

export default function ProductCard({role, products}) {
    console.log(role)
    return (
        <>
        <div className="w-full px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start justify-center">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard_ProductGrid
                            key={product.id}
                            role={role}
                            product={product}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">
                        Belum ada produk yang diupload.
                    </p>
                )}
            </div>
        </div>

        </>
    );
}

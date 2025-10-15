export default function ProductCard_ProductGrid({ role, product }) {
    function goToProductDetail() {
        window.location.href = `/${role}/ProductDetail/${product.id}`;
    }
    function goToChat() {
        window.location.href = `/${role}/chat`;
    }

    function goToMakeAppointment() {
        if (role === "Buyer") {
            window.location.href = `/COD/date?product_id=${product.id}`;
        } else {
            alert("Just Buyer Can Make Appointment! Please Log In With Buyer Role");
        }
    }

    return (
        <div className="flex flex-col gap-4 w-[350px] rounded-2xl border border-neutral-200 bg-neutral-100 p-5 shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(0,180,255,0.18)] cursor-pointer">
            {/* IMAGE */}
            <div className="w-full h-full flex flex-col justify-center items-center z-0" onClick={goToProductDetail}>
                <div className="mb-4 flex h-[200px] items-center justify-center max-[800px]:h-[160px] max-[575px]:h-[140px]">
                    <img
                        src={product.images?.[0] || '/ProductCard_assets/test-product1.jpg'}
                        alt={product.product_name}
                        className="max-h-full max-w-full rounded-lg"
                    />
                </div>
                <div className="flex flex-col items-start justify-center px-2 w-full">
                    {/* PRODUCT NAME */}
                    <div className="mb-1 text-lg font-semibold max-[1000px]:text-base max-[800px]:text-sm max-[575px]:text-sm">
                        {product.product_name}
                    </div>

                    {/* VERIFIED SELLER */}
                    <div className="flex w-fit flex-row items-center gap-1.5 rounded-full bg-[#7ED751] px-2 py-0.5 text-xs">
                        <img
                            src="/ProductCard_assets/correct.png"
                            alt="check"
                            className="h-[18px] w-[18px]"
                        />
                        <span className="font-medium">
                            Seller ID #{product.id}
                        </span>
                    </div>

                    {/* PRICE */}
                    <div className="mt-2 mb-2 text-base font-medium max-[1000px]:text-sm max-[575px]:text-xs">
                        Price: Rp{product.product_price.toLocaleString('id-ID')}
                    </div>
                </div>
            </div>

            {/* BUTTON */}
            <div className="flex w-full items-center justify-between rounded-xl border border-black bg-[#F3F2EC] px-2 py-2 text-sm font-medium transition duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e4e3dd] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                <button
                    className="flex-1 mr-2 rounded-lg px-3 py-1 text-center cursor-pointer text-[20px]"
                    onClick={goToMakeAppointment}
                >
                    Make Appointment
                </button>
                <img
                    src="/ProductCard_assets/chat.png"
                    alt="chat"
                    className="h-[30px] w-[30px] cursor-pointer"
                    onClick={goToChat}
                />
            </div>
        </div>
    );
}

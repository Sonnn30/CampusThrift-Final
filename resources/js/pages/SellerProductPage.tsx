import SellerProductPageNavbar from './SellerProductPageNavbar'
import SellerProductCard from "./SellerProductCard";

export default function SellerProductPage({ role, products }) {
    return (
        <>
            <SellerProductPageNavbar role={role} />
            <SellerProductCard role={role} products={products} />
        </>
    );
}

import SellerProductPageNavbar from './SellerProductPageNavbar'
import SellerProductCard from "./SellerProductCard";

type Seller = {
    id?: number;
    name?: string;
    itemsCount?: number;
    rating?: number;
    joinedAt?: string;
    status?: string;
}

export default function SellerProductPage({ role, products, seller }: { role: string; products: any[]; seller?: Seller }) {
    return (
        <>
            <SellerProductPageNavbar role={role} seller={seller} />
            <SellerProductCard role={role} products={products} />
        </>
    );
}

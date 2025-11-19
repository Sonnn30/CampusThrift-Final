import SellerProductPageNavbar from './SellerProductPageNavbar'
import SellerProductCard from "./SellerProductCard";
import ProductCatalogNavbar from "./ProductCatalogNavbar";
import { usePage } from "@inertiajs/react";

type Seller = {
    id?: number;
    name?: string;
    itemsCount?: number;
    rating?: number;
    joinedAt?: string;
    status?: string;
}

export default function SellerProductPage({ role, products, seller }: { role?: string; products: any[]; seller?: Seller }) {
    const { props } = usePage();
    const user = (props as any)?.auth?.user ?? props?.user ?? null;
    const isLoggedIn = Boolean(user);
    const resolvedRole = role ?? user?.role ?? 'Guest';

    return (
        <>
            <ProductCatalogNavbar user={user} role={resolvedRole} isLoggedIn={isLoggedIn} />
            <SellerProductPageNavbar role={resolvedRole} seller={seller} />
            <SellerProductCard role={resolvedRole} products={products} />
        </>
    );
}

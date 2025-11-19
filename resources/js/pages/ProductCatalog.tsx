import ProductCatalogNavbar from "./ProductCatalogNavbar";
import ProductCard from "./ProductCard";
import ProductCardNavbar from "./ProductCardNavbar";
import { useEffect, useMemo, useState } from "react";
import useTranslation from "@/Hooks/useTranslation";

type ProductCatalogProps = {
  user: any;
  role: string;
  isLoggedIn: boolean;
  products: Array<any>;
};

export default function ProductCatalog({ user, role, isLoggedIn, products }: ProductCatalogProps) {
    console.log(role)
    useEffect(() => {
        if (!user) {
        alert(t('Please'));
        }
    }, [user]);

    const [filter, setFilter] = useState("all");
    const [category, setCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // small helper to normalize category values (same logic as in filtering)
    const normalizeForIndex = (val: any) => {
        if (val == null) return [];
        if (Array.isArray(val)) return val.map(v => v?.toString().toLowerCase().trim()).filter(Boolean);
        if (typeof val === 'string' && val.trim().startsWith('[') && val.trim().endsWith(']')) {
        try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed.map((v:any)=>v?.toString().toLowerCase().trim()).filter(Boolean); } catch (e) {}
        }
        const s = val.toString().toLowerCase();
        const parts = s.split(/[,;|\/\-]+/).map((t: string) => t.trim()).flatMap((t: string) => t.split(/\s+/));
        return parts.filter(Boolean);
    };

    // derive category counts from products so UI can show available categories
    const categoryCounts = useMemo(() => {
        const map = new Map<string, number>();
        try {
        (products ?? []).forEach((p: any) => {
            const tokens = normalizeForIndex(p?.category);
            if (!tokens || tokens.length === 0) {
            // mark uncategorized
            map.set('uncategorized', (map.get('uncategorized') || 0) + 1);
            } else {
            // prefer the first token as primary bucket
            const key = tokens[0];
            map.set(key, (map.get(key) || 0) + 1);
            }
        });
        } catch (err) {
        // ignore
        }
        return map;
    }, [products]);

    function handleFilterChange(nextFilter: string) {
        console.debug('[ProductCatalog] handleFilterChange', nextFilter);
        setFilter(nextFilter);
    }

    function handleCategoryChange(nextCategory: string | null) {
        console.debug('[ProductCatalog] handleCategoryChange', nextCategory);
        // normalize 'all' -> null so our filtering logic is explicit
        if (!nextCategory || nextCategory === 'all') setCategory(null);
        else setCategory(nextCategory.toString().toLowerCase());
    }

    function handleSearchChange(q: string) {
        setSearchQuery(q ?? "");
    }

    useEffect(() => {
        try {
        const cats = Array.from(new Set((products ?? []).map((p: any) => (p?.category ?? '').toString())));
        console.debug('[ProductCatalog] available categories:', cats.slice(0, 50));
        if ((products ?? []).length > 0) {
            console.debug('[ProductCatalog] sample product categories:', (products as any[]).slice(0,5).map(p => p?.category));
        }
        } catch (err) {
        console.debug('[ProductCatalog] error reading categories', err);
        }
    }, [products]);

    useEffect(() => {
        function onWindowFilter(e: any) {
        const f = e?.detail?.filter;
        console.debug('[ProductCatalog] window event productFilterChange', f);
        if (f) setFilter(f);
        }
        window.addEventListener('productFilterChange', onWindowFilter as EventListener);
        return () => window.removeEventListener('productFilterChange', onWindowFilter as EventListener);
    }, []);

    const displayedProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

    // Work on a shallow copy so sorting won't mutate original input and
    // child receives a new array reference on every filter change.
    let copy = [...products];

    // Apply search filter by product name first (case-insensitive substring)
    if (searchQuery && searchQuery.trim() !== "") {
        const q = searchQuery.toString().toLowerCase().trim();
        copy = copy.filter(p => {
        const name = (p?.product_name ?? p?.name ?? p?.title ?? "").toString().toLowerCase();
        return name.includes(q);
        });
    }

        // Normalizers
        const getPrice = (p: any) => {
        if (!p) return 0;
        if (typeof p.product_price === 'number') return p.product_price;
        if (typeof p.price === 'number') return p.price;
        const parsed = Number(p.product_price ?? p.price ?? 0);
        return Number.isFinite(parsed) ? parsed : 0;
        };

        const getSales = (p: any) => {
        return (p.sales_count ?? p.sold_count ?? p.sales ?? p.total_sold ?? p.quantity_sold ?? 0) as number;
        };

        // Category filtering (applies before sort)
        if (category) {
        const beforeCount = copy.length;
        const target = category.toString().toLowerCase().trim();
        // helper to normalize a category value into tokens
        const normalize = (val: any) => {
            if (val == null) return [];
            // If already array, flatten to strings
            if (Array.isArray(val)) return val.map(v => v?.toString().toLowerCase().trim()).filter(Boolean);
            // If looks like JSON array string, try parse
            if (typeof val === 'string' && val.trim().startsWith('[') && val.trim().endsWith(']')) {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed.map((v: any) => v?.toString().toLowerCase().trim()).filter(Boolean);
            } catch (err) {
                // fallthrough to treat as plain string
            }
            }
            const s = val.toString().toLowerCase();
            // split on common separators and whitespace/hyphens/slashes
            const parts = s.split(/[,;|\/\-]+/).map((t: string) => t.trim()).flatMap((t: string) => t.split(/\s+/));
            return parts.filter(Boolean);
        };

        // optionally log a few normalized categories for debugging
        try {
            const sample = (copy as any[]).slice(0, 10).map(p => ({ id: p?.id, cat: normalize(p?.category) }));
            console.debug('[ProductCatalog] sample normalized cats', sample);
        } catch (err) {
            /* ignore */
        }

        copy = copy.filter(p => {
            const tokens = normalize(p?.category);
            if (!tokens || tokens.length === 0) return false;
            // match if any token equals/contains target or full category string contains target
            if (tokens.some((tok: string) => tok === target || tok.includes(target) || target.includes(tok))) return true;
            const full = (p?.category ?? '').toString().toLowerCase();
            return full.includes(target);
        });

        console.debug('[ProductCatalog] category filter', category, 'before', beforeCount, 'after', copy.length);
        }

        if (filter === "all") {
        console.debug('[ProductCatalog] displayedProducts (all) count', copy.length);
        return copy;
        }

        if (filter === "low_price" || filter === "high_price") {
        copy.sort((a, b) => {
            const pa = getPrice(a);
            const pb = getPrice(b);
            return filter === "low_price" ? pa - pb : pb - pa;
        });
        console.debug('[ProductCatalog] displayedProducts (price) filter', filter, 'count', copy.length, 'topPrice', getPrice(copy[0]));
        return copy;
        }

        if (filter === "best_seller") {
        copy.sort((a, b) => {
            const sa = getSales(a);
            const sb = getSales(b);
            return sb - sa; // highest sold first
        });
        console.debug('[ProductCatalog] displayedProducts (best_seller) count', copy.length, 'topSales', getSales(copy[0]));
        return copy;
        }

        // Fallback: return copy (new reference)
        console.debug('[ProductCatalog] displayedProducts (fallback) filter', filter, 'count', copy.length);
        return copy;
    }, [products, filter, category, searchQuery]);

    const {t} = useTranslation()

    return (
        <div className="text-playfair-display min-h-screen bg-gray-50">
        {/* Navbar */}
        <ProductCatalogNavbar
            user={user}
            role={role}
            isLoggedIn={isLoggedIn}
            onCategoryChange={handleCategoryChange}
            category={category}
            categoryCounts={categoryCounts}
            onSearch={handleSearchChange}
            searchQuery={searchQuery}
        />

        {/* Filter Navbar */}
        <ProductCardNavbar onFilterChange={handleFilterChange} />

        {/* Main Content Container */}
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4">
            {/* Current Filter Indicator */}
            <div className="mb-4 text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <span>{t('Current')}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filter === 'all' ? t('View All') :
                filter === 'best_seller' ? t('Best Seller') :
                filter === 'low_price' ? t('Low Price') :
                filter === 'high_price' ? t('High Price') : filter}
            </span>
            {category && (
                <>
                <span className="text-gray-400">|</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t('Category')}: {category}
                </span>
                </>
            )}
            {searchQuery && (
                <>
                <span className="text-gray-400">|</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {t('Search')}: "{searchQuery}"
                </span>
                </>
            )}
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm sm:text-base text-gray-700 font-medium">
            {displayedProducts.length} {displayedProducts.length === 1 ? t('Product') : t('Products')} {t('Found')}
            </div>

            {/* Product Grid with Login Overlay */}
            <div className={!isLoggedIn ? "relative" : ""}>
            {!isLoggedIn && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 text-center max-w-md mx-4">
                    <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('Login Req')}</h3>
                    <p className="text-gray-600 mb-4">{t('PleaseLog')}</p>
                    <a
                    href={`/${(() => {
                        const path = window.location.pathname;
                        const match = path.match(/^\/([a-z]{2})\//);
                        return match ? match[1] : 'id';
                    })()}/login`}
                    className="inline-block bg-[#4b9cd3] hover:bg-[#3a7fa8] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                    {t('Login Now')}
                    </a>
                </div>
                </div>
            )}

            {/* Product Cards Grid */}
            <div className={!isLoggedIn ? "blur-sm pointer-events-none" : ""}>
                <ProductCard role={role} products={displayedProducts}/>
            </div>
            </div>

            {/* Empty State */}
            {displayedProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
                <div className="max-w-md mx-auto">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                    {searchQuery ? `No products match "${searchQuery}"` :
                    category ? `No products in category "${category}"` :
                    'Try adjusting your filters'}
                </p>
                {(searchQuery || category) && (
                    <button
                    onClick={() => {
                        setSearchQuery("");
                        setCategory(null);
                        setFilter("all");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                    </button>
                )}
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }

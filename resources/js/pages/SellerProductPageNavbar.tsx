import { Link } from "@inertiajs/react";
import useTranslation from "@/Hooks/useTranslation";

type Seller = {
    id?: number;
    name?: string;
    itemsCount?: number;
    rating?: number;
    joinedAt?: string;
    status?: string;
}

type User = {
    id?: number;
    role?: string;
    name?: string;
}

export default function SellerProductPageNavbar({ role, seller, user }: { role: string; seller?: Seller; user?: User | null }) {
        const getLocale = () => {
            const path = window.location.pathname;
            const match = path.match(/^\/([a-z]{2})\//);
            return match ? match[1] : 'id';
        };

        function goToProfile(){
            // Always go to the seller's profile (the shop owner), not the current user's profile
            const locale = getLocale();

            // Debug: Log seller and user info
            console.log('goToProfile called:', {
                seller: seller,
                sellerId: seller?.id,
                sellerName: seller?.name,
                currentUserId: user?.id,
                currentUserName: user?.name,
                fullSellerObject: JSON.stringify(seller)
            });

            // CRITICAL: Always use seller.id - this is the shop owner's profile, not the logged-in user's profile
            // seller.id comes from the shop owner (the user who owns the products)
            const targetProfileId = seller?.id;

            if (!targetProfileId) {
                console.error('Seller ID is missing, cannot navigate to profile', {
                    seller,
                    user
                });
                alert('Seller information not available');
                return;
            }

            // Use new format: /Profile/{role}/{userId}
            // Seller role is always "Seller" for shop owner
            const targetRole = 'Seller'; // Shop owner is always a seller
            const profileUrl = `/${locale}/Profile/${targetRole}/${targetProfileId}`;
            console.log('Navigating to seller profile:', profileUrl);
            window.location.href = profileUrl;
        }
        function goToChat(){
            // Chat dengan seller ini jika ada ID, atau tidak tampil jika sedang lihat produk sendiri
            const locale = getLocale();
            if (seller?.id) {
                window.location.href = `/${locale}/${role}/chat/${seller.id}`;
            } else {
                alert("Seller information not available");
            }
        }
        function goToAdd(){
            const locale = getLocale();
            window.location.href = `/${locale}/${role}/product/add`;
        }
        function goToChatList(){
            const locale = getLocale();
            window.location.href = `/${locale}/${role}/chatlist`;
        }

        const displayName = seller?.name ?? 'Nama Seller';
        const itemsCount = seller?.itemsCount ?? 0;
        const rating = seller?.rating ?? 0;
        const joinedAt = seller?.joinedAt ?? '';
        const status = seller?.status ?? 'Offline';

        // Check if current user is the owner of this shop
        const isShopOwner = user?.id && seller?.id && user.id === seller.id;
        const isSellerRole = role === 'Seller';

        const { t } = useTranslation();

    return (
        <div className="bg-[#BBDCE5] text-black">
            {/* Container with responsive padding */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Main Grid Layout - Responsive */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-8">

                    {/* Left Section - Seller Info & Actions */}
                    <div className="flex flex-col items-center sm:items-start space-y-4 sm:space-y-3">
                        {/* Seller Profile */}
                        <div className="flex items-center w-full">
                            <img
                                className="h-16 w-16 sm:h-20 sm:w-20 lg:h-[75px] lg:w-[75px] rounded-full border-2 border-white shadow-md object-cover"
                                src="/SellerPage_assets/user.png"
                                alt="Seller Profile"
                            />
                            <div className="flex flex-col ml-3 sm:ml-4 flex-1 min-w-0">
                                <p className="text-xl sm:text-2xl lg:text-[28px] font-semibold truncate">
                                    {displayName}
                                </p>
                                <span className="text-xs sm:text-sm lg:text-[16px] text-gray-700">
                                    {joinedAt ? `Joined: ${joinedAt}` : 'Joined recently'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                className="flex-1 sm:flex-initial bg-white rounded-md px-4 py-2 text-sm sm:text-base flex justify-center items-center hover:bg-gray-100 transition-colors duration-200 border border-gray-300 shadow-sm font-medium"
                                onClick={goToProfile}
                            >
                                {t("View Profile")}
                            </button>

                            {role === "Buyer" ? (
                                <button
                                    className="flex-1 sm:flex-initial bg-white rounded-md px-4 py-2 text-sm sm:text-base flex justify-center items-center hover:bg-gray-100 transition-colors duration-200 border border-gray-300 shadow-sm font-medium"
                                    onClick={goToChat}
                                >
                                    <img
                                        className="h-4 w-4 sm:h-[15px] sm:w-[15px] mr-2"
                                        src="/SellerPage_assets/chat.png"
                                        alt="Chat Icon"
                                    />
                                    Chat
                                </button>
                            ) : (
                                <button
                                    className="flex-1 sm:flex-initial bg-white rounded-md px-4 py-2 text-sm sm:text-base flex justify-center items-center hover:bg-gray-100 transition-colors duration-200 border border-gray-300 shadow-sm font-medium"
                                    onClick={goToChatList}
                                >
                                    <img
                                        className="h-4 w-4 sm:h-[15px] sm:w-[15px] mr-2"
                                        src="/SellerPage_assets/chat.png"
                                        alt="Chat Icon"
                                    />
                                    {t("Chat List")}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mid Section - Seller Stats */}
                    <div className="flex justify-center items-center w-full lg:w-auto lg:flex-1">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4 lg:gap-x-12 lg:gap-y-4 w-full max-w-[500px] text-sm sm:text-base lg:text-[16px] font-medium">
                            {/* Items Count */}
                            <div className="flex items-center">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center flex-shrink-0">
                                    <img
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                        src="/SellerPage_assets/store.png"
                                        alt="Store Icon"
                                    />
                                </div>
                                <span className="ml-2 sm:ml-3 truncate">{t('Items')}: {itemsCount}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center flex-shrink-0">
                                    <img
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                        src="/SellerPage_assets/star.png"
                                        alt="Rating Icon"
                                    />
                                </div>
                                <span className="ml-2 sm:ml-3 truncate">{t('Rating')}: {rating}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center flex-shrink-0">
                                    <img
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                        src="/SellerPage_assets/status.png"
                                        alt="Status Icon"
                                    />
                                </div>
                                <span className="ml-2 sm:ml-3 truncate">
                                    Status: <span className={status === 'Online' ? 'text-green-600 font-semibold' : 'text-gray-600'}>{status}</span>
                                </span>
                            </div>

                            {/* Joined Date (Hidden on mobile, shown on larger screens) */}
                            <div className="hidden sm:flex items-center">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center flex-shrink-0">
                                    <img
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                        src="/SellerPage_assets/group.png"
                                        alt="Group Icon"
                                    />
                                </div>
                                <span className="ml-2 sm:ml-3 truncate">{t('Since')}: {joinedAt}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Add Product Button (Only for shop owner) */}
                    {isSellerRole && isShopOwner && (
                        <div className="flex justify-center lg:justify-end items-center w-full sm:w-auto">
                            <button
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-black rounded-full px-5 py-2.5 sm:py-2 text-sm sm:text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-md active:scale-95"
                                onClick={goToAdd}
                            >
                                <img
                                    className="h-5 w-5 sm:h-6 sm:w-6"
                                    src="/SellerPage_assets/add.png"
                                    alt="Add Icon"
                                />
                                {t("Add Product")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductCatalogNavbar({user, role, isLoggedIn, onCategoryChange, category, categoryCounts, onSearch, searchQuery}: {user:any, role:any, isLoggedIn:any, onCategoryChange?: (c: string | null) => void, category?: string | null, categoryCounts?: Map<string, number> | Record<string, number> | null, onSearch?: (q: string) => void, searchQuery?: string}) {
    const [ishidden, setIsHidden] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    function goToSchedule(){
        window.location.href = `/${role}/MySchedule`
    }
    function goToProfile(){
        window.location.href = `/Profile/${role}`
    }
    function goToLogin(){
        window.location.href = `/login`
    }
    function goToMyStore(){
        window.location.href = `/Seller/product`
    }
    function goToLocationRecommendation(){
        if (isLoggedIn) {
            alert(
                "Safe COD Location Recommendations:\n\n" +
                "📍 Campus Kemanggisan\n" +
                "📍 Campus Syahdan\n" +
                "📍 Binus Square Food Court\n" +
                "📍 Anggrek Campus Library\n\n" +
                "Select a product and click 'Make Appointment' to schedule a COD meeting!"
            );
        } else {
            alert("Please login first to view location recommendations");
            window.location.href = `/login`
        }
    }

    function selectCategory(cat: string | null){
        if(typeof onCategoryChange === 'function') onCategoryChange(cat);
    }

    function handleLogout() {
        router.post("/logout");
    }

    return (
        <>
            {/* Main Navbar */}
            <div className="m-0 flex flex-col lg:flex-row lg:h-[100px] items-center justify-between bg-[#BBDCE5] px-2 lg:px-4 py-3 lg:py-0 text-black">
                {/* Top Row on Mobile: Logo + Hamburger */}
                <div className="flex w-full lg:w-auto items-center justify-between lg:justify-start">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="cursor-pointer block">
                        <img
                            src="/LogoCampusTrrft2.png"
                            alt="Logo"
                                className="h-[50px] lg:h-[70px] w-auto"
                        />
                    </Link>
                </div>

                    {/* Hamburger Menu Button (Mobile Only) */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-white/20 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Search Bar (Always visible on desktop, toggle on mobile) */}
                <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex w-full lg:flex-1 lg:mx-4 mt-3 lg:mt-0`}>
                    <div className="flex flex-1 items-center relative">
                        <input
                            className="h-[42px] w-full rounded-full border-none bg-white pl-4 pr-10 text-[14px] lg:text-[16px] font-medium text-black focus:ring-2 focus:ring-[#4b9cd3] focus:outline-none"
                            type="text"
                            placeholder="Search..."
                            value={searchQuery ?? ""}
                            onChange={(e) => { if (typeof onSearch === 'function') onSearch(e.target.value); }}
                        />
                        <img
                            className="absolute right-3 h-[20px] lg:h-[25px] w-[20px] lg:w-[25px]"
                            src="/ProductCatalogNavbar_assets/search-logo.png"
                            alt="SearchIcon"
                        />
                    </div>
                </div>

                {/* Right Section - Buttons & Profile (Desktop) */}
                <div className="hidden lg:flex flex-shrink-0 items-center gap-2">
                    <button
                        onClick={goToLocationRecommendation}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-3 xl:px-4 py-2 text-[14px] xl:text-[16px] font-medium transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-gray-100"
                    >
                        <span className="hidden xl:inline">Location</span>
                        <img
                            className="inline-flex h-[20px] xl:h-[25px] w-[20px] xl:w-[25px]"
                            src="/ProductCatalogNavbar_assets/location-logo.png"
                            alt="Location_logo"
                        />
                    </button>

                    <button
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-3 xl:px-4 py-2 text-[14px] xl:text-[16px] font-medium transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-gray-100"
                        onClick={goToSchedule}
                    >
                        <span className="hidden xl:inline">My Schedule</span>
                        <img
                            className="inline-flex h-[20px] xl:h-[25px] w-[20px] xl:w-[25px]"
                            src="/ProductCatalogNavbar_assets/schedule-calender-logo.png"
                            alt="Schedule_Logo"
                        />
                    </button>

                    <div className="h-10 w-px bg-gray-600"></div>

                    {/* Profile Section (Desktop) */}
                    <div className="mr-2 flex cursor-pointer items-center gap-2 text-[14px] xl:text-[16px]">
                    {!isLoggedIn ? (
                        <div
                                className="w-[100px] xl:w-[120px] h-[40px] rounded-2xl flex justify-center items-center bg-white border-2 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={goToLogin}
                        >
                                <button className="text-[20px] xl:text-[24px] cursor-pointer">LogIn</button>
                        </div>
                    ) : (
                            <div className="relative flex flex-col items-end" onClick={()=>setIsHidden(!ishidden)}>
                                <div className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'>
                                <img
                                    className="h-10 w-10 rounded-full border border-gray-300"
                                    src="/ProductCatalogNavbar_assets/user.png"
                                    alt="profile_pict"
                                />
                                    <p className="hidden xl:block">Hello, {user?.name ?? "please login"} ({role ?? "Guest"})</p>
                                    <p className="xl:hidden">Hi, {user?.name?.split(' ')[0] ?? "User"}</p>
                            </div>
                            {ishidden && (
                                    <div className='absolute top-12 right-0 flex flex-col bg-white shadow-lg rounded-lg overflow-hidden z-50'>
                                        <button
                                            onClick={goToProfile}
                                            className='bg-white hover:bg-gray-100 border-b w-[140px] px-5 py-3 text-left cursor-pointer transition-colors'
                                        >
                                            My Profile
                                        </button>
                                        {role === "Seller" && (
                                            <button
                                                onClick={goToMyStore}
                                                className='bg-white hover:bg-gray-100 border-b w-[140px] px-5 py-3 text-left cursor-pointer transition-colors'
                                            >
                                                My Store
                                            </button>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className='bg-white hover:bg-gray-100 w-[140px] px-5 py-3 text-left cursor-pointer transition-colors'
                                        >
                                            Log Out
                                        </button>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden w-full mt-3 flex flex-col gap-2 pb-2">
                        <button
                            onClick={goToLocationRecommendation}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] font-medium transition hover:bg-gray-100"
                        >
                            Location
                            <img
                                className="h-[20px] w-[20px]"
                                src="/ProductCatalogNavbar_assets/location-logo.png"
                                alt="Location"
                            />
                        </button>

                        <button
                            onClick={goToSchedule}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] font-medium transition hover:bg-gray-100"
                        >
                            My Schedule
                            <img
                                className="h-[20px] w-[20px]"
                                src="/ProductCatalogNavbar_assets/schedule-calender-logo.png"
                                alt="Schedule"
                            />
                        </button>

                        {!isLoggedIn ? (
                            <button
                                onClick={goToLogin}
                                className="w-full rounded-lg bg-white border-2 border-gray-300 px-4 py-2.5 text-[18px] font-semibold hover:bg-gray-100 transition-colors"
                            >
                                LogIn
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={goToProfile}
                                    className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-100 transition-colors text-left"
                                >
                                    👤 My Profile
                                </button>
                                {role === "Seller" && (
                                    <button
                                        onClick={goToMyStore}
                                        className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-100 transition-colors text-left"
                                    >
                                        🏪 My Store
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-[14px] font-medium hover:bg-red-50 transition-colors text-left text-red-600"
                                >
                                    🚪 Log Out
                                </button>
                                <div className="px-2 py-1 text-center text-[12px] text-gray-600">
                                    Hello, {user?.name} ({role})
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="flex flex-wrap gap-2 lg:gap-5 py-3 px-3 lg:px-7">
                {categoryCounts ? (
                    <>
                        {(() => {
                            const entries = categoryCounts instanceof Map ? Array.from(categoryCounts.entries()) : Object.entries(categoryCounts || {});
                            const total = entries.reduce((s: number, [, v]) => s + (Number(v) || 0), 0);
                            return (
                                <button
                                    onClick={() => selectCategory(null)}
                                    className={`rounded-full border border-gray-800 px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${category === null ? 'bg-[#4b9cd3] text-white' : 'bg-white'} focus:outline-none`}
                                >
                                    All ({total})
                                </button>
                            );
                        })()}
                        {(categoryCounts instanceof Map ? Array.from(categoryCounts.entries()) : Object.entries(categoryCounts || {})).map(([k, cnt]) => (
                            <button
                                key={k}
                                onClick={() => selectCategory(k)}
                                className={`rounded-full border border-gray-800 px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${category === k ? 'bg-[#4b9cd3] text-white' : 'bg-white'} focus:outline-none`}
                            >
                                {k === 'uncategorized' ? 'Uncategorized' : k} ({cnt})
                            </button>
                        ))}
                    </>
                ) : (
                    <>
                        {['All', 'Chair', 'Table', 'Shoes', 'Book', 'Electronic', 'Bookshelf', 'Fan', 'Desk Lamp', 'Stationery', 'Tableware', 'Backpack', 'Jacket'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => selectCategory(cat === 'All' ? null : cat)}
                                className="rounded-full border border-gray-800 bg-white px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                            >
                                {cat}
                        </button>
                        ))}
                    </>
                )}
            </div>

            <hr className="p-0 m-0 border-t border-gray-300" />
        </>
    );
}

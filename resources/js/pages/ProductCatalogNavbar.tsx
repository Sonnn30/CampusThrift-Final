import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductCatalogNavbar({user, role, isLoggedIn}) {
    const [ishidden, setIsHidden] = useState(false)
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

    function handleLogout() {
        router.post("/logout");
    }

    // console.log(user)
    // console.log(role)
    // console.log(isLoggedIn)

    return (
        <>
            <div className="m-0 flex h-[100px] items-center justify-between bg-[#BBDCE5] px-2 text-black">
                {/* Left Section  BELUM ADA LINK*/}
                <div className="ml-2 flex-shrink-0">
                    <Link href="/" className="cursor-pointer p-4">
                        <img
                            src="/LogoCampusTrrft2.png"
                            alt="Logo"
                            className="h-[70px] w-auto"
                        />
                    </Link>
                </div>

                {/* Middle Section */}
                <div className="mx-auto flex max-w-full flex-1">
                    <div className="ml-10 flex flex-1 items-center">
                        <input
                            className="h-[42px] max-w-[1400px] min-w-[200px] flex-1 rounded-full border-none bg-white pl-4 text-[16px] font-medium text-black focus:ring-2 focus:ring-[#4b9cd3] focus:outline-none"
                            type="text"
                            placeholder="Search..."
                        />
                        <img
                            className="-ml-10 inline-flex h-[25px] w-[25px]"
                            src="/ProductCatalogNavbar_assets/search-logo.png"
                            alt="SearchIcon"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="ml-5 flex flex-shrink-0 items-center gap-2">
                    <button className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[16px] font-medium transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-gray-100">
                        Location
                        <img
                            className="inline-flex h-[25px] w-[25px]"
                            src="/ProductCatalogNavbar_assets/location-logo.png"
                            alt="Location_logo"
                        />
                    </button>

                    <button className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[16px] font-medium transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-gray-100" onClick={goToSchedule}>
                        My Schedule
                        <img
                            className="inline-flex h-[25px] w-[25px]"
                            src="/ProductCatalogNavbar_assets/schedule-calender-logo.png"
                            alt="Schedule_Logo"
                            onClick={goToSchedule}
                        />
                    </button>

                    <div className="h-10 w-px bg-gray-600"></div>

                    {/* Profile  BELUM ADA LINK */}
                    <div className="mr-2 flex cursor-pointer items-center gap-2 text-[16px]">
                    {!isLoggedIn ? (
                        <div
                            className="w-[120px] h-[40px] rounded-2xl flex justify-center items-center bg-white border-2 cursor-pointer"
                            onClick={goToLogin}
                        >
                            <button className="text-[24px] cursor-pointer">LogIn</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-20" onClick={()=>setIsHidden(!ishidden)}>
                            <div className='flex items-center gap-2'>
                                <img
                                    className="h-10 w-10 rounded-full border border-gray-300"
                                    src="/ProductCatalogNavbar_assets/user.png"
                                    alt="profile_pict"
                                />
                                <p>Hello, {user?.name ?? "please login"} ({role ?? "Guest"})</p>
                            </div>
                            {ishidden && (
                                <div className='absolute flex flex-col items-end justify-center mt-10 bg-white '>
                                    {role === "Seller" ? (
                                        <div className=' bg-white border-2 w-[120px] flex items-center justify-end px-5 cursor-pointer' onClick={goToMyStore}>
                                            <button onClick={goToMyStore} className='cursor-pointer'>My Store</button>
                                        </div>
                                    ): ('')}
                                    <div className=' bg-white border-2 w-[120px] flex items-center justify-end px-5 cursor-pointer' onClick={goToProfile}>
                                        <button onClick={goToProfile} className='cursor-pointer'>MyProfile</button>
                                    </div>
                                    <div className=' bg-white border-2 w-[120px] flex items-center justify-end px-5 cursor-pointer' onClick={handleLogout}>
                                        <button onClick={handleLogout} className='cursor-pointer'>Log Out</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    </div>
                    {/* <Link
                        href="/login"
                        className="mr-2 flex cursor-pointer items-center gap-2 text-[16px]"
                    >

                    </Link> */}
                </div>
            </div>

            <div className="flex flex-wrap justify-evenly gap-5 p-3">
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    All
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Chair
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Table
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Shoes
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Book
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Electronic
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Bookshelf
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Fan
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Desk Lamp
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Stationery
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Tableware
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Backpack
                </button>
                <button className="rounded-full border border-gray-800 bg-white px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 focus:border-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none">
                    Jacket
                </button>
            </div>

            <hr className="p-0 m-0 border-t border-gray-300" />
        </>
    );
}

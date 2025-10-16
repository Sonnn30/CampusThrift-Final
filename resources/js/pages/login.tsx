import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Link } from "@inertiajs/react"
import { Inertia } from "@inertiajs/inertia";

export default function Login(){
    const [click, setClick] = useState(false)
    const [click2, setClick2] = useState(false)
    const [value, setValue] = useState("")
    const [value2, setValue2] = useState("")
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("Buyer")
    const variants = {
        "animate1": {scale: 0.75, x:-5, y:-27},
        "animate2": {scale: 1}
    }


    useEffect(() => {
        const savedRole = localStorage.getItem("role")
        if (savedRole) {
        setSelected(savedRole)
        }
    }, [])

    const handleSelect = (option: string) => {
        setSelected(option)
        setOpen(false)
    }

    const handleLogin = () => {
        Inertia.post('/login', {
            email: value,
            password: value2,
            role: selected
        })
    }

    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-[#ECEEDF] p-4 sm:p-6">
            <div className="flex flex-col justify-center gap-6 sm:gap-8 items-center bg-[#BBDCE5] w-full max-w-[698px] min-h-[500px] sm:h-auto px-6 sm:px-8 py-8 sm:py-10 rounded-2xl shadow-xl">
                {/* Logo */}
                <img
                    src="/LogoCampusTrrft2.png"
                    alt="Logo"
                    className="w-[100px] sm:w-[120px] lg:w-[143px] h-auto"
                />

                {/* Role Selector */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
                    {/* Label */}
                    <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">Log In as</h2>

                    {/* Dropdown wrapper */}
                    <div className="relative">
                        {/* Tombol */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-xl sm:text-2xl lg:text-[30px] flex items-center gap-2 rounded-md px-3 py-1 hover:bg-white/20 transition-colors"
                        >
                            <span className="font-semibold">{selected}</span>
                            <img
                                src={open ? "/arrow-up.png" : "/arrow-down.png"}
                                alt="toggle"
                                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[25px] lg:h-[25px] mt-1"
                            />
                        </button>

                        {/* Dropdown list */}
                        {open && (
                            <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                <ul className="flex flex-col">
                                    {["Seller", "Buyer"].map((option) => (
                                        <li
                                            key={option}
                                            onClick={() => handleSelect(option)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-base sm:text-lg"
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Input */}
                <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center ">
                    <motion.p
                        className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded"
                        variants={variants}
                        animate={click || value !== "" ? "animate1" : "animate2"}
                    >
                        Email
                    </motion.p>
                    <input
                        type="text"
                        className="w-full px-4 sm:px-5 h-[40px] border-none outline-none text-base sm:text-lg bg-transparent"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setClick(true)}
                        onBlur={() => setClick(false)}
                    />
                </div>

                {/* Password Input */}
                <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p
                        className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded"
                        variants={variants}
                        animate={click2 || value2 !== "" ? "animate1" : "animate2"}
                    >
                        Password
                    </motion.p>
                    <input
                        type="password"
                        className="w-full px-4 sm:px-5 h-[40px] border-none outline-none text-base sm:text-lg bg-transparent"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                        onFocus={() => setClick2(true)}
                        onBlur={() => setClick2(false)}
                    />
                </div>

                {/* Login Button */}
                <button
                    className="bg-[#CFAB8D] mt-2 sm:mt-3 w-full max-w-[465px] h-[50px] sm:h-[53px] flex justify-center items-center text-xl sm:text-2xl lg:text-[30px] font-semibold rounded-xl hover:bg-[#D9C4B0] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    onClick={handleLogin}
                >
                    Log In
                </button>

                {/* Sign Up Link */}
                <div className="text-sm sm:text-base text-center">
                    Don't have account? <Link href="/SignUp" className="underline font-semibold hover:text-blue-700 transition-colors">Sign Up</Link>
                </div>
            </div>
        </div>
        </>
    )

}

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import ReactMarkdown from "react-markdown";
import { router } from "@inertiajs/react";
import useTranslation from '@/Hooks/useTranslation';


export default function SignUp({flash}){
    const [click, setClick] = useState(false)
    const [click2, setClick2] = useState(false)
    const [click3, setClick3] = useState(false)
    const [click4, setClick4] = useState(false)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [value2, setValue2] = useState("")
    const [value3, setValue3] = useState("")
    const [value4, setValue4] = useState("")
    const [valid_1, setValid_1] = useState(false)

    const [selected, setSelected] = useState("Buyer")


    const variants = {
        "animate1": {scale: 0.75, x:-5, y:-27},
        "animate2": {scale: 1}
    }

    const { locale } = usePage().props;
    const handleSubmit = (e) => {
    if (selected === "Seller" && !value.includes("@binus.ac.id")) {
        alert("Seller must use a valid @binus.ac.id email!");
        return;
    }
    e.preventDefault();
    console.log("Sending data:", {
        name: value3,
        email: value,
        password: value2,
        password_confirmation: value4,
        role: selected,
    });


    router.post(`/${locale}/SignUp`, {
        name: value3,
        email: value,
        password: value2,
        password_confirmation: value4,
        role: selected,
    }, {
    onError: (errors) => {
        console.log(errors);
        alert(JSON.stringify(errors));
    },
    });
    };

    const handleSelect = (option) => {
        setSelected(option)
        setOpen(false)
    }

    useEffect(() => {
        if (flash?.error) {
        alert(flash.error);
        }
    }, [flash]);
        const emailvalidation = (val, selected) => {
        if (selected === "Seller") {
            setValid_1(val.includes("@binus.ac.id"));
        } else {
            setValid_1(true);
        }
    };


    useEffect(() => {
        emailvalidation(value, selected)
    }, [value, selected])

    const {t} = useTranslation()

    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-[#ECEEDF] p-4 sm:p-6">
            <div className="flex flex-col justify-center gap-5 sm:gap-6 lg:gap-8 items-center bg-[#BBDCE5] w-full max-w-[698px] min-h-[700px] sm:h-auto px-6 sm:px-8 py-8 sm:py-10 rounded-2xl shadow-xl">
                {/* Logo */}
                <img
                    src="/LogoCampusTrrft2.png"
                    alt="Logo"
                    className="w-[100px] sm:w-[120px] lg:w-[143px] h-auto"
                />

                {/* Role Selector */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
                    {/* Label */}
                    <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">{t('Sign Up as')}</h2>

                    {/* Dropdown wrapper */}
                    <div className="relative">
                        {/* Tombol */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-xl sm:text-2xl lg:text-[30px] flex items-center gap-2 rounded-md px-3 py-1 hover:bg-white/20 transition-colors"
                        >
                            <span className="font-semibold">{t(selected)}</span>
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
                                            {t(option)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Username Input */}
                <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p
                        className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded"
                        variants={variants}
                        animate={click3 || value3 !== "" ? "animate1" : "animate2"}
                    >
                        {t('Username')}
                    </motion.p>
                    <input
                        type="text"
                        className="w-full px-4 sm:px-5 h-[40px] border-none outline-none text-base sm:text-lg bg-transparent"
                        value={value3}
                        onChange={(e) => setValue3(e.target.value)}
                        onFocus={() => setClick3(true)}
                        onBlur={() => setClick3(false)}
                    />
                </div>

                {/* Email Input */}
                <div className="w-full max-w-[465px] h-[50px] sm:h-[53px]">
                    <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center">
                        <motion.p
                            className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded"
                            variants={variants}
                            animate={click || value !== "" ? "animate1" : "animate2"}
                        >
                            {t('Email')}
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
                    {selected === "Seller" && !valid_1 &&(
                        <p className="text-red-600 text-sm mt-1">{t('Email Valid')}</p>
                    )}
                </div>

                {/* Password Input */}
                <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p
                        className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded"
                        variants={variants}
                        animate={click2 || value2 !== "" ? "animate1" : "animate2"}
                    >
                        {t('Password')}
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

                {/* Confirm Password Input */}
                <div className="relative w-full max-w-[465px] h-[50px] sm:h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p
                        className="flex absolute left-2 justify-center text-base sm:text-lg lg:text-[20px] bg-[#BBDCE5] px-2 rounded whitespace-nowrap"
                        variants={variants}
                        animate={click4 || value4 !== "" ? "animate1" : "animate2"}
                    >
                        {t('Confirm Password')}
                    </motion.p>
                    <input
                        type="password"
                        className="w-full px-4 sm:px-5 h-[40px] border-none outline-none text-base sm:text-lg bg-transparent"
                        value={value4}
                        onChange={(e) => setValue4(e.target.value)}
                        onFocus={() => setClick4(true)}
                        onBlur={() => setClick4(false)}
                    />
                </div>

                {/* Sign Up Button */}
                <button
                    className="bg-[#CFAB8D] mt-2 sm:mt-3 w-full max-w-[465px] h-[50px] sm:h-[53px] flex justify-center items-center text-xl sm:text-2xl lg:text-[30px] font-semibold rounded-xl hover:bg-[#D9C4B0] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    onClick={handleSubmit}
                >
                    Sign Up
                </button>

                {/* Log In Link */}
                <div className="text-sm sm:text-base text-center mt-1">
                    {t("Already have")} <Link href={`/${locale}/login`} className="underline font-semibold hover:text-blue-700 transition-colors">Log In</Link>
                </div>
            </div>
        </div>

        </>

    )
}

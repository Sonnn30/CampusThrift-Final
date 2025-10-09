import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Link } from "@inertiajs/react"
import ReactMarkdown from "react-markdown";
import { router } from "@inertiajs/react";


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

    const [selected, setSelected] = useState("Buyer")


    const variants = {
        "animate1": {scale: 0.75, x:-5, y:-27},
        "animate2": {scale: 1}
    }

    const handleSubmit = (e) => {
    e.preventDefault();
    const name = value3.trim()
    const email = value.trim()
    const password = value2
    const passwordConfirmation = value4

    // mirror backend constraints
    const sellerPattern = /^[A-Za-z0-9._%+-]+@binus\.ac\.id$/i
    const buyerPattern = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|binus\.ac\.id)$/i

    if (!name) {
        alert('Name is required.')
        return
    }
    if (!email) {
        alert('Email is required.')
        return
    }
    if (selected === 'Seller') {
        if (!sellerPattern.test(email)) {
            alert('Seller must use an email ending with @binus.ac.id')
            return
        }
    } else {
        if (!buyerPattern.test(email)) {
            alert('Buyer must use a valid email: @gmail.com, @yahoo.com, or @binus.ac.id')
            return
        }
    }
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters.')
        return
    }
    if (password !== passwordConfirmation) {
        alert('Password confirmation does not match.')
        return
    }

    router.post("/SignUp", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: selected,
    }, {
        onError: (errors) => {
            const messages = Object.values(errors)
            if (messages.length) alert(messages.join('\n'))
        },
        onSuccess: () => {
            // After successful signup, backend redirects to verification notice.
            // Ensure navigation in case Inertia stays on the same page.
            router.visit('/verify-email')
        }
    });
    };

    const handleSelect = (option) => {
        setSelected(option)
        setOpen(false) // tutup dropdown setelah pilih
    }

    useEffect(() => {
        if (flash?.error) {
        alert(flash.error);
        }
    }, [flash]);

    return(
        <>
        <div className="flex justify-center items-center h-[120vh] bg-[#ECEEDF]">
            <div className="flex flex-col justify-center gap-8 items-center bg-[#BBDCE5] w-[698px] h-[800px] rounded-2xl">
                <img src="/LogoCampusTrrft2.png" alt="Logo" width={143} height={90}/>
                <div className="flex justify-center items-center">
                {/* Label */}
                <h2 className="text-[30px]">Sign Up as</h2>

                {/* Dropdown wrapper */}
                <div className="relative">
                    {/* Tombol */}
                    <button
                    onClick={() => setOpen(!open)}
                    className="text-[30px] flex items-center gap-2 rounded-md px-3 py-1"
                    >
                    {selected}
                    <img
                        src={open ? "/arrow-up.png" : "/arrow-down.png"}
                        alt="toggle"
                        width={25}
                        height={25}
                        className="mt-2"
                    />
                    </button>

                    {/* Dropdown list */}
                    {open && (
                    <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <ul className="flex flex-col">
                        {["Seller", "Buyer"].map((option) => (
                            <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                            {option}
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            </div>
                <div className="relative w-[465px] h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p className="flex absolute left-2 justify-center text-[20px] bg-[#BBDCE5] w-28" variants={variants} animate={
                        click3 || value3 !== "" ? "animate1" : "animate2"
                    }>UserName
                    </motion.p>
                    <input type="text" className="w-[420px] ml-5 h-[40px] border-none outline-none " value={value3} onChange={(e) => setValue3(e.target.value)} onFocus={() => setClick3(true)} onBlur={() => setClick3(false)}/>
                </div>
                <div className="relative w-[465px] h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p className="flex absolute left-2 justify-center text-[20px] bg-[#BBDCE5] w-16" variants={variants} animate={
                        click || value !== "" ? "animate1" : "animate2"
                    }>Email
                    </motion.p>
                    <input type="text" className="w-[420px] ml-5 h-[40px] border-none outline-none " value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setClick(true)} onBlur={() => setClick(false)}/>
                </div>
                <div className="relative w-[465px] h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p className="flex absolute left-2 justify-center text-[20px] bg-[#BBDCE5] w-25" variants={variants} animate={
                        click2 || value2 !== "" ? "animate1" : "animate2"
                    }>Password
                    </motion.p>
                    <input type="password" className="w-[420px] ml-5 h-[40px] border-none outline-none " value={value2} onChange={(e) => setValue2(e.target.value)} onFocus={() => setClick2(true)} onBlur={() => setClick2(false)}/>
                </div>
                <div className="relative w-[465px] h-[53px] border-2 rounded-2xl flex items-center">
                    <motion.p className="flex absolute left-3 justify-center text-[20px] bg-[#BBDCE5] w-43" variants={variants} animate={
                        click4 || value4 !== "" ? "animate1" : "animate2"
                    }>Confirm Password
                    </motion.p>
                    <input type="password" className="w-[420px] ml-5 h-[40px] border-none outline-none " value={value4} onChange={(e) => setValue4(e.target.value)} onFocus={() => setClick4(true)} onBlur={() => setClick4(false)}/>
                </div>
                <div className="bg-[#CFAB8D] mt-3 w-[465px] h-[53px] flex justify-center items-center text-[30px] rounded-xl hover:bg-[#D9C4B0] hover:cursor-pointer" onClick={handleSubmit}>
                    Sign Up
                </div>
                <div className="-mt-5">
                    Already have an account? <span><Link href="/login" className="underline">Log In</Link></span>
                </div>
            </div>
        </div>

        </>

    )
}

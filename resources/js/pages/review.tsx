

export default function Review({role}){
    console.log(role)
    return(
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[#ECEEDF]">
                <div className="flex flex-col items-center justify-start w-[700px] h-[700px] bg-white border-2 gap-10 px-15">
                    <div className="flex pt-15 gap-4 w-full justify-start items-start">
                        <img src="/review.png" alt="review" className="w-[40px] h-[40px]"/>
                        <h1 className="text-[28px]">Rating</h1>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[26px]">{role === "Buyer" ? (
                            "How would you rate your overall experience buying from this seller?"
                        ): (
                            "How would you rate your overall experience with this buyer?"
                        )}</h1>
                        <div>
                            <img src="/starG.svg" alt="" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[26px]">{role === "Buyer" ? (
                            "What do you think about the product you purchased?"
                        ): (
                            "What was your experience dealing with this buyer?"
                        )}</h1>
                        <div>
                            <textarea
                                className="w-full h-40 border-2  rounded-lg p-3"
                                placeholder="Type Here..."
                            ></textarea>
                        </div>
                    </div>
                    <div className="px-15 bg-[#BBDCE5] w-[510px] h-[47px] flex justify-center items-center rounded-2xl">
                        <button className="text-[28px]">Submit</button>
                    </div>
                </div>
            </div>
        </>

    )
}

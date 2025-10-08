

export default function ConfirmPage(){
    return(
        <>
            <div className="flex justify-center items-center bg-[#ECEEDF] w-full h-full p-10">
                <div className="absolute right-70 top-30">
                    <img src="/cross.png" alt="cross" className="w-[34px] h-[34px]"/>
                </div>
                <div className="flex flex-col items-center justify-center gap-5 w-[1171px] h-[940px] bg-[#BBDCE5]">
                    <div className="flex mt-10 bg-[#7ED751] rounded-full">
                        <img src="/check2.png" alt="check" className="w-[158px] h-[158px]"/>
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <h1 className="text-[48px] font-bold">Product Deal</h1>
                        <p className="text-[42px]">Let's confirm the deal</p>
                    </div>
                    <div className="flex items-center gap-10 bg-white w-[751px] h-[309px] p-5 border-2">
                        <div>
                            <img src="/shoes.jpg" alt="shoes" className="w-[252px] h-[210px] border-2"/>
                        </div>
                        <div className="flex flex-col gap-5 text-[32px]">
                            <h1>Nama Produk</h1>
                            <p>Date: Wed, 10/08/2025</p>
                            <div className="flex justify-between gap-5">
                                <p>ID: 9876</p>
                                <p className="font-bold">Rp 200.000</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-[750px] h-[60px] border-2 bg-white rounded-2xl mt-10 cursor-pointer">
                        <button className="text-[32px] cursor-pointer">Confirm</button>
                    </div>
                </div>
            </div>
        </>
    )
}



export default function ConfirmPage({ role, detail }: any){
    function goToReview(){
        // Use appointment_id from detail if available, otherwise go to UploadEvidence without parameter
        const appointmentId = detail?.appointment_id;
        const url = appointmentId ? `/UploadEvidence?appointment_id=${appointmentId}` : `/UploadEvidence`;
        window.location.href = url;
    }
    return(
        <>
            <div className="flex justify-center items-center bg-[#ECEEDF] w-full h-full p-10">
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
                            <img src={detail?.image || '/shoes.jpg'} alt="product" className="w-[252px] h-[210px] border-2 object-cover"/>
                        </div>
                        <div className="flex flex-col gap-5 text-[32px]">
                            <h1>{detail?.item || 'Product'}</h1>
                            <p>Date: {detail?.date}</p>
                            <div className="flex justify-between gap-5">
                                <p>ID: {detail?.id}</p>
                                <p className="font-bold">Rp {Number(detail?.amount || 0).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-[750px] h-[60px] border-2 bg-white rounded-2xl mt-10 cursor-pointer" onClick={goToReview}>
                        <button className="text-[32px] cursor-pointer" onClick={goToReview}>Confirm</button>
                    </div>
                </div>
            </div>
        </>
    )
}

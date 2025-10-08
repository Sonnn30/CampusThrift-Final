import { useRef, useState } from "react";

export default function UploadEvidence({role}){
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleClick = () => {
        fileInputRef.current.click();
    };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log("File selected:", file);
    }
  };
    return(
        <>
            <div className="flex flex-col justify-center items-center w-full h-[800px] bg-[#ECEEDF] gap-15">
                <div className="text-[54px] font-bold flex justify-center items-center">
                    <h1>Upload Proof of Handover</h1>
                </div>
                <div className="flex flex-col items-center justify-center w-[1309px] h-[407px] bg-white border-2 border-dashed rounded-2xl gap-3">
                    <img src="/upload.png" alt="upload" className="w-[123px] h-[123px]"/>
                    <p className="font-bold text-[32px]">Drag or drop your document here </p>
                    <div className="flex flex-col items-center gap-3">
                        <button
                            onClick={handleClick}
                            className="text-[32px] text-[#1C6EA4] font-bold border-2 border-[#1C6EA4] px-6 py-2 rounded-xl hover:bg-[#1C6EA4] hover:text-white transition-all"
                        >
                            Choose a file
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {fileName && <p className="text-gray-600 text-lg">📁 {fileName}</p>}
                        </div>
                </div>
                <div className="flex justify-center items-center w-[904px] h-[75px] bg-[#BBDCE5] rounded-2xl cursor-pointer">
                    <button className="text-[48px] font-bold cursor-pointer">Submit</button>
                </div>
            </div>
        </>
    )
}

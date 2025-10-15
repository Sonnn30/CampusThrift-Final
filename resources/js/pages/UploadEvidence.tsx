import { useRef, useState } from "react";
import { router, usePage } from '@inertiajs/react';

export default function UploadEvidence({role}: {role?: string}){
    const page = usePage<any>();
    const serverRole = page.props.role || role || 'Buyer';
    const appointmentId = page.props.appointment_id;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
        }
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        if (!appointmentId) {
            alert('No appointment found. Please complete a transaction first.');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('evidence_file', selectedFile);
        formData.append('appointment_id', appointmentId);
        formData.append('description', description);

        router.post('/UploadEvidence', formData, {
            forceFormData: true,
            onSuccess: () => {
                alert('Evidence uploaded successfully!');
                setFileName("");
                setSelectedFile(null);
                setDescription("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Redirect to home page after successful upload
                setTimeout(() => {
                    goToHome();
                }, 1000);
            },
            onError: (errors) => {
                console.error('Upload error:', errors);
                alert('Failed to upload evidence. Please try again.');
            },
            onFinish: () => {
                setIsUploading(false);
            }
        });
    };

    function goToHome(){
        router.visit('/');
    }
    return(
        <>
            <div className="flex flex-col justify-center items-center w-full h-[1000px] bg-[#ECEEDF] gap-15">
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

                {/* Description Input */}
                <div className="flex flex-col items-center justify-center w-[1309px] gap-3">
                    <label className="text-[24px] font-bold">Description (Optional)</label>
                    <textarea
                        className="w-full h-32 border-2 rounded-lg p-3 text-[18px]"
                        placeholder="Add a description for your evidence..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div
                    className={`flex justify-center items-center w-[904px] h-[75px] rounded-2xl cursor-pointer ${
                        isUploading ? 'bg-gray-400' : 'bg-[#BBDCE5] hover:bg-[#9FCAD8]'
                    }`}
                    onClick={!isUploading ? handleSubmit : undefined}

                >
                    <button
                        className="text-[48px] font-bold cursor-pointer"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Submit'}
                    </button>
                </div>
            </div>
        </>
    )
}

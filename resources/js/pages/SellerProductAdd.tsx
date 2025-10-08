import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Inertia } from "@inertiajs/inertia";
import { usePage } from '@inertiajs/react';

export default function SellerProductAdd({ role }) {
    // ================= STATE =================
    const { errors } = usePage().props;
    const [product, setProduct] = useState({
        product_name: "",
        product_price: "",
        description: "",
        shipping_method: [],
        location: "",
        category: "Chair" // default lebih baik bukan "All" karena tidak ada opsi "All"
    });

    const [selectedFile, setSelectedFile] = useState([]);
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: -6.200000,
        lon: 106.816666,
        display_name: "Jakarta"
    });

    const mapRef = useRef(null);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleShippingChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setProduct({
                ...product,
                shipping_method: [...product.shipping_method, value]
            });
        } else {
            setProduct({
                ...product,
                shipping_method: product.shipping_method.filter(item => item !== value)
            });
        }
    };

    const handleClick = () => fileInputRef.current.click();

    // ================= FILE HANDLER =================
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = selectedFile.length + files.length;

        if (totalFiles > 5) {
            setFileError("You can only upload up to 5 images.");
            e.target.value = ""; // reset input agar bisa pilih lagi nanti
            return;
        }

        setFileError("");
        setSelectedFile((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        const newFiles = selectedFile.filter((_, i) => i !== index);
        setSelectedFile(newFiles);
    };

    // ================= LOCATION / MAP =================
    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if(value.length > 2){
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
            const data = await res.json();
            setSuggestions(data);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (s) => {
        const { lat, lon, display_name } = s;
        setSelectedLocation({ lat, lon, display_name });
        setSearchQuery(display_name);
        setSuggestions([]);
        setProduct({ ...product, location: display_name });

        if(mapRef.current) mapRef.current.setView([lat, lon], 15);
    };

    function FlyToMarker({ position }) {
        const map = useMap();
        useEffect(() => {
            if (position) map.flyTo([position.lat, position.lon], 15, { animate: true, duration: 1.5 });
        }, [position, map]);
        return null;
    }

    // ================= SUBMIT =================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedFile.length === 0) {
            setFileError("Please upload at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append("product_name", product.product_name);
        formData.append("product_price", product.product_price);
        formData.append("description", product.description);
        formData.append("location", product.location);
        formData.append("category", product.category);
        product.shipping_method.forEach(item => {
            formData.append('shipping_method[]', item);
        });

        selectedFile.forEach((file) => {
            formData.append("images[]", file);
        });

        Inertia.post('/Seller/product/add', formData, {
            forceFormData: true,
            onSuccess: () => {
                setProduct({
                    product_name: "",
                    product_price: "",
                    description: "",
                    shipping_method: [],
                    location: "",
                    category: "Chair"
                });
                setSelectedFile([]);
                setFileError("");
            },
        });
    };

    // ================= JSX =================
    return (
        <form onSubmit={handleSubmit} className="flex justify-between divide-x-4 divide-[#BBDCE5] w-full h-full bg-[#ECEEDF]">
            {/* ===== LEFT PANEL: IMAGE UPLOAD ===== */}
            <div className="flex-1 flex flex-col items-center gap-5">
                <div className="flex flex-col items-baseline w-full pl-10 py-5">
                    <h1 className="text-[32px] font-bold">Add new Product</h1>
                    <p className="text-[12px]">All fields with <span className="text-red-500">*</span> are required</p>
                </div>

                <div className="flex flex-col justify-center items-center border-3 border-[#2A6C86] w-[289px] h-[195px] gap-3">
                    <img src="/photo.png" alt="photo" className="w-[39px] h-[39px]"/>
                    <p className="text-[#2A6C86] text-[20px]">Product Image (max 5)</p>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                        name="images[]"
                    />
                    <button
                        type="button"
                        className="border-2 border-[#2A6C86] text-[#2A6C86] text-[20px] w-[112px] h-[39px]"
                        onClick={handleClick}
                    >
                        Upload
                    </button>
                    {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>

                <div className="flex flex-col gap-2 flex-wrap pb-5">
                    {selectedFile.map((file, index) => (
                        <div key={index} className="relative w-[280px] h-[200px] border rounded overflow-hidden">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover"/>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== RIGHT PANEL: PRODUCT INFO ===== */}
            <div className="flex-2 flex flex-col justify-center items-start py-5 px-10 gap-10">
                {/* Product Name */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-[32px] font-bold ">Product Name <span className="text-red-500">*</span></h1>
                    <input type="text" className="border-2 w-[982px] h-[50px] text-[32px]" name="product_name" value={product.product_name} onChange={handleChange}/>
                    {errors.product_name && <div className="text-red-500 text-sm mt-1">{errors.product_name}</div>}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-[32px] font-bold">Description <span className="text-red-500">*</span></h1>
                    <input type="text" className="border-2 w-[982px] h-[50px] text-[32px]" name="description" value={product.description} onChange={handleChange}/>
                </div>

                {/* Price + Category */}
                <div className="flex justify-between gap-24">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[32px] font-bold">Product Price</h1>
                        <input type="text" className="border-2 w-[444px] h-[50px] text-[32px]" name="product_price" value={product.product_price} onChange={handleChange}/>
                        {errors.product_price && <div className="text-red-500 text-sm mt-1">{errors.product_price}</div>}
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[32px] font-bold">Product Category</h1>
                        <select name="category" className="border-2 w-[444px] h-[50px] text-[28px] px-3" value={product.category} onChange={handleChange}>
                            <option value="Chair">Chair</option>
                            <option value="Table">Table</option>
                            <option value="Shoes">Shoes</option>
                            <option value="Book">Book</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Bookshelf">Bookshelf</option>
                            <option value="fan">Fan</option>
                            <option value="Stationery">Stationery</option>
                            <option value="Tableware">Tableware</option>
                            <option value="Backpack">Backpack</option>
                            <option value="Jacket">Jacket</option>
                        </select>
                    </div>
                </div>

                {/* Shipping Method */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-[32px] font-bold">COD Method <span className="text-red-500">*</span></h1>
                    <div className="flex justify-between gap-20">
                        <div className="flex justify-between items-center gap-3">
                            <input type="checkbox" className="w-[24px] h-[22px]" value="COD" checked={product.shipping_method.includes("COD")} onChange={handleShippingChange}/>
                            <p className="text-[28px]">COD</p>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                            <input type="checkbox" className="w-[24px] h-[22px]" value="Drop & Pick(TBA)" checked={product.shipping_method.includes("Drop & Pick(TBA)")} onChange={handleShippingChange}/>
                            <p className="text-[28px]">Drop & Pick(TBA)</p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex flex-col items-start gap-5">
                    <h1 className="text-[32px] font-bold">Location <span className="text-red-500">*</span></h1>
                    <div className="relative w-[978px]">
                        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Cari alamat..." className="w-full p-2 border rounded"/>
                        {suggestions.length > 0 && (
                            <ul className="absolute z-100 bg-white border w-full mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((s) => (
                                    <li key={s.place_id} onClick={() => handleSelectSuggestion(s)} className="p-2 hover:cursor-pointer">{s.display_name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="z-0">
                        <MapContainer center={[selectedLocation.lat, selectedLocation.lon]} zoom={13} scrollWheelZoom={true} style={{height: "246px", width: "978px"}} ref={mapRef}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors"/>
                            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                <Popup>{selectedLocation.display_name}</Popup>
                            </Marker>
                            <FlyToMarker position={selectedLocation}/>
                        </MapContainer>

                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end w-full mt-5">
                    <button type="button" onClick={() => window.location.href="/Seller/product"} className="mr-5 w-[197px] h-[62px] border-2 font-bold text-[32px] cursor-pointer">Cancel</button>
                    <button type="submit" className="w-[197px] h-[62px] bg-[#BBDCE5] font-bold text-[28px] cursor-pointer">Add Product</button>
                </div>
            </div>
        </form>
    );
}

import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Inertia } from "@inertiajs/inertia";
import { usePage } from '@inertiajs/react';
import useTranslation from "@/Hooks/useTranslation";

interface SellerProductAddProps {
    role: string;
}

interface LocationSuggestion {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
}

export default function SellerProductAdd({ role }: SellerProductAddProps) {
    // ================= STATE =================
    const { errors } = usePage<any>().props;
    const [product, setProduct] = useState({
        product_name: "",
        product_price: "",
        description: "",
        shipping_method: [] as string[],
        location: "",
        category: "Chair" // default lebih baik bukan "All" karena tidak ada opsi "All"
    });

    const [selectedFile, setSelectedFile] = useState<File[]>([]);
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: -6.200000,
        lon: 106.816666,
        display_name: "Jakarta"
    });

    const mapRef = useRef<any>(null);

    // ================= HANDLE CHANGE =================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleClick = () => fileInputRef.current?.click();

    // ================= FILE HANDLER =================
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const totalFiles = selectedFile.length + files.length;

        if (totalFiles > 5) {
            setFileError("You can only upload up to 5 images.");
            e.target.value = ""; // reset input agar bisa pilih lagi nanti
            return;
        }

        setFileError("");
        setSelectedFile((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFile.filter((_, i) => i !== index);
        setSelectedFile(newFiles);
    };

    // ================= LOCATION / MAP =================
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSelectSuggestion = (s: LocationSuggestion) => {
        const { lat, lon, display_name } = s;
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setSelectedLocation({ lat: latNum, lon: lonNum, display_name });
        setSearchQuery(display_name);
        setSuggestions([]);
        setProduct({ ...product, location: display_name });

        if(mapRef.current) mapRef.current.setView([latNum, lonNum], 15);
    };

    function FlyToMarker({ position }: { position: { lat: number; lon: number } }) {
        const map = useMap();
        useEffect(() => {
            if (position) map.flyTo([position.lat, position.lon], 15, { animate: true, duration: 1.5 });
        }, [position, map]);
        return null;
    }

    // ================= HELPER =================
    const getLocale = () => {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const match = path.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'id';
    };

    // ================= SUBMIT =================
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (selectedFile.length === 0) {
            setFileError("Please upload at least one image.");
            return;
        }

        if (!product.product_name.trim()) {
            alert('Please enter a product name');
            return;
        }

        if (!product.product_price.trim()) {
            alert('Please enter a product price');
            return;
        }

        if (!product.description.trim()) {
            alert('Please enter a product description');
            return;
        }

        if (product.shipping_method.length === 0) {
            alert('Please select at least one COD method');
            return;
        }

        if (!product.location.trim()) {
            alert('Please select a location');
            return;
        }

        const formData = new FormData();
        formData.append("product_name", product.product_name);
        formData.append("product_price", product.product_price.replace(/[^\d]/g, '')); // Remove non-numeric characters
        formData.append("description", product.description);
        formData.append("location", product.location);
        formData.append("category", product.category);
        product.shipping_method.forEach(item => {
            formData.append('shipping_method[]', item);
        });

        selectedFile.forEach((file) => {
            formData.append("images[]", file);
        });

        const locale = getLocale();
        console.log('Submitting product form', {
            locale,
            product_name: product.product_name,
            image_count: selectedFile.length,
            formData_keys: Array.from(formData.keys())
        });

        Inertia.post(`/${locale}/Seller/product/add`, formData, {
            forceFormData: true,
            preserveScroll: false,
            onSuccess: (page) => {
                console.log('Product created successfully', page);
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
                // Navigate to product list after successful creation
                // Use Inertia.visit to ensure proper navigation
                Inertia.visit(`/${locale}/Seller/product`, {
                    preserveState: false,
                    preserveScroll: false,
                });
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                if (errors.images) {
                    alert('Image error: ' + (Array.isArray(errors.images) ? errors.images.join(', ') : errors.images));
                } else if (errors.product_price) {
                    alert('Please enter a valid price (numbers only)');
                } else if (errors.product_name) {
                    alert('Please enter a product name');
                } else if (errors.shipping_method) {
                    alert('Please select at least one shipping method');
                } else if (errors.location) {
                    alert('Please select a location');
                } else {
                    const errorMessage = typeof errors === 'object'
                        ? Object.values(errors).flat().join(', ')
                        : 'Error adding product. Please try again.';
                    alert(errorMessage);
                }
            },
            onFinish: () => {
                console.log('Form submission finished');
            }
        });
    };

    const {t} = useTranslation()

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:divide-x-4 divide-[#BBDCE5] w-full min-h-screen bg-[#ECEEDF]">
            {/* ===== LEFT PANEL: IMAGE UPLOAD ===== */}
            <div className="w-full lg:flex-1 flex flex-col items-center gap-4 sm:gap-5 py-6 px-4 sm:px-6">
                <div className="flex flex-col items-baseline w-full">
                    <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold">{t('Add new Product')}</h1>
                    <p className="text-xs sm:text-sm">{t('All fields')} <span className="text-red-500">*</span> {t('are required')}</p>
                </div>

                <div className="flex flex-col justify-center items-center border-2 sm:border-3 border-[#2A6C86] w-full max-w-[320px] sm:max-w-[289px] h-[180px] sm:h-[195px] gap-3 rounded-lg shadow-md bg-white">
                    <img src="/photo.png" alt="photo" className="w-8 h-8 sm:w-[39px] sm:h-[39px]"/>
                    <p className="text-[#2A6C86] text-base sm:text-lg lg:text-[20px] font-medium text-center px-2">{t('Product Image')} ({t('max')} 5)</p>
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
                        className="border-2 border-[#2A6C86] text-[#2A6C86] text-base sm:text-lg lg:text-[20px] w-28 sm:w-[112px] h-10 sm:h-[39px] rounded hover:bg-[#2A6C86] hover:text-white transition-colors font-medium"
                        onClick={handleClick}
                    >
                        Upload
                    </button>
                    {fileError && <p className="text-red-500 text-xs sm:text-sm mt-2 px-2 text-center">{fileError}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[640px] pb-5">
                    {selectedFile.map((file, index) => (
                        <div key={index} className="relative w-full h-[200px] sm:h-[220px] border-2 rounded-lg overflow-hidden shadow-md">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover"/>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== RIGHT PANEL: PRODUCT INFO ===== */}
            <div className="w-full lg:flex-[2] flex flex-col justify-start items-start py-6 px-4 sm:px-6 lg:px-10 gap-6 sm:gap-8 lg:gap-10">
                {/* Product Name */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Product Name')} <span className="text-red-500">*</span></h1>
                    <input
                        type="text"
                        className="border-2 w-full h-12 sm:h-14 lg:h-[50px] text-lg sm:text-xl lg:text-[32px] px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#2A6C86]"
                        name="product_name"
                        value={product.product_name}
                        onChange={handleChange}
                    />
                    {errors.product_name && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.product_name}</div>}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Description')} <span className="text-red-500">*</span></h1>
                    <textarea
                        className="border-2 w-full min-h-[100px] sm:min-h-[120px] lg:min-h-[150px] text-lg sm:text-xl lg:text-[28px] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2A6C86] resize-y"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Price + Category */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 lg:gap-24 w-full">
                    <div className="flex flex-col gap-2 sm:gap-3 w-full sm:flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Product price')} <span className="text-red-500">*</span></h1>
                        <input
                            type="text"
                            className="border-2 w-full h-12 sm:h-14 lg:h-[50px] text-lg sm:text-xl lg:text-[32px] px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#2A6C86]"
                            name="product_price"
                            value={product.product_price}
                            onChange={handleChange}
                            placeholder="Rp"
                        />
                        {errors.product_price && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.product_price}</div>}
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 w-full sm:flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Product Category')} <span className="text-red-500">*</span></h1>
                        <select
                            name="category"
                            className="border-2 w-full h-12 sm:h-14 lg:h-[50px] text-lg sm:text-xl lg:text-[28px] px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#2A6C86] bg-white"
                            value={product.category}
                            onChange={handleChange}
                        >
                            <option value="Chair">{t('Chair')}</option>
                            <option value="Table">{t('Table')}</option>
                            <option value="Shoes">{t('Shoes')}</option>
                            <option value="Book">{t('Book')}</option>
                            <option value="Electronic">{t('Electronic')}</option>
                            <option value="Bookshelf">{t('Bookshelf')}</option>
                            <option value="fan">{t('Fan')}</option>
                            <option value="Stationery">{t('Stationery')}</option>
                            <option value="Tableware">{t('Tableware')}</option>
                            <option value="Backpack">{t('Backpack')}</option>
                            <option value="Jacket">{t('Jacket')}</option>
                        </select>
                    </div>
                </div>

                {/* Shipping Method */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('COD Method')} <span className="text-red-500">*</span></h1>
                    <div className="flex flex-col sm:flex-row justify-start sm:justify-between gap-4 sm:gap-8 lg:gap-20">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer accent-[#2A6C86]"
                                value="COD"
                                checked={product.shipping_method.includes("COD")}
                                onChange={handleShippingChange}
                            />
                            <p className="text-lg sm:text-xl lg:text-[28px]">COD</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer accent-[#2A6C86]"
                                value="Drop & Pick(TBA)"
                                checked={product.shipping_method.includes("Drop & Pick(TBA)")}
                                onChange={handleShippingChange}
                            />
                            <p className="text-lg sm:text-xl lg:text-[28px]">Drop & Pick(TBA)</p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex flex-col items-start gap-3 sm:gap-4 lg:gap-5 w-full">
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Location')} <span className="text-red-500">*</span></h1>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t('addres')}
                            className="w-full p-3 sm:p-4 border-2 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#2A6C86]"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-50 bg-white border-2 border-gray-300 w-full mt-1 max-h-60 overflow-y-auto rounded-lg shadow-lg">
                                {suggestions.map((s) => (
                                    <li
                                        key={s.place_id}
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="p-3 hover:bg-[#BBDCE5] hover:cursor-pointer text-sm sm:text-base border-b last:border-b-0"
                                    >
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="z-0 w-full rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
                        <MapContainer
                            {...({
                                center: [selectedLocation.lat, selectedLocation.lon],
                                zoom: 13,
                                scrollWheelZoom: true,
                                style: {
                                    height: "250px",
                                    width: "100%"
                                },
                                className: "sm:h-[300px] lg:h-[350px]"
                            } as any)}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[selectedLocation.lat, selectedLocation.lon] as any}>
                                <Popup>{selectedLocation.display_name}</Popup>
                            </Marker>
                            <FlyToMarker position={selectedLocation}/>
                        </MapContainer>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 w-full mt-4 sm:mt-6 lg:mt-5 pb-6">
                    <button
                        type="button"
                        onClick={() => {
                            const path = window.location.pathname;
                            const match = path.match(/^\/([a-z]{2})\//);
                            const locale = match ? match[1] : 'id';
                            window.location.href = `/${locale}/Seller/product`;
                        }}
                        className="w-full sm:w-40 lg:w-[197px] h-12 sm:h-14 lg:h-[62px] border-2 border-gray-600 font-bold text-lg sm:text-xl lg:text-[28px] cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-44 lg:w-[220px] h-12 sm:h-14 lg:h-[62px] bg-[#2A6C86] hover:bg-[#1f5468] text-white font-bold text-lg sm:text-xl lg:text-[28px] cursor-pointer rounded-lg transition-colors shadow-md"
                    >
                        {t('Add Product')}
                    </button>
                </div>
            </div>
        </form>
    );
}

import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

export default function SellerProductEdit({ product: initialProduct }) {
    const { errors } = usePage().props;
    const [removedImages, setRemovedImages] = useState([]);


    // Inisialisasi data produk dari props
    const [product, setProduct] = useState({
        id: initialProduct?.id || "",
        product_name: initialProduct?.product_name || "",
        product_price: initialProduct?.product_price || "",
        description: initialProduct?.description || "",
        shipping_method: initialProduct?.shipping_method || [],
        location: initialProduct?.location || "",
        category: initialProduct?.category || "Chair",
        images: initialProduct?.images || []
    });

    const [selectedFile, setSelectedFile] = useState([]);
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState(product.location || "");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: initialProduct?.lat || -6.2,
        lon: initialProduct?.lon || 106.816666,
        display_name: product.location || "Jakarta"
    });

    const mapRef = useRef(null);

    // === Handle Change ===
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

    // === File Handler ===
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = selectedFile.length + files.length + product.images.length;

        if (totalFiles > 5) {
            setFileError("You can only upload up to 5 images.");
            e.target.value = "";
            return;
        }

        setFileError("");
        setSelectedFile((prev) => [...prev, ...files]);
    };

    const removeFile = (index, isExisting = false) => {
        if (isExisting) {
            const imageToRemove = product.images[index];
            setRemovedImages((prev) => [...prev, imageToRemove]); // catat gambar lama yang dihapus
            const newImages = product.images.filter((_, i) => i !== index);
            setProduct({ ...product, images: newImages });
        } else {
            const newFiles = selectedFile.filter((_, i) => i !== index);
            setSelectedFile(newFiles);
        }
    };


    // === Location Search ===
    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 2) {
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

        if (mapRef.current) mapRef.current.setView([lat, lon], 15);
    };

    function FlyToMarker({ position }) {
        const map = useMap();
        useEffect(() => {
            if (position) map.flyTo([position.lat, position.lon], 15, { animate: true, duration: 1.5 });
        }, [position, map]);
        return null;
    }

    // === Submit Update ===
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_name", product.product_name);
        formData.append("product_price", product.product_price);
        formData.append("description", product.description);
        formData.append("location", product.location);
        formData.append("category", product.category);

        // Pastikan shipping_method adalah array
        const shippingMethods = Array.isArray(product.shipping_method)
            ? product.shipping_method
            : [];


        shippingMethods.forEach((item) => {
            formData.append("shipping_method[]", item);
        });

        selectedFile.forEach((file) => {
            formData.append("images[]", file);
        });

        removedImages.forEach((imgUrl) => {
            formData.append("removed_images[]", imgUrl);
        });

        // Tambahkan override agar dianggap PUT
        formData.append("_method", "put");

        Inertia.post(`/Seller/ProductDetail/${product.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                alert("Product updated successfully!");
                Inertia.visit(`/Seller/ProductDetail/${product.id}`);
            },
        });
    };

    // === Delete Product ===
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            Inertia.delete(`/Seller/ProductDetail/${product.id}`, {
                onSuccess: () => {
                    alert("Product updated successfully!");
                    Inertia.visit(`/Seller/product`);
                },
                onError: (errors) => {
                    console.error(errors);
                    alert("Failed to delete product.");
                },
            });
        }
    };


    // === JSX ===
    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:divide-x-4 divide-[#BBDCE5] w-full min-h-screen bg-[#ECEEDF]">
            {/* ===== LEFT PANEL: IMAGE UPLOAD ===== */}
            <div className="w-full lg:flex-1 flex flex-col items-center gap-4 sm:gap-5 py-6 px-4 sm:px-6">
                <div className="flex flex-col items-baseline w-full">
                    <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold">Edit Product</h1>
                    <p className="text-xs sm:text-sm">All fields with <span className="text-red-500">*</span> are required</p>
                </div>

                {/* Existing Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[640px] pb-5">
                    {product.images.map((img, index) => (
                        <div key={index} className="relative w-full h-[200px] sm:h-[220px] border-2 rounded-lg overflow-hidden shadow-md">
                            <img src={img} alt={`image-${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index, true)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Upload New Images */}
                <div className="flex flex-col justify-center items-center border-2 sm:border-3 border-[#2A6C86] w-full max-w-[320px] sm:max-w-[289px] h-[180px] sm:h-[195px] gap-3 rounded-lg shadow-md bg-white">
                    <img src="/photo.png" alt="photo" className="w-8 h-8 sm:w-[39px] sm:h-[39px]"/>
                    <p className="text-[#2A6C86] text-base sm:text-lg lg:text-[20px] font-medium text-center px-2">Product Image (max 5)</p>
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

                {/* Preview New Files */}
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
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Product Name <span className="text-red-500">*</span></h1>
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
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Description <span className="text-red-500">*</span></h1>
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
                        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Product Price <span className="text-red-500">*</span></h1>
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
                        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Product Category <span className="text-red-500">*</span></h1>
                        <select
                            name="category"
                            className="border-2 w-full h-12 sm:h-14 lg:h-[50px] text-lg sm:text-xl lg:text-[28px] px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#2A6C86] bg-white"
                            value={product.category}
                            onChange={handleChange}
                        >
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
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">COD Method <span className="text-red-500">*</span></h1>
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
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Location <span className="text-red-500">*</span></h1>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Cari alamat..."
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
                        onClick={() => window.location.href="/Seller/product"}
                        className="w-full sm:w-40 lg:w-[197px] h-12 sm:h-14 lg:h-[62px] border-2 border-gray-600 font-bold text-lg sm:text-xl lg:text-[28px] cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full sm:w-40 lg:w-[197px] h-12 sm:h-14 lg:h-[62px] bg-[#F64848] hover:bg-[#d63a3a] font-bold text-lg sm:text-xl lg:text-[24px] cursor-pointer rounded-lg transition-colors shadow-md"
                    >
                        Delete
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-44 lg:w-[220px] h-12 sm:h-14 lg:h-[62px] bg-[#2A6C86] hover:bg-[#1f5468] text-white font-bold text-lg sm:text-xl lg:text-[28px] cursor-pointer rounded-lg transition-colors shadow-md"
                    >
                        Update Product
                    </button>
                </div>
            </div>
        </form>
    );
}


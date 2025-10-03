import { useRef, useState, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup
} from 'react-leaflet'
import axios from "axios";


export default function SellerProductEdit(){
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const handleClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
        let files = Array.from(event.target.files);

        if (files.length > 5) {
        alert("Maks you just can choose 5 picture!");
        files = files.slice(0, 5);
        }

        setSelectedFile(files);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: -6.200000,
        lon: 106.816666,
        display_name: "Jakarta",
    });

    const mapRef = useRef(null);

    // Fungsi update peta saat lokasi berubah
    const updateMap = (lat, lon) => {
        if (mapRef.current) {
            mapRef.current.setView([lat, lon], 15);
        }
    };

    // Ambil rekomendasi dari Nominatim
    useEffect(() => {
    if (!searchQuery) return;

    const delayDebounceFn = setTimeout(async () => {
        try {
        const res = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
            params: {
                q: searchQuery,
                format: "json",
                addressdetails: 1,
                limit: 5,
            },
            }
        );
        setSuggestions(res.data);
        } catch (err) {
        console.error(err);
        }
    }, 300); // tunggu 300ms sebelum fetch

    return () => clearTimeout(delayDebounceFn); // bersihkan timeout saat input berubah
    }, [searchQuery]);


    // Saat user klik rekomendasi
    const handleSelectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        setSelectedLocation({ lat, lon, display_name });
        setSearchQuery(display_name);
        setSuggestions([]);
        localStorage.setItem(
        "selectedLocation",
        JSON.stringify({ lat, lon, display_name })
        );
        updateMap(lat, lon);
    };

    function FlyToMarker({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
        map.flyTo([position.lat, position.lon], 15, { animate: true, duration: 1.5 });
        }
    }, [position, map]);

    return null;
    }

    const goToNext = () => {
        window.location.href = "/Seller/product";
    }
    return(
        <>
            <div className="flex justify-between divide-x-4 divide-[#BBDCE5] w-full h-full bg-[#ECEEDF]">
                <div className="flex-1 flex flex-col items-center gap-5">
                    <div className="flex flex-col items-baseline w-full pl-10 py-5">
                        <h1 className="text-[32px] font-bold">Add new Product</h1>
                        <p className="text-[12px]">All fields with <span className="text-red-500">*</span> are required to filled up</p>
                    </div>
                    <div className="flex flex-col justify-center items-center border-3 border-[#2A6C86] w-[289px] h-[195px] gap-3">
                        <img src="/photo.png" alt="photo" className="w-[39px] h-[39px]"/>
                        <p className="text-[#2A6C86] text-[20px]">Product Image</p>
                        <div>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden"/>
                            <button className="border-2 border-[#2A6C86] text-[#2A6C86] text-[20px] w-[112px] h-[39px]" onClick={handleClick}>Upload</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-wrap">
                        {selectedFile.map((file, index) => (
                        <div key={index} className="w-[280px] h-[200px] border rounded overflow-hidden">
                            <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        ))}
                    </div>
                </div>
                <div className="flex-2 flex flex-col justify-center items-start py-5 px-10 gap-10">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[32px] font-bold">Product Name <span className="text-red-500">*</span></h1>
                        <input type="text" className="border-2 w-[982px] h-[50px] text-[32px]"/>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[32px] font-bold">Description <span className="text-red-500">*</span></h1>
                        <input type="text" className="border-2 w-[982px] h-[50px] text-[32px]"/>
                    </div>
                    <div className="flex justify-between gap-24">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-[32px] font-bold">Product Price</h1>
                            <input type="text" className="border-2 w-[444px] h-[50px] text-[32px]"/>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-3">
                            <h1 className="text-[32px] font-bold">Product Category</h1>
                            <select className="border-2 w-[444px] h-[50px] text-[28px] px-3">
                                <option value="Pilihan 1">Pilihan 1</option>
                                <option value="Pilihan 2">Pilihan 2</option>
                                <option value="Pilihan 3">Pilihan 3</option>
                                <option value="Pilihan 4">Pilihan 4</option>
                            </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[32px] font-bold">COD Method <span className="text-red-500">*</span></h1>
                        <div className="flex justify-between gap-20">
                            <div className="flex justify-between items-center gap-3">
                                <input type="checkbox" className="w-[24px] h-[22px]"/>
                                <p className="text-[28px]">COD</p>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <input type="checkbox" className="w-[24px] h-[22px]"/>
                                <p className="text-[28px]">Drop & Pick(TBA)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start mt-10 gap-20">
                        <div >
                            <h1 className="text-[32px] font-bold">Location <span className="text-red-500">*</span></h1>
                        </div>
                        <div className="flex flex-col justify-center items-start -mt-10 w-full h-full gap-5 z-100">
                                <div className="relative w-[978px]">
                                <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari alamat..."
                                className="w-full p-2 border rounded"
                                />
                                {suggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-y-auto">
                                    {suggestions.map((s) => (
                                    <li
                                        key={s.place_id}
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {s.display_name}
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                            <div className="z-0 self-start">
                                <MapContainer
                                center={[-6.200000, 106.816666]}
                                zoom={13}
                                scrollWheelZoom={true}
                                style={{ height: "246px", width: "978px" }}
                                >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                    <Popup>{selectedLocation.display_name}</Popup>
                                </Marker>
                                <FlyToMarker position={selectedLocation} />
                                </MapContainer>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end w-full">
                        <div className="flex justify-between gap-10">
                            <div className="flex justify-center items-center w-[197px] h-[62px] border-2 hover:cursor-pointer" onClick={goToNext}>
                                <button className="text-[24px] font-bold hover:cursor-pointer" onClick={goToNext}>Cancel</button>
                            </div>
                            <div className="flex justify-center items-center w-[197px] h-[62px] bg-[#BBDCE5] hover:cursor-pointer" onClick={goToNext}>
                                <button className="text-[24px] font-bold hover:cursor-pointer" onClick={goToNext}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

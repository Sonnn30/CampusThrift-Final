import { useState, useRef } from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup
} from 'react-leaflet'
import axios from "axios";
import { router } from '@inertiajs/react';
import CODLocationRoute from '@/routes/CODLocation';
import useTranslation from "@/Hooks/useTranslation";

interface Product {
    id: number;
    product_name: string;
    product_price: number;
    description: string;
    image?: string;
}

interface CODLocationProps {
    product: Product;
    selectedDate: string;
    selectedTime: string;
    availableLocations: string[];
}

export default function CODLocation({ product, selectedDate, selectedTime, availableLocations }: CODLocationProps){
    const getLocale = () => {
        const path = window.location.pathname;
        const match = path.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'id';
    };

    const goToNext = () => {
        const locale = getLocale();

        router.post(CODLocationRoute.store.url({ locale }), {
            location: selectedLocation.display_name,
            product_id: product.id,
            date: selectedDate,
            time: selectedTime
        }, {
            onError: (errors) => {
                console.error('Error submitting appointment:', errors);
                alert("An error occurred. Please try again.");
            }
        });
    }

    const goBack = () => {
        const locale = getLocale();
        router.get(`/${locale}/COD/time`);
    }
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState({hour: "12", minute: "30"});

    useEffect(() => {
        if (selectedDate) {
            setDate(new Date(selectedDate));
        }

        if (selectedTime) {
            const [hour, minute] = selectedTime.split(":");
            setTime({ hour, minute });
        }
    }, [selectedDate, selectedTime])


    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: -6.200000,
        lon: 106.816666,
        display_name: "Jakarta",
    });

    const mapRef = useRef(null);

    // Fungsi update peta saat lokasi berubah
    const updateMap = (lat: number, lon: number) => {
        if (mapRef.current) {
            (mapRef.current as any).setView([lat, lon], 15);
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
    const handleSelectSuggestion = (suggestion: any) => {
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

    function FlyToMarker({ position }: { position: any }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
        map.flyTo([position.lat, position.lon], 15, { animate: true, duration: 1.5 });
        }
    }, [position, map]);

    return null;
    }

    const {t} = useTranslation()


    return(
        <>
        <div className="flex flex-col justify-center items-center w-full min-h-screen p-4 sm:p-6 lg:p-10 bg-gray-50">
            {/* Header */}
            <div className="flex flex-col items-center mt-4 sm:mt-8 lg:mt-12 mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-700">COD</h2>
                <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-bold text-center">{t('Selectlo')}</h1>
            </div>

            {/* Main Container */}
            <div className="flex flex-col lg:flex-row justify-center items-stretch w-full max-w-[1217px] lg:min-h-[880px] border-2 sm:border-4 border-[#BBDCE5] rounded-lg lg:rounded-none bg-white shadow-xl overflow-hidden">
                {/* Left Panel - Info & Selection Display */}
                <div className="flex-1 flex flex-col justify-between items-start p-6 sm:p-8 lg:p-10 border-b-2 lg:border-b-0 lg:border-r-4 border-[#BBDCE5]">
                    <div className="flex flex-col gap-6 sm:gap-8 w-full">
                        {/* Logo */}
                        <div className="flex justify-center lg:justify-start">
                            <img
                                src="/LogoCampusThrift.png"
                                alt="CampusThrift"
                                className="w-[120px] sm:w-[150px] lg:w-[190px] h-auto"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-gray-800">{t('Selectlocation')}</h1>
                        </div>

                        {/* Selected Date Display */}
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <img
                                src="/calendar.png"
                                alt="calendar"
                                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                            />
                            <p className="text-lg sm:text-xl lg:text-[24px] font-medium">
                                {date ? format(date, "dd/MM/yyyy") : t("No Date")}
                            </p>
                        </div>

                        {/* Selected Time Display */}
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <img
                                src="/clock.png"
                                alt="clock"
                                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                            />
                            <p className="text-lg sm:text-xl lg:text-[24px] font-medium">
                                {time.hour}:{time.minute}
                            </p>
                        </div>

                        {/* Selected Location Display */}
                        <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                            <img
                                src="/map.png"
                                alt="map"
                                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 mt-1"
                            />
                            <p className="text-lg sm:text-xl lg:text-[24px] font-medium text-green-700 break-words">
                                {selectedLocation.display_name}
                            </p>
                        </div>
                    </div>

                    {/* Make Appointment Button */}
                    <button
                        className="w-full mt-6 lg:mt-8 rounded-xl h-[56px] sm:h-[60px] lg:h-[68px] bg-[#BBDCE5] text-xl sm:text-2xl lg:text-[32px] font-semibold hover:bg-[#a8cbd6] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        onClick={goToNext}
                    >
                        {t('Make Appointment')}
                    </button>
                </div>

                {/* Right Panel - Map & Location Picker */}
                <div className="flex-1 lg:flex-[1.2] flex flex-col p-6 sm:p-8 lg:p-10 bg-white">
                    <div className="w-full h-full flex flex-col">
                        {/* Header with Back Button */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('Selectalocation')}</h1>
                            <button
                                onClick={goBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Go Back"
                            >
                                <img
                                    src="/undo.png"
                                    alt="back"
                                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[46px] lg:h-[46px] cursor-pointer"
                                />
                            </button>
                        </div>

                        {/* Safe Location Recommendations */}
                        <div className="flex flex-col justify-center items-start p-4 sm:p-5 lg:p-6 text-base sm:text-lg lg:text-[24px] font-semibold mb-4 sm:mb-6 bg-[#BBDCE5] rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <img src="/lock.png" alt="lock" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[25px] lg:h-[25px]"/>
                                <p className="text-sm sm:text-base lg:text-[24px]">{t('Safe COD')}:</p>
                            </div>
                            <div className="text-sm sm:text-base lg:text-[20px] space-y-1">
                                <p>- {t('Kemanggisan Campus')}</p>
                                <p>- {t('Syahdan Campus')}</p>
                                <p>- {t('Binus Square')}</p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-4 sm:mb-6 z-20">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder= {t('Addres')}
                                className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#BBDCE5] focus:border-transparent"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-30 bg-white border-2 border-gray-300 w-full mt-2 max-h-48 sm:max-h-60 overflow-y-auto rounded-lg shadow-lg z-100">
                                    {suggestions.map((s: any) => (
                                        <li
                                            key={s.place_id}
                                            onClick={() => handleSelectSuggestion(s)}
                                            className="p-3 sm:p-4 hover:bg-[#BBDCE5] hover:text-white cursor-pointer transition-colors text-sm sm:text-base border-b last:border-b-0"
                                        >
                                            {s.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Map Container */}
                        <div className="flex-1 w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] rounded-lg overflow-hidden border-2 border-gray-300 shadow-md z-0">
                            <MapContainer
                                {...({
                                    center: [-6.200000, 106.816666],
                                    zoom: 13,
                                    scrollWheelZoom: true,
                                    style: { height: "100%", width: "100%" }
                                } as any)}
                            >
                                <TileLayer
                                    {...({
                                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                        attribution: "&copy; OpenStreetMap contributors"
                                    } as any)}
                                />
                                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                    <Popup>{selectedLocation.display_name}</Popup>
                                </Marker>
                                <FlyToMarker position={selectedLocation} />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Helper Text (Mobile) */}
            <div className="lg:hidden mt-4 text-center text-sm text-gray-600 space-y-1">
                <p>📍 {t('Searchh')}</p>
                <p>{t('Use')}</p>
            </div>
        </div>
        </>

    )
}

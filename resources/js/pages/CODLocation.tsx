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
    const goToNext = () => {
        router.post(CODLocationRoute.store.url(), {
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
        router.get('/COD/time');
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


    return(
        <>
        <div className="flex flex-col justify-center items-center w-full h-full gap-10 mb-20">
            <div className="flex flex-col items-center mt-20">
                <h2 className="text-[40px]">COD</h2>
                <h1 className="text-[54px]">Select your locations</h1>
            </div>
            <div className="flex justify-center items-stretch w-[1217px] h-[880px] divide-x-4  divide-[#BBDCE5] border-4 border-[#BBDCE5]">
                <div className="flex-1 flex justify-start items-start">
                    <div className="flex flex-col justify-between items-start gap-8">
                        <div className="">
                            <img src="/LogoCampusThrift.png" alt="CampusThrift" width={190} height={190} className="mt-10 ml-10"/>
                        </div>
                        <div className="ml-9.5">
                            <h1 className="text-[40px] font-bold">Select Location Page </h1>
                        </div>
                        <div className="flex justify-between ml-9 gap-3">
                            <img src="/calendar.png" alt="calendar" width={40} height={40}/>
                            <p className="text-[24px]">{date ? format(date, "dd/MM/yyyy") : "No date selected"}</p>
                        </div>
                        <div className="flex justify-between ml-9 gap-3">
                                <img src="/clock.png" alt="calendar" width={40} height={40}/>
                                <p className="text-[24px]">{time.hour}:{time.minute}</p>
                        </div>
                        <div className="flex justify-between ml-9 gap-3">
                                <img src="/map.png" alt="calendar" className="absoulute w-[40px] h-[40px]"/>
                                <p className="text-[24px]">{selectedLocation.display_name}</p>
                        </div>
                        <div className="absolute mt-[46%] ml-7 w-[491px] h-[68px] bg-[#BBDCE5] rounded-xl">
                        <button
                            className="absolute inset-0 text-[32px] hover:cursor-pointer"
                            onClick={goToNext}
                        >
                            Make Appointment
                        </button>
                        </div>
                    </div>
                </div>

                <div className="flex-[1.2] flex flex-col items-start mt-8">
                    <div className="pl-5 flex justify-between gap-70">
                        <h1 className="text-[32px] font-bold">Select a Location</h1>
                        <img src="/undo.png" alt="back" className="hover:cursor-pointer" width={46} height={46} onClick={goBack}/>
                    </div>
                        <div className="flex flex-col justify-center items-start ml-5 pl-5 text-[24px] font-semibold mt-10 w-[619px] h-[180px] bg-[#BBDCE5] rounded-xl">
                            <div className="flex justify-between items-center gap-1">
                                <img src="/lock.png" alt="lock" className="w-[25px] h-[25px]"/>
                                <p>Safe COD Location Recommendations:</p>
                            </div>
                                <>
                                    <p>- Campus Kemanggisan</p>
                                    <p>- Campus Syahdan</p>
                                </>
                        </div>
                    <div className="flex flex-col justify-center items-center -mt-20 w-full h-full gap-5 z-100">
                        <div className="relative w-[600px]">
                        <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari alamat..."
                        className="w-full p-2 border rounded"
                        />
                        {suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-y-auto">
                            {suggestions.map((s: any) => (
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
                    <div className="z-0">
                        <MapContainer
                        {...({ center: [-6.200000, 106.816666], zoom: 13, scrollWheelZoom: true, style: { height: "400px", width: "600px" } } as any)}
                        >
                        <TileLayer
                            {...({ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap contributors" } as any)}
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
        </div>
        </>

    )
}

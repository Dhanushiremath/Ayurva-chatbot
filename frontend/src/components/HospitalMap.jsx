import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Navigation, Phone, Globe, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const UserIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#2D4F46; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 0 15px rgba(45, 79, 70, 0.4);'></div>",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const HospitalIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#C16A46; width:26px; height:26px; border-radius:50%; border:3px solid white; box-shadow: 0 0 15px rgba(193, 106, 70, 0.4); display:flex; align-items:center; justify-content:center;'><svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M12 5v14M5 12h14'/></svg></div>",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
});

// Component to handle map centering and bounds fitting
function MapController({ center, destination }) {
    const map = useMap();
    
    useEffect(() => {
        if (destination && center) {
            const bounds = L.latLngBounds([center, [destination.lat, destination.lon]]);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, destination, map]);
    
    return null;
}

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HospitalMap = ({ onClose, language = 'en', isEmbedded = false }) => {
    const t = useTranslation(language);
    const [userLocation, setUserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(10000);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    await fetchNearbyHospitals(latitude, longitude, radius);
                },
                (err) => {
                    setError("Location access denied. Please enable location to find nearby hospitals.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    const fetchNearbyHospitals = async (lat, lon, searchRadius) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/hospitals/nearby`, {
                params: { lat, lon, radius: searchRadius }
            });
            setHospitals(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching hospitals:', err);
            setError("Could not fetch nearby hospitals.");
            setLoading(false);
        }
    };

    const handleExpandSearch = async () => {
        const newRadius = radius + 10000;
        setRadius(newRadius);
        if (userLocation) {
            await fetchNearbyHospitals(userLocation[0], userLocation[1], newRadius);
        }
    };

    const handleSetDestination = (hospital) => {
        setDestination(hospital);
        setSelectedHospital(hospital); // Keep it selected to show the card
    };

    return (
        <>
            {/* Backdrop for the drawer - only show if not embedded */}
            {!isEmbedded && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-[2px]"
                />
            )}

            <div className={isEmbedded 
                ? "h-full w-full bg-white flex flex-col overflow-hidden" 
                : "fixed inset-y-0 right-0 z-[100] w-full sm:w-[450px] bg-white/95 backdrop-blur-xl shadow-[-20px_0_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 border-l border-white/20"
            }>
                {/* Header */}
                <div className="p-5 sm:p-7 border-b border-slate-100 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/10">
                        <MapPin size={22} className="text-[#E8B67D]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-primary serif leading-tight">{t.nearbyHospitals || 'Nearby Hospitals'}</h2>
                        <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                            {loading ? t.locating : `${hospitals.length} ${t.facilitiesFound}`}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl transition-all border border-slate-100"
                >
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                {loading && !userLocation && (
                    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                        <Loader2 size={40} className="text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">{t.findingLocation}</h3>
                    </div>
                )}

                {userLocation && (
                    <MapContainer 
                        center={userLocation} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapController center={userLocation} destination={destination} />

                        <Marker position={userLocation} icon={UserIcon} />

                        {hospitals.map(hospital => (
                            <Marker 
                                key={hospital.id} 
                                position={[hospital.lat, hospital.lon]}
                                icon={HospitalIcon}
                                eventHandlers={{
                                    click: () => setSelectedHospital(hospital)
                                }}
                            />
                        ))}

                        {destination && (
                            <Polyline 
                                positions={[userLocation, [destination.lat, destination.lon]]}
                                color="#C16A46"
                                weight={5}
                                dashArray="12, 12"
                                opacity={0.7}
                            />
                        )}
                    </MapContainer>
                )}

                {/* Info Card - Slide Up */}
                <AnimatePresence>
                    {selectedHospital && (
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 z-30 m-4 bg-white rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 bg-secondary text-white text-[9px] font-black uppercase rounded-lg tracking-widest">
                                                {selectedHospital.type}
                                            </span>
                                            {selectedHospital.emergency && (
                                                <span className="px-2.5 py-1 bg-[#2D4F46]/10 text-[#2D4F46] text-[9px] font-black uppercase rounded-lg tracking-widest border border-[#2D4F46]/20">
                                                    {t.emergencyOpen}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-primary serif leading-tight">{selectedHospital.name}</h3>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedHospital(null)}
                                        className="p-1.5 bg-slate-50 rounded-full hover:bg-slate-100"
                                    >
                                        <X size={16} className="text-slate-400" />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                                    {selectedHospital.address}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {selectedHospital.phone ? (
                                        <a href={`tel:${selectedHospital.phone}`} className="flex items-center justify-center gap-2 bg-primary text-[#E8B67D] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg">
                                            <Phone size={14} /> {t.call}
                                        </a>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 bg-slate-50 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed border border-slate-100">
                                            <Phone size={14} /> {t.noPhone}
                                        </div>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleSetDestination(selectedHospital)}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
                                            destination?.id === selectedHospital.id 
                                            ? 'bg-secondary text-white shadow-secondary/20' 
                                            : 'bg-primary text-white hover:opacity-90'
                                        }`}
                                    >
                                        <Navigation size={14} /> 
                                        {destination?.id === selectedHospital.id ? t.active : t.getRoute}
                                    </button>
                                </div>

                                {destination?.id === selectedHospital.id && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-green-600 animate-pulse">
                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                        {t.routeLineActive}
                                    </div>
                                )}
                                
                                <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                                    target="_blank"
                                    className="mt-4 block w-full py-3 border-2 border-slate-100 text-slate-600 rounded-2xl text-xs font-bold text-center hover:bg-slate-50 transition-all font-bold"
                                >
                                    {t.startNavigation}
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {!loading && userLocation && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-3">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                        {t.searchingWithin} {radius/1000}{t.kmAway}
                    </div>
                    <button 
                        onClick={handleExpandSearch}
                        disabled={loading || radius >= 50000}
                        className="w-full py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all"
                    >
                        {loading ? t.expandingSearch : `${t.findMoreArea} ${(radius + 10000)/1000}${t.kmAway}`}
                    </button>
                </div>
            )}
        </div>
    </>
);
};

export default HospitalMap;

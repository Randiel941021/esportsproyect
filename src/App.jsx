import { useState, useEffect } from "react";
import EventCard from "./components/EventCard";
import Tabs from "./components/Tabs";
import Sidebar from "./components/Sidebar";
import BetSlip from "./components/BetSlip";
import { eventsData } from "./data/events";
import "./App.css";


function App() {
  const [selectedSport, setSelectedSport] = useState("Todos");
  
  // Función que lee el localStorage al arrancar (solo se ejecuta una vez)
const loadSelections = () => {
  try {
    const saved = localStorage.getItem("betSlip");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error al cargar el boleto:", error);
    return [];
  }
};

// Estado inicial = lo que había guardado (o array vacío)
const [selections, setSelections] = useState(loadSelections);
// Estado de la pestaña activa (lee del localStorage al arrancar)
const [activeTab, setActiveTab] = useState(
  () => localStorage.getItem("activeTab") || "todos"
);

// Guardar la pestaña activa en localStorage
useEffect(() => {
  localStorage.setItem("activeTab", activeTab);
}, [activeTab]);

// Controla si el boleto está abierto (solo para móvil)
const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);

// Estado del buscador (lee de localStorage al arrancar)
const [searchTerm, setSearchTerm] = useState(
  () => localStorage.getItem("searchTerm") || ""
);

// Cada vez que cambien las selecciones, guardarlas en localStorage
useEffect(() => {
  localStorage.setItem("betSlip", JSON.stringify(selections));
}, [selections]);

  const sports = ["Todos", ...new Set(eventsData.map((e) => e.sport))];

  // 1. Filtrar por deporte (sidebar)
const eventsBySport =
  selectedSport === "Todos"
    ? eventsData
    : eventsData.filter((e) => e.sport === selectedSport);

// 2. Separar en vivo y próximos (para los counts de las pestañas)
const allLiveEvents = eventsBySport.filter((e) => e.isLive);
const allUpcomingEvents = eventsBySport.filter((e) => !e.isLive);

// 3. Filtrar por la pestaña activa
let eventsToShow;
if (activeTab === "live") {
  eventsToShow = allLiveEvents;
} else if (activeTab === "upcoming") {
  eventsToShow = allUpcomingEvents;
} else {
  eventsToShow = eventsBySport; // "todos"
}

  const toggleSelection = (event, teamKey) => {
    const teamName = event[teamKey];
    const odd = event.odds[teamKey];

    const alreadySelected = selections.some(
      (s) => s.eventId === event.id && s.team === teamName
    );

    if (alreadySelected) {
      // Quitar del boleto
      setSelections(
        selections.filter(
          (s) => !(s.eventId === event.id && s.team === teamName)
        )
      );
    } else {
      // Añadir al boleto
      setSelections([
        ...selections,
        {
          eventId: event.id,
          sport: event.sport,
          tournament: event.tournament,
          team: teamName,
          odd: odd,
        },
      ]);
    }
  };

  const removeSelection = (selection) => {
    setSelections(selections.filter((s) => s !== selection));
  };

  const clearSelections = () => setSelections([]);

  return (
    <div className="layout">
      <Sidebar
        sports={sports}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
      />
      <div className="container">
        <h1>eSports</h1>

<Tabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  counts={{ live: allLiveEvents.length, upcoming: allUpcomingEvents.length }}
/>

{eventsToShow.length === 0 ? (
  <p className="empty-message">No hay eventos para mostrar.</p>
) : (
  <div className="events-grid">
    {eventsToShow.map((event) => (
      <EventCard
        key={event.id}
        event={event}
        selections={selections}
        onToggle={toggleSelection}
      />
    ))}
  </div>
)}
      </div>

      {/* Botón flotante para abrir el boleto en móvil */}
<button
  className="mobile-betslip-btn"
  onClick={() => setIsBetSlipOpen(true)}
>
  🎟️ Boleto
  {selections.length > 0 && (
    <span className="mobile-betslip-count">{selections.length}</span>
  )}
</button> 

      <BetSlip
  selections={selections}
  onRemove={removeSelection}
  onClear={clearSelections}
  isOpen={isBetSlipOpen}
  onClose={() => setIsBetSlipOpen(false)}
/>
    </div>
  );
}

export default App;
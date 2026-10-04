'use client';

import { useEffect, useState } from 'react';
import BetSlip from '../src/components/BetSlip';
import EventCard from '../src/components/EventCard';
import Sidebar from '../src/components/Sidebar';
import Tabs from '../src/components/Tabs';
import { eventsData } from '../src/data/events';

function Page() {
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [selections, setSelections] = useState([]);
  const [activeTab, setActiveTab] = useState('todos');
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [stake, setStake] = useState(10);
  const [balance, setBalance] = useState(500);
  const [placedBets, setPlacedBets] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      const savedSelections = localStorage.getItem('betSlip');
      const savedTab = localStorage.getItem('activeTab');
      const savedStake = localStorage.getItem('betStake');
      const savedPlacedBets = localStorage.getItem('placedBets');
      const savedBalance = localStorage.getItem('walletBalance');

      if (savedSelections) {
        setSelections(JSON.parse(savedSelections));
      }

      if (savedTab) {
        setActiveTab(savedTab);
      }

      if (savedStake) {
        const parsedStake = Number(savedStake);
        if (Number.isFinite(parsedStake) && parsedStake > 0) {
          setStake(parsedStake);
        }
      }

      if (savedPlacedBets) {
        const parsedBets = JSON.parse(savedPlacedBets);
        if (Array.isArray(parsedBets)) {
          setPlacedBets(parsedBets);
        }
      }

      if (savedBalance) {
        const parsedBalance = Number(savedBalance);
        if (Number.isFinite(parsedBalance) && parsedBalance >= 0) {
          setBalance(parsedBalance);
        }
      }
    } catch (error) {
      console.error('Error al cargar el estado guardado:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('betSlip', JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    localStorage.setItem('betStake', String(stake));
  }, [stake]);

  useEffect(() => {
    localStorage.setItem('walletBalance', String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('placedBets', JSON.stringify(placedBets));
  }, [placedBets]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToastMessage('');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsBetSlipOpen(false);
      }
    };

    if (isBetSlipOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isBetSlipOpen]);

  const sports = ['Todos', ...new Set(eventsData.map((event) => event.sport))];

  const eventsBySport =
    selectedSport === 'Todos'
      ? eventsData
      : eventsData.filter((event) => event.sport === selectedSport);

  const allLiveEvents = eventsBySport.filter((event) => event.isLive);
  const allUpcomingEvents = eventsBySport.filter((event) => !event.isLive);

  let eventsToShow = eventsBySport;
  if (activeTab === 'live') {
    eventsToShow = allLiveEvents;
  } else if (activeTab === 'upcoming') {
    eventsToShow = allUpcomingEvents;
  }

  const toggleSelection = (event, teamKey) => {
    const teamName = event[teamKey];
    const odd = event.odds[teamKey];

    const existingSelection = selections.find(
      (selection) => selection.eventId === event.id,
    );

    if (existingSelection?.team === teamName) {
      setSelections((current) =>
        current.filter(
          (selection) => !(selection.eventId === event.id && selection.team === teamName),
        ),
      );
      return;
    }

    setSelections((current) => {
      const withoutCurrentEvent = current.filter(
        (selection) => selection.eventId !== event.id,
      );

      return [
        ...withoutCurrentEvent,
        {
          eventId: event.id,
          sport: event.sport,
          tournament: event.tournament,
          team: teamName,
          odd,
        },
      ];
    });
  };

  const removeSelection = (selection) => {
    setSelections((current) => current.filter((item) => item !== selection));
  };

  const clearSelections = () => setSelections([]);

  const placeBet = () => {
    if (selections.length === 0) {
      return;
    }

    const totalOdds = selections.reduce((acc, entry) => acc * entry.odd, 1);
    const totalStake = Number(stake) || 0;

    if (totalStake > balance) {
      setToastMessage('Saldo insuficiente para esta apuesta');
      return;
    }

    const payout = totalOdds * totalStake;

    const bet = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      stake: totalStake,
      totalOdds,
      payout,
      betType: selections.length > 1 ? 'Combinada' : 'Simple',
      status: 'Pendiente',
      selections: selections.map((selection) => ({
        team: selection.team,
        tournament: selection.tournament,
        sport: selection.sport,
      })),
    };

    setBalance((current) => current - totalStake);
    setPlacedBets((current) => [bet, ...current].slice(0, 5));
    setToastMessage('Apuesta registrada correctamente');
    clearSelections();
    setIsBetSlipOpen(false);
  };

  return (
    <main className="layout">
      <Sidebar
        sports={sports}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
      />

      <div className="container">
        <header className="top-bar">
          <div className="brand-block">
            <div className="brand-mark">B</div>
            <div>
              <p className="eyebrow">Sportsbook</p>
              <h1>BetPrime</h1>
            </div>
          </div>

          <nav className="top-nav" aria-label="Navegación principal">
            <button type="button" className="nav-link active">Inicio</button>
            <button type="button" className="nav-link">Mercados</button>
            <button type="button" className="nav-link">En vivo</button>
            <button type="button" className="nav-link">Mis apuestas</button>
          </nav>

          <div className="wallet-card">
            <span>Saldo</span>
            <strong>€{balance.toFixed(2)}</strong>
          </div>
        </header>

        <section className="promo-banner">
          <div className="promo-copy">
            <span className="promo-tag">Featured</span>
            <h2>Cuotas de elite para la jornada más caliente</h2>
            <p>
              Mercado premium con partidos decisivos, valor real y opciones en directo para apostar
              con estrategia desde el primer minuto.
            </p>
            <div className="promo-actions">
              <button type="button">Ver mercados</button>
              <button type="button" className="promo-primary">Apostar hoy</button>
            </div>
          </div>

          <div className="promo-match">
            <span className="promo-match-label">Jornada 28</span>
            <div className="promo-match-teams">
              <strong>Real Madrid</strong>
              <span>vs</span>
              <strong>Barcelona</strong>
            </div>
            <div className="promo-match-status">
              <span className="live-dot" />
              En directo
            </div>
            <div className="promo-match-odds">
              <span>1.85</span>
              <span>3.40</span>
              <span>2.30</span>
            </div>
          </div>
        </section>

        <div className="overview-stats">
          <div className="stat-card">
            <span>Activas</span>
            <strong>{selections.length}</strong>
          </div>
          <div className="stat-card">
            <span>Cuota total</span>
            <strong>{selections.length > 0 ? selections.reduce((acc, item) => acc * item.odd, 1).toFixed(2) : '0.00'}</strong>
          </div>
          <div className="stat-card">
            <span>Potencial</span>
            <strong>€{selections.length > 0 ? (selections.reduce((acc, item) => acc * item.odd, 1) * stake).toFixed(2) : '0.00'}</strong>
          </div>
        </div>

        <section className="featured-strip" aria-label="Competencias destacadas">
          <div className="featured-item">
            <span className="featured-label">LaLiga</span>
            <strong>12 partidos</strong>
            <small>Cuotas en directo</small>
          </div>
          <div className="featured-item">
            <span className="featured-label">Premier</span>
            <strong>8 partidos</strong>
            <small>Mercados activos</small>
          </div>
          <div className="featured-item">
            <span className="featured-label">Champions</span>
            <strong>5 partidos</strong>
            <small>Riesgo alto</small>
          </div>
        </section>

        <section className="info-grid">
          <div className="standings-box">
            <div className="panel-head">
              <div>
                <p>Clasificación</p>
                <h3>Top 4</h3>
              </div>
              <span>2026</span>
            </div>
            <div className="standings-list">
              <div className="standing-row">
                <span>1</span>
                <strong>Real Madrid</strong>
                <em>58 pts</em>
              </div>
              <div className="standing-row">
                <span>2</span>
                <strong>Barcelona</strong>
                <em>54 pts</em>
              </div>
              <div className="standing-row">
                <span>3</span>
                <strong>Atletico</strong>
                <em>49 pts</em>
              </div>
              <div className="standing-row">
                <span>4</span>
                <strong>Girona</strong>
                <em>46 pts</em>
              </div>
            </div>
          </div>

          <div className="market-box">
            <div className="panel-head">
              <div>
                <p>Mercados</p>
                <h3>Popular</h3>
              </div>
              <span>Hoy</span>
            </div>
            <div className="market-pill-list">
              <button type="button">1X2</button>
              <button type="button">Ambos marcan</button>
              <button type="button">Más de 2.5</button>
              <button type="button">Hándicap</button>
              <button type="button">Corners</button>
              <button type="button">Tarjetas</button>
            </div>
          </div>
        </section>

        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            live: allLiveEvents.length,
            upcoming: allUpcomingEvents.length,
          }}
        />

        <section className="top-odds-panel">
          <div className="top-odds-header">
            <div>
              <p>Destacados</p>
              <h2>Mejores cuotas</h2>
            </div>
            <span>Hoy</span>
          </div>

          <div className="top-odds-list">
            {eventsData.slice(0, 4).map((event) => {
              const bestOdd = Math.max(...Object.values(event.odds));
              const bestTeam = Object.entries(event.odds).find(
                ([, odd]) => odd === bestOdd,
              )?.[0];

              return (
                <button
                  key={event.id}
                  type="button"
                  className="top-odd-item"
                  onClick={() => {
                    const teamKey = bestTeam === 'team1' ? 'team1' : 'team2';
                    toggleSelection(event, teamKey);
                    setIsBetSlipOpen(true);
                  }}
                >
                  <div className="top-odd-meta">
                    <span>{event.sport}</span>
                    <strong>{event.team1}</strong>
                    <small>vs {event.team2}</small>
                  </div>
                  <div className="top-odd-value">
                    <span>Mejor cuota</span>
                    <strong>{bestOdd.toFixed(2)}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="market-toolbar">
          <div className="market-filters">
            <button type="button" className="market-filter active">Todas</button>
            <button type="button" className="market-filter">En vivo</button>
            <button type="button" className="market-filter">LaLiga</button>
            <button type="button" className="market-filter">Premier</button>
            <button type="button" className="market-filter">Champions</button>
          </div>

          <div className="market-actions">
            <button type="button">Ver partidos</button>
            <button type="button" className="primary">Apostar ya</button>
          </div>
        </section>

        <section className="live-market-panel">
          <div className="live-market-header">
            <div>
              <p>En directo</p>
              <h2>Mercado activo</h2>
            </div>
            <span>{allLiveEvents.length} partidos</span>
          </div>

          <div className="live-market-list">
            {allLiveEvents.slice(0, 3).map((event) => {
              const score = event.score ? event.score.split(' - ') : ['', ''];
              return (
                <div key={event.id} className="live-market-item">
                  <div className="live-market-score">
                    <span>{event.team1}</span>
                    <strong>{score[0]}</strong>
                  </div>
                  <div className="live-market-vs">vs</div>
                  <div className="live-market-score right">
                    <strong>{score[1]}</strong>
                    <span>{event.team2}</span>
                  </div>
                  <div className="live-market-meta">
                    <span>{event.tournament}</span>
                    <button type="button" onClick={() => toggleSelection(event, 'team1')}>
                      {event.team1} {event.odds.team1}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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

        {placedBets.length > 0 && (
          <section className="history-panel">
            <div className="history-header">
              <h2>Mis apuestas</h2>
              <span>{placedBets.length}</span>
            </div>

            <div className="history-list">
              {placedBets.map((bet) => (
                <div key={bet.id} className="history-item">
                  <div className="history-main">
                    <span className="history-date">
                      {new Date(bet.createdAt).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <strong>{bet.selections.map((entry) => entry.team).join(' / ')}</strong>
                  </div>

                  <div className="history-meta">
                    <span className={`history-status ${bet.status === 'Pendiente' ? 'pending' : 'won'}`}>
                      {bet.status}
                    </span>
                    <span>{bet.betType}</span>
                    <span>Stake: €{bet.stake.toFixed(2)}</span>
                    <span>Odds: {bet.totalOdds.toFixed(2)}</span>
                    <span>Payout: €{bet.payout.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <button
        type="button"
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
        stake={stake}
        onStakeChange={(value) => setStake(value)}
        onPlaceBet={placeBet}
        onRemove={removeSelection}
        onClear={clearSelections}
        isOpen={isBetSlipOpen}
        onClose={() => setIsBetSlipOpen(false)}
      />

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </main>
  );
}

export default Page;

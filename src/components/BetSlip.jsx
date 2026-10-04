import { Button, Card, CardContent } from '@heroui/react';

function BetSlip({
  selections,
  stake,
  onStakeChange,
  onPlaceBet,
  onRemove,
  onClear,
  isOpen,
  onClose,
}) {
  const totalOdds = selections.reduce((acc, s) => acc * s.odd, 1);
  const potentialReturn = totalOdds * stake;
  const profit = potentialReturn - stake;
  const normalizedStake = Number.isFinite(Number(stake)) ? Number(stake) : 0;
  const betType = selections.length > 1 ? 'Combinada' : 'Simple';

  return (
    <>
      <div
        className={`bet-slip-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        role="presentation"
        aria-hidden={!isOpen}
      />

      <aside
        className={`bet-slip ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="bet-slip-header">
          <div className="bet-slip-header-actions">
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label="Cerrar boleto"
            >
              ✕
            </button>
            <h3>Slip ({selections.length})</h3>
          </div>

          {selections.length > 0 && (
            <button type="button" className="clear-btn" onClick={onClear}>
              Limpiar
            </button>
          )}
        </div>

        {selections.length === 0 ? (
          <p className="bet-slip-empty">
            Selecciona una cuota para añadirla al slip.
          </p>
        ) : (
          <>
            <ul className="bet-slip-list">
              {selections.map((s, i) => (
                <li key={i} className="bet-slip-item">
                  <Card className="bet-slip-card">
                    <CardContent className="bet-slip-card-body">
                      <div className="bet-slip-info">
                        <span className="bet-slip-sport">{s.sport}</span>
                        <span className="bet-slip-team">{s.team}</span>
                        <span className="bet-slip-tournament">{s.tournament}</span>
                      </div>

                      <div className="bet-slip-right">
                        <span className="bet-slip-odd">{s.odd.toFixed(2)}</span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="remove-btn"
                          onPress={() => onRemove(s)}
                        >
                          ✕
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>

            <div className="bet-slip-stake">
              <div className="bet-slip-bet-type">
                <span className="bet-slip-bet-type-label">Tipo</span>
                <strong>{betType}</strong>
              </div>

              <label htmlFor="stake-input">Apuesta</label>
              <div className="bet-slip-stake-input-wrap">
                <span>€</span>
                <input
                  id="stake-input"
                  type="number"
                  min="1"
                  step="1"
                  value={normalizedStake}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    onStakeChange(
                      Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1,
                    );
                  }}
                />
              </div>
            </div>

            <div className="bet-slip-footer">
              <div className="bet-slip-total">
                <span>Cuota total</span>
                <span className="total-value">{totalOdds.toFixed(2)}</span>
              </div>

              <div className="bet-slip-payout">
                <div>
                  <span>Ganancia estimada</span>
                  <strong>€{profit.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Retorno total</span>
                  <strong>€{potentialReturn.toFixed(2)}</strong>
                </div>
              </div>

              <Button
                color="primary"
                className="bet-btn"
                fullWidth
                onPress={onPlaceBet}
              >
                Realizar apuesta
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default BetSlip;
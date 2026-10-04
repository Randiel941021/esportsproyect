import { Button, Card, CardContent, CardHeader, Chip } from '@heroui/react';

function EventCard({ event, selections, onToggle }) {
  const isSelected = (teamKey) =>
    selections.some((s) => s.eventId === event.id && s.team === event[teamKey]);

  const team1Selected = isSelected('team1');
  const team2Selected = isSelected('team2');

  return (
    <Card className="event-card">
      <CardHeader className="event-header">
        <div className="event-header-main">
          <span className="sport">{event.sport}</span>
          <span className="tournament">{event.tournament}</span>
        </div>
        {event.isLive && (
          <Chip color="danger" size="sm" variant="flat">
            EN VIVO
          </Chip>
        )}
      </CardHeader>

      <CardContent className="event-body">
        <div className="teams">
          <div className="team">
            <span>{event.team1}</span>
            <span className="score">
              {event.score ? event.score.split(' - ')[0] : ''}
            </span>
          </div>
          <div className="team">
            <span>{event.team2}</span>
            <span className="score">
              {event.score ? event.score.split(' - ')[1] : ''}
            </span>
          </div>
        </div>

        <div className="odds">
          <Button
            className={`odds-btn ${team1Selected ? 'selected' : ''}`}
            color={team1Selected ? 'primary' : 'default'}
            variant={team1Selected ? 'solid' : 'flat'}
            onPress={() => onToggle(event, 'team1')}
          >
            <span className="odd-label">{event.team1}</span>
            <span className="odd-value">{event.odds.team1}</span>
          </Button>

          <Button
            className={`odds-btn ${team2Selected ? 'selected' : ''}`}
            color={team2Selected ? 'primary' : 'default'}
            variant={team2Selected ? 'solid' : 'flat'}
            onPress={() => onToggle(event, 'team2')}
          >
            <span className="odd-label">{event.team2}</span>
            <span className="odd-value">{event.odds.team2}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventCard;
import { Button } from '@heroui/react';

function Sidebar({ sports, selectedSport, onSelectSport }) {
  return (
    <aside className="sidebar">
      <h3>Ligas</h3>
      <ul>
        {sports.map((sport) => {
          const isActive = selectedSport === sport;

          return (
            <li key={sport}>
              <Button
                fullWidth
                variant={isActive ? 'solid' : 'bordered'}
                color={isActive ? 'primary' : 'default'}
                className="sidebar-button"
                onPress={() => onSelectSport(sport)}
              >
                {sport}
              </Button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
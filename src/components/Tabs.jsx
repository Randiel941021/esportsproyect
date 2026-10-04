import { Tabs as HeroTabs, TabList, Tab } from '@heroui/react';

function Tabs({ activeTab, onTabChange, counts }) {
  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'live', label: 'En vivo', count: counts.live },
    { id: 'upcoming', label: 'Próximos', count: counts.upcoming },
  ];

  return (
    <HeroTabs
      aria-label="Filtrar eventos"
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(String(key))}
      className="hero-tabs"
      color="primary"
      variant="underlined"
    >
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.id}>
            <span className="tab-title">
              {tab.label}
              {tab.count !== undefined && (
                <span className="tab-count">{tab.count}</span>
              )}
            </span>
          </Tab>
        ))}
      </TabList>
    </HeroTabs>
  );
}

export default Tabs;
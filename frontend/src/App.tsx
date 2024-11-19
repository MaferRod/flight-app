import React, { useState } from 'react';
import FlightSearchForm from './components/FlightSearchForm';
import FlightList from './components/FlightList';

const App: React.FC = () => {
  const [flights, setFlights] = useState<any[]>([]);

  return (
    <div>
      <h1>Flight Search</h1>
      <FlightSearchForm setFlights={setFlights} />
      <FlightList flights={flights} />
    </div>
  );
};

export default App;


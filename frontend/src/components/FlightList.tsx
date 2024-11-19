import React from 'react';

interface FlightListProps {
  flights: any[];
}

const FlightList: React.FC<FlightListProps> = ({ flights }) => {
  return (
    <div>
      {flights.length > 0 ? (
        <ul>
          {flights.map((flight, index) => (
            <li key={index}>
              <p><strong>{flight.airline}</strong></p>
              <p>{flight.departure} → {flight.arrival}</p>
              <p>{flight.price} {flight.currency}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights found.</p>
      )}
    </div>
  );
};

export default FlightList;

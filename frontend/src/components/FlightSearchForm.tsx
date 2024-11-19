import React, { useState } from 'react';
import axios from 'axios';

interface FlightSearchFormProps {
  setFlights: (flights: any[]) => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ setFlights }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [nonStop, setNonStop] = useState(false);
  const [adults, setAdults] = useState(1);  // Default to 1 adult

  // Validation to enable/disable the search button
  const isFormValid =
    departure &&
    arrival &&
    departureDate &&
    adults > 0;

  // Function to fetch flights directly within the form component
  const fetchFlights = async (
    departure: string,
    arrival: string,
    departureDate: string,
    returnDate: string,
    currency: string,
    nonStop: boolean,
    adults: number
  ) => {
    try {
      const API_URL = 'http://localhost:9090'; // Backend URL
      const response = await axios.get(`${API_URL}/flights`, {
        params: {
          departure,
          arrival,
          departureDate,
          returnDate,
          currency,
          nonStop,
          adults,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Call the API directly from the form
      const flights = await fetchFlights(
        departure,
        arrival,
        departureDate,
        returnDate,
        currency,
        nonStop,
        adults
      );
      setFlights(flights);
    } catch (error) {
      console.error("Error al buscar vuelos:", error);
      // Handle error more gracefully if needed (e.g., show a message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Departure Airport (Origin)</label>
      <input 
        type="text" 
        value={departure} 
        onChange={(e) => setDeparture(e.target.value)} 
        placeholder="e.g., SFO" 
      />

      <label>Arrival Airport (Destination)</label>
      <input 
        type="text" 
        value={arrival} 
        onChange={(e) => setArrival(e.target.value)} 
        placeholder="e.g., JFK" 
      />

      <label>Departure Date</label>
      <input 
        type="date" 
        value={departureDate} 
        onChange={(e) => setDepartureDate(e.target.value)} 
      />

      <label>Return Date (Optional)</label>
      <input 
        type="date" 
        value={returnDate} 
        onChange={(e) => setReturnDate(e.target.value)} 
      />

      <label>Currency</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="MXN">MXN</option>
        <option value="EUR">EUR</option>
      </select>

      <label>Non-stop</label>
      <input 
        type="checkbox" 
        checked={nonStop} 
        onChange={(e) => setNonStop(e.target.checked)} 
      />

      <label>Adults</label>
      <input 
        type="number" 
        value={adults} 
        min={1} 
        onChange={(e) => setAdults(parseInt(e.target.value, 10))} 
      />

      <button type="submit" disabled={!isFormValid}>
        Search
      </button>
    </form>
  );
};

export default FlightSearchForm;

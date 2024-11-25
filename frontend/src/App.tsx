import React from 'react';
import './App.css';
import SearchForm from './components/SearchFlights/SearchFlights';
import { Route, Routes,BrowserRouter } from 'react-router-dom';
import Results from './components/Results/Results';
import { FlightResultProvider } from './contexts/FlightResultsContext';
import DetailsPage from './components/Details/details';

function App() {
  return (
    <FlightResultProvider>
          <BrowserRouter>
              <Routes>
                  <Route path='/' element={<SearchForm/>}></Route>
                  <Route path='/results' element={<Results></Results>}></Route>
                  <Route path='/details' element={<DetailsPage></DetailsPage>}></Route>
              </Routes>
        </BrowserRouter>

    </FlightResultProvider>


  );
}

export default App;

package com.example.backend.controller;

import com.example.backend.model.FlightRequest;
import com.example.backend.model.FlightResponse;
import com.example.backend.services.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightOffer>> searchFlights(
        @RequestParam String departure,
        @RequestParam String arrival,
        @RequestParam String departureDate,
        @RequestParam(required = false) String returnDate,
        @RequestParam(defaultValue = "USD") String currency,
        @RequestParam(defaultValue = "false") boolean nonStop,
        @RequestParam(defaultValue = "1") int adults
    ) {
        FlightRequest request = new FlightRequest(departure, arrival, departureDate, returnDate, currency, nonStop, adults);
        List<FlightOffer> flights = flightService.searchFlights(request);
        return ResponseEntity.ok(flights);
    }
    
}


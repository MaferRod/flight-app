package com.example.backend.services;

import com.example.backend.model.FlightRequest;
import com.example.backend.model.FlightResponse;
import com.example.backend.util.AmadeusClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final AmadeusClient amadeusClient;

    public FlightService(AmadeusClient amadeusClient) {
        this.amadeusClient = amadeusClient;
    }

    public List<FlightResponse> searchFlights(FlightRequest request) {
        // Call Amadeus API using the client and map results to FlightResponse
        return (List<FlightResponse>) amadeusClient.searchFlights(request);
    }
}

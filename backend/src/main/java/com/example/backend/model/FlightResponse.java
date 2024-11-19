package com.example.backend.model;

import lombok.Data;

@Data
public class FlightResponse {
    private String departureTime;
    private String arrivalTime;
    private String departureAirportName;
    private String arrivalAirportName;
    private String airlineName;
    private String airlineCode;
    private double totalPrice;
    private double pricePerTraveler;
    private String duration;
    private boolean hasStops;
    private String stopsDetails;
}


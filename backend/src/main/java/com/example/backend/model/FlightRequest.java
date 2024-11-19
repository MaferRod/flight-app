package com.example.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FlightRequest {
    @NotBlank
    private String departureAirport;

    @NotBlank
    private String arrivalAirport;

    @NotNull
    @FutureOrPresent
    private String departureDate;

    @FutureOrPresent
    private String returnDate;

    @NotNull
    @Min(1)
    private Integer adults;

    @NotBlank
    private String currency;

    private boolean nonStop;
}

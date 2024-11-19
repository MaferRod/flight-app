package com.example.backend.util;

import com.example.backend.config.WebClientConfig;
import com.example.backend.model.FlightRequest;
import com.example.backend.model.FlightResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AmadeusClient {

    private final WebClient webClient;
    private final WebClientConfig webClientConfig;

    public AmadeusClient(WebClientConfig webClientConfig, WebClient.Builder builder, @Value("${amadeus.api.base-url}") String amadeusBaseUrl) {
        this.webClientConfig = webClientConfig;
        this.webClient = builder.baseUrl(amadeusBaseUrl).build();
    }

    /**
     * Fetches up to 100 flight offers from the Amadeus API based on the search
     * criteria in the request.
     *
     * @param request the search criteria including origin, destination, dates, etc.
     * @return a Mono containing a list of flight offers.
     */
    public Mono<List<FlightOffer>> fetchFlightOffers(FlightSearchRequestDTO request) {
        return webClientConfig.getAccessToken()
                .flatMap(token -> webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/v2/shopping/flight-offers")
                                .queryParam("max", 50)
                                .queryParam("originLocationCode", request.getDepartureAirportCode())
                                .queryParam("destinationLocationCode", request.getArrivalAirportCode())
                                .queryParam("departureDate", request.getDepartureDate().toString())
                                .queryParam("returnDate",
                                        request.getReturnDate() != null ? request.getReturnDate().toString() : null)
                                .queryParam("adults", request.getNumberOfAdults())
                                .queryParam("currencyCode", request.getCurrency())
                                .queryParam("nonStop", request.isNonStop())
                                .build())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .retrieve()
                        .bodyToMono(FlightOfferResponse.class)
                        .map(FlightOfferResponse::getData));
    }
}


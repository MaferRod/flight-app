package com.flightsearch.backend.Services;

import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class SearchService {

    List<JSONObject> flightOffers;

    @Autowired
    TokenService tokenService;

    @Autowired
    AirportService airportService;

    @Autowired
    AirlineService airlineService;

    // Cache para resultados de búsquedas
    private final Map<String, String> airportCache = new HashMap<>();
    private final Map<String, String> airlineCache = new HashMap<>();

    OkHttpClient client;

    public SearchService() {
        // Configuración optimizada del cliente HTTP
        client = new OkHttpClient.Builder()
                .connectionPool(new okhttp3.ConnectionPool(10, 5, java.util.concurrent.TimeUnit.MINUTES))
                .build();
    }

    public List<JSONObject> flightOfferSearch(String originLocationCode, String destinationLocationCode,
                                              String departureDate, String returnDate, Integer adults, String currencyCode, Boolean nonStop
    ) throws IOException {
        flightOffers = new ArrayList<>();
        String token = tokenService.getAccessToken();

        // Construcción de la URL
        HttpUrl.Builder urlBuilder = HttpUrl.parse("https://test.api.amadeus.com/v2/shopping/flight-offers").newBuilder()
                .addQueryParameter("originLocationCode", originLocationCode)
                .addQueryParameter("destinationLocationCode", destinationLocationCode)
                .addQueryParameter("departureDate", departureDate)
                .addQueryParameter("adults", adults.toString())
                .addQueryParameter("currencyCode", currencyCode)
                .addQueryParameter("nonStop", nonStop.toString())
                .addQueryParameter("max", "10");

        if (returnDate != null && !returnDate.isEmpty()) {
            urlBuilder.addQueryParameter("returnDate", returnDate);
        }

        HttpUrl url = urlBuilder.build();

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            assert response.body() != null;
            JSONObject modifiedJson = addAirportAndAirlinesCommonNames(response.body().string());
            JSONArray data = modifiedJson.getJSONArray("data");

            // Procesar resultados en paralelo
            processFlightOffersInParallel(data);

            return flightOffers;
        }
    }

    private JSONObject addAirportAndAirlinesCommonNames(String originalJson) {
        return new JSONObject(originalJson); // Devolver JSON sin modificaciones hasta procesar cada oferta
    }

    private void processFlightOffersInParallel(JSONArray dataArray) {
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < dataArray.length(); i++) {
            JSONObject flightOffer = dataArray.getJSONObject(i);
            futures.add(CompletableFuture.runAsync(() -> {
                try {
                    processFlightOffer(flightOffer);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
    }

    private void processFlightOffer(JSONObject flightOffer) throws IOException {
        JSONArray itineraries = flightOffer.getJSONArray("itineraries");
        Duration totalDuration = Duration.ZERO;

        for (int j = 0; j < itineraries.length(); j++) {
            JSONObject itinerary = itineraries.getJSONObject(j);
            totalDuration = totalDuration.plus(processItinerary(itinerary));
        }

        flightOffer.put("totalDuration", totalDuration.toString());
        flightOffer.put("totalPrice", flightOffer.getJSONObject("price").getString("total"));
        flightOffers.add(flightOffer); // Agregar oferta procesada a la lista
    }

    private Duration processItinerary(JSONObject itinerary) throws IOException {
        JSONArray segments = itinerary.getJSONArray("segments");
        Duration duration = Duration.parse(itinerary.getString("duration"));

        for (int k = 0; k < segments.length(); k++) {
            JSONObject segment = segments.getJSONObject(k);
            processSegment(segment);
        }

        return duration;
    }

    private void processSegment(JSONObject segment) throws IOException {
        JSONObject departure = segment.getJSONObject("departure");
        departure.put("airportCommonName", getAirportCommonName(departure.getString("iataCode")));

        JSONObject arrival = segment.getJSONObject("arrival");
        arrival.put("airportCommonName", getAirportCommonName(arrival.getString("iataCode")));

        segment.put("airlineCommonName", getAirlineCommonName(segment.getString("carrierCode")));
    }

    private String getAirportCommonName(String iataCode) throws IOException {
        return airportCache.computeIfAbsent(iataCode, code -> {
            try {
                return airportService.airportNameSearchByKeyword(code);
            } catch (IOException e) {
                e.printStackTrace();
                return "Unknown";
            }
        });
    }

    private String getAirlineCommonName(String carrierCode) throws IOException {
        return airlineCache.computeIfAbsent(carrierCode, code -> {
            try {
                return airlineService.airlineName(code);
            } catch (IOException e) {
                e.printStackTrace();
                return "Unknown";
            }
        });
    }

    public List<JSONObject> sort(String mode) {
        switch (mode) {
            case "price" -> SortFlights.sort(this.flightOffers, "totalPrice", null);
            case "duration" -> SortFlights.sort(this.flightOffers, "totalDuration", null);
            case "duration-price" -> SortFlights.sort(this.flightOffers, "totalDuration", "totalPrice");
            case "price-duration" -> SortFlights.sort(this.flightOffers, "totalPrice", "totalDuration");
        }
        return this.flightOffers;
    }
}

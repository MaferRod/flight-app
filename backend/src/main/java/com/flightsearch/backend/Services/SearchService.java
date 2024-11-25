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
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    List<JSONObject> flightOffers;

    @Autowired
    TokenService tokenService;

    @Autowired
    AirportService airportService;

    @Autowired
    AirlineService airlineService;

    OkHttpClient client = new OkHttpClient();


    public SearchService() throws IOException {
    }

    public List<JSONObject> flightOfferSearch(String originLocationCode, String destinationLocationCode,
                                              String departureDate, String returnDate, Integer adults, String currencyCode, Boolean nonStop
    ) throws IOException {
        flightOffers = new ArrayList<>();
        String token = tokenService.getAccessToken();
        HttpUrl.Builder urlBuilder = HttpUrl.parse("https://test.api.amadeus.com/v2/shopping/flight-offers").newBuilder()
                .addQueryParameter("originLocationCode",originLocationCode)
                .addQueryParameter("destinationLocationCode",destinationLocationCode)
                .addQueryParameter("departureDate",departureDate)
                .addQueryParameter("adults",adults.toString())
                .addQueryParameter("currencyCode", currencyCode )
                .addQueryParameter("nonStop", nonStop.toString())
                .addQueryParameter("max","10");
        if(returnDate != null && !returnDate.isEmpty()){
            urlBuilder.addQueryParameter("returnDate", returnDate);
        }

        HttpUrl url = urlBuilder.build();

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization","Bearer "+ token)
                .build();

        try(Response response = client.newCall(request).execute()){
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            assert response.body() != null;
            JSONObject modifiedJson = addAirportAndAirlinesCommonNames(response.body().string());
            JSONArray data = modifiedJson.getJSONArray("data");
            for(int i = 0; i<data.length(); i++){
                flightOffers.add(data.getJSONObject(i));
            }
            return flightOffers;
        }


    }

    private JSONObject addAirportAndAirlinesCommonNames(String originalJson) throws IOException {
        JSONObject jsonResponse = new JSONObject(originalJson);
        JSONArray dataArray = jsonResponse.getJSONArray("data");
    
        for (int i = 0; i < dataArray.length(); i++) {
            JSONObject flightOffer = dataArray.getJSONObject(i);
            processFlightOffer(flightOffer);
        }
    
        return jsonResponse;
    }
    
    // Flightoffer logic
    private void processFlightOffer(JSONObject flightOffer) throws IOException {
        JSONArray itineraries = flightOffer.getJSONArray("itineraries");
        Duration totalDuration = Duration.ZERO;
    
        for (int j = 0; j < itineraries.length(); j++) {
            JSONObject itinerary = itineraries.getJSONObject(j);
            totalDuration = totalDuration.plus(processItinerary(itinerary));
        }
    
        flightOffer.put("totalDuration", totalDuration.toString());
        flightOffer.put("totalPrice", flightOffer.getJSONObject("price").getString("total"));
    }
    
    // Itinerary and duration
    private Duration processItinerary(JSONObject itinerary) throws IOException {
        JSONArray segments = itinerary.getJSONArray("segments");
        Duration duration = Duration.parse(itinerary.getString("duration"));
    
        for (int k = 0; k < segments.length(); k++) {
            JSONObject segment = segments.getJSONObject(k);
            processSegment(segment);
        }
    
        return duration;
    }
    
    // Process the keyword to find an airport
    private void processSegment(JSONObject segment) throws IOException {
        JSONObject departure = segment.getJSONObject("departure");
        departure.put("airportCommonName", getAirportCommonName(departure.getString("iataCode")));
    
        JSONObject arrival = segment.getJSONObject("arrival");
        arrival.put("airportCommonName", getAirportCommonName(arrival.getString("iataCode")));
    
        segment.put("airlineCommonName", getAirlineCommonName(segment.getString("carrierCode")));
    }
    
    // Search Airport by IATA
    private String getAirportCommonName(String iataCode) throws IOException {
        return airportService.airportNameSearchByKeyword(iataCode);
    }
    
    // Search Airline
    private String getAirlineCommonName(String carrierCode) throws IOException {
        return airlineService.airlineName(carrierCode);
    } 

    public List<JSONObject> sort(String mode){

        switch (mode) {
            case "price" -> SortFlights.sort(this.flightOffers, "totalPrice", null);
            case "duration" -> SortFlights.sort(this.flightOffers, "totalDuration", null);
            case "duration-price" -> SortFlights.sort(this.flightOffers, "totalDuration", "totalPrice");
            case "price-duration" -> SortFlights.sort(this.flightOffers, "totalPrice", "totalDuration");
        };

        return this.flightOffers;
    }
}

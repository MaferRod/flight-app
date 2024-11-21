package com.flightsearch.backend.Controllers;


import com.flightsearch.backend.Services.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/airportSearch")
public class airportController {
    @Autowired
    AirportService airportService;

    @GetMapping()
    public ResponseEntity<?> getMatchingAirportCodes(@RequestParam String keyword){
        try {
            List<Map<String,String>> response = airportService.airportSearchByKeyword(keyword);
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

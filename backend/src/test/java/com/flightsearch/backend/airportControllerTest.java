package com.flightsearch.backend;

import com.flightsearch.backend.Controllers.airportController;
import com.flightsearch.backend.Services.AirportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(airportController.class)  
public class airportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AirportService airportCodeService;

    private List<Map<String, String>> mockAirportCodes;

    @BeforeEach
    public void setUp() {
        mockAirportCodes = new ArrayList<>();
        Map<String, String> airportCode = new HashMap<>();
        airportCode.put("code", "JFK");
        mockAirportCodes.add(airportCode);
    }

    @Test
    public void testGetMatchingAirportCodes() throws Exception {
        when(airportCodeService.airportSearchByKeyword("John"))
                .thenReturn(mockAirportCodes);

        mockMvc.perform(get("/airportCodeSearch")
                        .param("keyword", "John")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[{\"code\":\"JFK\"}]"))  
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)); 
    }

}

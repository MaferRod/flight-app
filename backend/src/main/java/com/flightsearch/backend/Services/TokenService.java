package com.flightsearch.backend.Services;


import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

import java.time.Instant;

@Service
public class TokenService {
    private final OkHttpClient client;

    @Value("${apiKey}")
    private String apiKey;

    @Value("${apiSecret}")
    private String apiSecret;

    private volatile String accessToken;
    private volatile Instant tokenExpiry;

    public TokenService() {
        this.client = new OkHttpClient();
    }

    public synchronized String getAccessToken() throws IOException {
        if (accessToken == null || Instant.now().isAfter(tokenExpiry)) {
            RequestBody formBody = new FormBody.Builder()
                    .add("grant_type", "client_credentials")
                    .add("client_id", apiKey)
                    .add("client_secret", apiSecret)
                    .build();

            Request request = new Request.Builder()
                    .url("https://test.api.amadeus.com/v1/security/oauth2/token")
                    .post(formBody)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response);
                }
                assert response.body() != null;
                String responseBody = response.body().string();
                JSONObject jsonObject = new JSONObject(responseBody);
                this.accessToken = jsonObject.getString("access_token");
                int expiresIn = jsonObject.getInt("expires_in");
                this.tokenExpiry = Instant.now().plusSeconds(expiresIn - 30); // Buffer de 30 segundos
            }
        }
        return accessToken;
    }
}


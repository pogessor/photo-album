package com.dancsopeter.photoalbum.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;
    private final String model;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model) {
        this.client = Client.builder().apiKey(apiKey).build();
        this.model = model;
    }

    public String describeImage(byte[] imageBytes, String mimeType) {
        String prompt = """
                Kérlek, írd le részletesen, mi látható ezen a képen.
                Egy rövid, 1-3 mondatos leírást adj, magyar nyelven.
                Csak a leírást add vissza, semmi mást.
                """;

        Content content = Content.fromParts(
                Part.fromText(prompt),
                Part.fromBytes(imageBytes, mimeType)
        );

        GenerateContentResponse response = client.models.generateContent(model, content, null);
        return response.text();
    }
}
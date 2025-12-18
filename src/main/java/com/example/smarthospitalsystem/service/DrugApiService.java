package com.example.smarthospitalsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DrugApiService {

    private final RestTemplate restTemplate;

    public DrugApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getDrugInfo(String drugName) {
        // OpenFDA API URL (Free, no key required)
        String url = "https://api.fda.gov/drug/label.json";

        // Build URL: ?search=openfda.brand_name:"drugName"&limit=1
        String finalUrl = UriComponentsBuilder.fromUriString(url)
                .queryParam("search", "openfda.brand_name:\"" + drugName + "\" openfda.generic_name:\"" + drugName + "\"")
                .queryParam("limit", 1)
                .toUriString();

        try {
            // 1. Call the API
            String response = restTemplate.getForObject(finalUrl, String.class);

            // 2. Parse the JSON to find the "indications_and_usage" (What the drug is for)
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            // Navigate safely through the complex JSON structure
            if (root.has("results")) {
                JsonNode result = root.get("results").get(0);
                if (result.has("indications_and_usage")) {
                    String info = result.get("indications_and_usage").get(0).asText();
                    // Return first 200 chars to keep it short
                    return info.length() > 200 ? info.substring(0, 200) + "..." : info;
                }
            }
            return "Drug found, but no description available.";
        } catch (Exception e) {
            return "Drug not found in FDA database.";
        }
    }

// Search for a list of drugs
    public java.util.List<String> searchDrugs(String query) {
        String url = "https://api.fda.gov/drug/label.json";

        // 1. Build the URI object directly
        java.net.URI uri = UriComponentsBuilder.fromUriString(url)
                .queryParam("search", "openfda.brand_name:\"" + query + "*\"")
                .queryParam("limit", 5)
                .build()
                .toUri(); // <--- Returns a URI object, preventing double-encoding

        java.util.List<String> drugNames = new java.util.ArrayList<>();

        try {
            // 2. Pass the URI object, NOT the String
            String response = restTemplate.getForObject(uri, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            if (root.has("results")) {
                for (JsonNode node : root.get("results")) {
                    if (node.has("openfda") && node.get("openfda").has("brand_name")) {
                        String name = node.get("openfda").get("brand_name").get(0).asText();
                        drugNames.add(name);
                    }
                }
            }
        } catch (Exception e) {
            // Log error to console to help debug
            System.out.println("FDA Search Error: " + e.getMessage());
        }
        return drugNames;
    }

}
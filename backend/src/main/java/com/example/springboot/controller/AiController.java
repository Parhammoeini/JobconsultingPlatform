// ... your existing imports ...
package com.example.springboot.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.springboot.service.AiConsultingService;
import java.util.Map;
@CrossOrigin(origins = "*") // temporary for local frontend testing; tighten later

@RestController
@RequestMapping("/api/ai")  // or "/api/client/ai" to group under client
public class AiController {  // or append to existing ClientController

    private final AiConsultingService aiService;

    public AiController(AiConsultingService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<String> generateCoverLetter(@RequestBody Map<String, String> request) {
        String resume = request.getOrDefault("resume", "");
        String description = request.getOrDefault("description", "");
        String name = request.getOrDefault("name",""); 
        if (resume.isBlank() || description.isBlank()) {
            return ResponseEntity.badRequest().body("Missing resume or description");
        }
        String result = aiService.generateCoverLetter(resume, description,name);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/suggest-services")
    public ResponseEntity<String> suggestServices(@RequestBody Map<String, String> request) {
        String profile = request.getOrDefault("profile", "");
        if (profile.isBlank()) {
            return ResponseEntity.badRequest().body("Missing profile text");
        }
        String result = aiService.suggestServicesOrConsultants(profile);
        return ResponseEntity.ok(result);
    }
}
package com.avsarverse.backend.controller;

import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfile> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<StudentProfile> updateProfile(@RequestBody StudentProfile updated) {
        return ResponseEntity.ok(profileService.updateProfile(updated));
    }

    @PostMapping("/documents/toggle")
    public ResponseEntity<StudentProfile> toggleDocument(@RequestBody Map<String, String> payload) {
        String docKey = payload.get("key");
        if (docKey == null || docKey.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(profileService.toggleDocumentCompletion(docKey));
    }
}

package com.alumniconnect.controller;

import com.alumniconnect.dto.ApiResponse;
import com.alumniconnect.dto.EventCreateRequest;
import com.alumniconnect.dto.EventDTO;
import com.alumniconnect.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllActiveEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALUMNI')")
    public ResponseEntity<List<EventDTO>> getMyEvents() {
        return ResponseEntity.ok(eventService.getMyEvents());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ALUMNI')")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventCreateRequest request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALUMNI')")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable("id") Long id, @Valid @RequestBody EventCreateRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALUMNI')")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> joinEvent(@PathVariable("id") Long id) {
        eventService.joinEvent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully joined the event"));
    }
}

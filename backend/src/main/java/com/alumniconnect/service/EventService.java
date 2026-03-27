package com.alumniconnect.service;

import com.alumniconnect.dto.EventCreateRequest;
import com.alumniconnect.dto.EventDTO;
import com.alumniconnect.entity.Event;
import com.alumniconnect.entity.EventParticipant;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.BadRequestException;
import com.alumniconnect.exception.ConflictException;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.EventParticipantRepository;
import com.alumniconnect.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    private final UserService userService;

    public List<EventDTO> getAllActiveEvents() {
        return eventRepository.findByIsActiveTrueOrderByEventDateAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findByIsActiveTrueAndEventDateAfterOrderByEventDateAsc(LocalDateTime.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return toDTO(event);
    }

    public List<EventDTO> getMyEvents() {
        User currentUser = userService.getCurrentUser();
        return eventRepository.findByCreatedByIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventDTO createEvent(EventCreateRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.ALUMNI) {
            throw new UnauthorizedException("Only admin or alumni can create events");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .eventType(request.getEventType())
                .maxAttendees(request.getMaxAttendees())
                .registrationLink(request.getRegistrationLink())
                .createdBy(currentUser)
                .isActive(true)
                .build();

        event = eventRepository.save(event);
        return toDTO(event);
    }

    @Transactional
    public EventDTO updateEvent(Long id, EventCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if (!event.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own events");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setEventType(request.getEventType());
        event.setMaxAttendees(request.getMaxAttendees());
        event.setRegistrationLink(request.getRegistrationLink());

        event = eventRepository.save(event);
        return toDTO(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        User currentUser = userService.getCurrentUser();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if (!event.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own events");
        }

        event.setIsActive(false);
        eventRepository.save(event);
    }

    @Transactional
    public void joinEvent(Long eventId) {
        User currentUser = userService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getIsActive()) {
            throw new BadRequestException("Cannot join an inactive event");
        }

        if (event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot join a past event");
        }

        // Check if user is already registered
        if (eventParticipantRepository.existsByEventAndUser(event, currentUser)) {
            throw new ConflictException("You are already registered for this event");
        }

        // Check capacity
        if (event.getMaxAttendees() != null && event.getMaxAttendees() > 0) {
            long currentParticipants = eventParticipantRepository.countByEvent(event);
            if (currentParticipants >= event.getMaxAttendees()) {
                throw new BadRequestException("Event is already full");
            }
        }

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(currentUser)
                .build();

        eventParticipantRepository.save(participant);
    }

    private EventDTO toDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .eventType(event.getEventType())
                .maxAttendees(event.getMaxAttendees())
                .registrationLink(event.getRegistrationLink())
                .createdById(event.getCreatedBy().getId())
                .createdByName(event.getCreatedBy().getFirstName() + " " + event.getCreatedBy().getLastName())
                .isActive(event.getIsActive())
                .createdAt(event.getCreatedAt())
                .build();
    }
}

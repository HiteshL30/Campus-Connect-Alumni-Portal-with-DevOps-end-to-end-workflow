package com.alumniconnect.controller;

import com.alumniconnect.dto.ApiResponse;
import com.alumniconnect.dto.ConnectionDTO;
import com.alumniconnect.dto.ConnectionRequest;
import com.alumniconnect.entity.ConnectionStatus;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserRepository userRepository;

    public ConnectionController(ConnectionService connectionService, UserRepository userRepository) {
        this.connectionService = connectionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<ConnectionDTO>> sendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConnectionRequest request) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity
                .ok(ApiResponse.success(connectionService.sendConnectionRequest(user, request.getUserId())));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ConnectionDTO>> acceptRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(connectionService.acceptConnectionRequest(user, id)));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Map<String, String>>> rejectRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        User user = getUserFromDetails(userDetails);
        connectionService.rejectConnectionRequest(user, id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Connection request rejected")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        User user = getUserFromDetails(userDetails);
        connectionService.removeConnection(user, id);
        return ResponseEntity.ok(Map.of("message", "Connection removed"));
    }

    @PostMapping("/block")
    public ResponseEntity<ApiResponse<ConnectionDTO>> blockUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConnectionRequest request) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(connectionService.blockUser(user, request.getUserId())));
    }

    @PostMapping("/{id}/unblock")
    public ResponseEntity<Map<String, String>> unblockUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        User user = getUserFromDetails(userDetails);
        connectionService.unblockUser(user, id);
        return ResponseEntity.ok(Map.of("message", "User unblocked"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConnectionDTO>>> getConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(connectionService.getAcceptedConnections(user)));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ConnectionDTO>>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(connectionService.getPendingRequests(user)));
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<ConnectionDTO>>> getSentRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(connectionService.getSentRequests(user)));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, String>> getConnectionStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("userId") Long userId) {
        User user = getUserFromDetails(userDetails);
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ConnectionStatus status = connectionService.getConnectionStatus(user, otherUser);
        return ResponseEntity.ok(Map.of("status", status.name()));
    }

    private User getUserFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

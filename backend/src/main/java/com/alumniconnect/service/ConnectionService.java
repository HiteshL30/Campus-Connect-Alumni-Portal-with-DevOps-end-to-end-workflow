package com.alumniconnect.service;

import com.alumniconnect.dto.ConnectionDTO;
import com.alumniconnect.entity.Connection;
import com.alumniconnect.entity.ConnectionStatus;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.BadRequestException;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.ConnectionRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public ConnectionService(ConnectionRepository connectionRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.eventPublisher = eventPublisher;
    }

    public boolean areUsersConnected(User user1, User user2) {
        return connectionRepository.areUsersConnected(user1, user2);
    }

    public boolean isUserBlocked(User user1, User user2) {
        return connectionRepository.isUserBlocked(user1, user2);
    }

    public ConnectionStatus getConnectionStatus(User user1, User user2) {
        Optional<Connection> connection = connectionRepository.findConnectionBetweenUsers(user1, user2);
        return connection.map(Connection::getStatus).orElse(ConnectionStatus.NONE);
    }

    @Transactional
    public ConnectionDTO sendConnectionRequest(User requester, Long receiverId) {
        if (!requester.isVerified()) {
            throw new UnauthorizedException("Only verified users can send connection requests");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!receiver.isVerified() && requester.getRole() != Role.ADMIN) {
            throw new BadRequestException("Cannot send request to unverified user");
        }

        if (requester.getId().equals(receiverId)) {
            throw new BadRequestException("Cannot send connection request to yourself");
        }

        Optional<Connection> existing = connectionRepository.findConnectionBetweenUsers(requester, receiver);
        if (existing.isPresent()) {
            Connection conn = existing.get();
            if (conn.getStatus() == ConnectionStatus.BLOCKED) {
                throw new BadRequestException("Cannot send request - user is blocked");
            }
            if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new BadRequestException("Already connected with this user");
            }
            if (conn.getStatus() == ConnectionStatus.REQUESTED) {
                throw new BadRequestException("Connection request already pending");
            }
        }

        Connection connection = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.REQUESTED)
                .build();

        Connection savedConnection = connectionRepository.save(connection);

        notificationService.createNotification(
                receiver,
                com.alumniconnect.entity.NotificationType.CONNECTION_REQUEST,
                requester.getFirstName() + " sent you a connection request",
                requester.getId());

        return mapToDTO(savedConnection, requester);
    }

    @Transactional
    public ConnectionDTO acceptConnectionRequest(User user, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to accept this request");
        }

        if (connection.getStatus() != ConnectionStatus.REQUESTED) {
            throw new BadRequestException("This request cannot be accepted");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        Connection savedConnection = connectionRepository.save(connection);

        notificationService.createNotification(
                connection.getRequester(),
                com.alumniconnect.entity.NotificationType.CONNECTION_ACCEPTED,
                user.getFirstName() + " accepted your connection request",
                user.getId());

        eventPublisher.publishEvent(new com.alumniconnect.event.ConnectionAcceptedEvent(this, connection.getRequester(),
                connection.getReceiver()));

        return mapToDTO(savedConnection, user);
    }

    @Transactional
    public void rejectConnectionRequest(User user, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to reject this request");
        }

        connectionRepository.delete(connection);
    }

    @Transactional
    public void removeConnection(User user, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found"));

        if (!connection.getRequester().getId().equals(user.getId()) &&
                !connection.getReceiver().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to remove this connection");
        }

        connectionRepository.delete(connection);
    }

    @Transactional
    public ConnectionDTO blockUser(User blocker, Long userIdToBlock) {
        User userToBlock = userRepository.findById(userIdToBlock)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (blocker.getId().equals(userIdToBlock)) {
            throw new BadRequestException("Cannot block yourself");
        }

        Optional<Connection> existing = connectionRepository.findConnectionBetweenUsers(blocker, userToBlock);
        Connection connection;

        if (existing.isPresent()) {
            connection = existing.get();
            connection.setStatus(ConnectionStatus.BLOCKED);
            connection.setRequester(blocker);
            connection.setReceiver(userToBlock);
        } else {
            connection = Connection.builder()
                    .requester(blocker)
                    .receiver(userToBlock)
                    .status(ConnectionStatus.BLOCKED)
                    .build();
        }

        return mapToDTO(connectionRepository.save(connection), blocker);
    }

    @Transactional
    public void unblockUser(User user, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found"));

        if (!connection.getRequester().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to unblock this user");
        }

        if (connection.getStatus() != ConnectionStatus.BLOCKED) {
            throw new BadRequestException("User is not blocked");
        }

        connectionRepository.delete(connection);
    }

    public List<ConnectionDTO> getAcceptedConnections(User user) {
        return connectionRepository.findAllByUserAndStatus(user, ConnectionStatus.ACCEPTED)
                .stream()
                .map(conn -> mapToDTO(conn, user))
                .collect(Collectors.toList());
    }

    public List<ConnectionDTO> getPendingRequests(User user) {
        return connectionRepository.findPendingRequestsForUser(user)
                .stream()
                .map(conn -> mapToDTO(conn, user))
                .collect(Collectors.toList());
    }

    public List<ConnectionDTO> getSentRequests(User user) {
        return connectionRepository.findSentRequestsByUser(user)
                .stream()
                .map(conn -> mapToDTO(conn, user))
                .collect(Collectors.toList());
    }

    private ConnectionDTO mapToDTO(Connection connection, User currentUser) {
        User otherUser = connection.getRequester().getId().equals(currentUser.getId())
                ? connection.getReceiver()
                : connection.getRequester();

        return ConnectionDTO.builder()
                .id(connection.getId())
                .requesterId(connection.getRequester().getId())
                .requesterName(connection.getRequester().getFirstName() + " " + connection.getRequester().getLastName())
                .requesterEmail(connection.getRequester().getEmail())
                .requesterRole(connection.getRequester().getRole().name())
                .requesterDepartment(connection.getRequester().getDepartment())
                .receiverId(connection.getReceiver().getId())
                .receiverName(connection.getReceiver().getFirstName() + " " + connection.getReceiver().getLastName())
                .receiverEmail(connection.getReceiver().getEmail())
                .receiverRole(connection.getReceiver().getRole().name())
                .receiverDepartment(connection.getReceiver().getDepartment())
                .status(connection.getStatus())
                .createdAt(connection.getCreatedAt())
                .connectedWithId(otherUser.getId())
                .connectedWithFirstName(otherUser.getFirstName())
                .connectedWithLastName(otherUser.getLastName())
                .senderFirstName(connection.getRequester().getFirstName())
                .senderLastName(connection.getRequester().getLastName())
                .build();
    }
}

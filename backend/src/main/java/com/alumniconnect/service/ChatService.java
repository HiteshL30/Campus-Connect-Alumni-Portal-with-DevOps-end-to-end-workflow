package com.alumniconnect.service;

import com.alumniconnect.dto.ChatDTO;
import com.alumniconnect.dto.ChatRequestDTO;
import com.alumniconnect.dto.MessageDTO;
import com.alumniconnect.entity.*;
import com.alumniconnect.exception.BadRequestException;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.ChatRepository;
import com.alumniconnect.repository.MessageRepository;
import com.alumniconnect.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ChatService(ChatRepository chatRepository,
            MessageRepository messageRepository,
            UserRepository userRepository,
            UserService userService) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public List<ChatDTO> getMyChats() {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.isVerified()) {
            throw new UnauthorizedException("Only verified users can access chats");
        }

        List<Chat> chats = chatRepository.findAllByUserId(currentUser.getId());

        return chats.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ChatDTO> getPendingRequests() {
        User currentUser = userService.getCurrentUser();
        return chatRepository.findByUser2IdAndStatus(currentUser.getId(), ChatStatus.PENDING).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Hardened chat retrieval/creation.
     * 
     * IMPORTANT: Avoid REQUIRES_NEW here if called from within
     * another @Transactional
     * as it can cause connection pool starvation.
     */
    public Chat getOrCreateChat(Long userIdA, Long userIdB) {
        Long id1 = Math.min(userIdA, userIdB);
        Long id2 = Math.max(userIdA, userIdB);

        // 1. First attempt: Standard retrieval
        return chatRepository.findByUser1IdAndUser2Id(id1, id2)
                .orElseGet(() -> {
                    log.info("Creating new chat between User {} and User {}", id1, id2);

                    User user1 = userRepository.findById(id1)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id1));
                    User user2 = userRepository.findById(id2)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id2));

                    Chat chat = Chat.builder()
                            .user1(user1)
                            .user2(user2)
                            .status(ChatStatus.ACCEPTED)
                            .build();
                    try {
                        // 2. Second attempt: Direct save.
                        // If another thread succeeds first, this will throw
                        // DataIntegrityViolationException.
                        return chatRepository.saveAndFlush(chat);
                    } catch (DataIntegrityViolationException e) {
                        log.warn("Concurrent chat creation detected for users {} and {}. Recovering...", id1, id2);
                        // 3. Final attempt: Re-fetch the one created by the other thread.
                        return chatRepository.findByUser1IdAndUser2Id(id1, id2)
                                .orElseThrow(() -> new RuntimeException(
                                        "Race condition: Chat record vanished after DataIntegrityViolation", e));
                    }
                });
    }

    @Transactional
    public ChatDTO requestChat(ChatRequestDTO request) {
        User currentUser = userService.getCurrentUser();

        if (!currentUser.isVerified()) {
            throw new UnauthorizedException("Only verified users can request chats");
        }

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Chat chat = getOrCreateChat(currentUser.getId(), receiver.getId());

        if (request.getInitialMessage() != null && !request.getInitialMessage().isBlank()) {
            Message message = Message.builder()
                    .chat(chat)
                    .sender(currentUser)
                    .content(request.getInitialMessage())
                    .isRead(false)
                    .build();
            messageRepository.save(message);
        }

        return toDTO(chat);
    }

    @Transactional
    public ChatDTO acceptChat(Long chatId) {
        User currentUser = userService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Not authorized to accept this chat request");
        }

        if (chat.getStatus() != ChatStatus.PENDING) {
            throw new BadRequestException("Chat is not in pending status");
        }

        chat.setStatus(ChatStatus.ACCEPTED);
        chat = chatRepository.save(chat);
        return toDTO(chat);
    }

    @Transactional
    public ChatDTO rejectChat(Long chatId) {
        User currentUser = userService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Not authorized to reject this chat request");
        }

        if (chat.getStatus() != ChatStatus.PENDING) {
            throw new BadRequestException("Chat is not in pending status");
        }

        chat.setStatus(ChatStatus.REJECTED);
        chat = chatRepository.save(chat);
        return toDTO(chat);
    }

    public ChatDTO getChatById(Long chatId) {
        User currentUser = userService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser1().getId().equals(currentUser.getId()) &&
                !chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant of this chat");
        }

        return toDTO(chat);
    }

    private ChatDTO toDTO(Chat chat) {
        // To truly optimize for scale, we should use a custom query with JOIN FETCH or
        // a projection
        // but for now, we ensure the index idx_chat_user_created handles this
        // efficiently.
        Message lastMessage = messageRepository.findFirstByChatIdOrderByCreatedAtDesc(chat.getId());

        return ChatDTO.builder()
                .id(chat.getId())
                .user1Id(chat.getUser1().getId())
                .user1Name(chat.getUser1().getFirstName() + " " + chat.getUser1().getLastName())
                .user2Id(chat.getUser2().getId())
                .user2Name(chat.getUser2().getFirstName() + " " + chat.getUser2().getLastName())
                .status(chat.getStatus())
                .createdAt(chat.getCreatedAt())
                .lastMessage(lastMessage != null ? toMessageDTO(lastMessage) : null)
                .build();
    }

    private MessageDTO toMessageDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .chatId(message.getChat().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .content(message.getContent())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}

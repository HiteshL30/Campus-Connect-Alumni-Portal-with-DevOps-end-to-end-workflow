package com.alumniconnect.service;

import com.alumniconnect.dto.MessageCreateRequest;
import com.alumniconnect.dto.MessageDTO;
import com.alumniconnect.entity.Chat;
import com.alumniconnect.entity.ChatStatus;
import com.alumniconnect.entity.Message;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.ChatRepository;
import com.alumniconnect.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository,
            ChatRepository chatRepository,
            UserService userService,
            org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getChatMessages(Long chatId) {
        User currentUser = userService.getCurrentUser();

        if (!currentUser.isVerified()) {
            throw new UnauthorizedException("Only verified users can view messages");
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser1().getId().equals(currentUser.getId()) &&
                !chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant of this chat");
        }

        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDTO sendMessage(MessageCreateRequest request) {
        User currentUser = userService.getCurrentUser();

        if (!currentUser.isVerified()) {
            throw new UnauthorizedException("Only verified users can send messages");
        }

        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser1().getId().equals(currentUser.getId()) &&
                !chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant of this chat");
        }

        if (chat.getStatus() != ChatStatus.ACCEPTED) {
            throw new UnauthorizedException("Chat must be accepted before sending messages");
        }

        Message message = Message.builder()
                .chat(chat)
                .sender(currentUser)
                .content(request.getContent())
                .resumeUrl(request.getResumeUrl())
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        // Update chat updatedAt timestamp to bring it to top of inbox
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);

        MessageDTO messageDTO = toDTO(message);

        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/chat/" + chat.getId(), messageDTO);

        return messageDTO;
    }

    @Transactional
    public void markAsRead(Long chatId) {
        User currentUser = userService.getCurrentUser();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));

        if (!chat.getUser1().getId().equals(currentUser.getId()) &&
                !chat.getUser2().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant of this chat");
        }

        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        for (Message message : messages) {
            if (!message.getSender().getId().equals(currentUser.getId()) && !message.getIsRead()) {
                message.setIsRead(true);
                messageRepository.save(message);
            }
        }
    }

    private MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .chatId(message.getChat().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .content(message.getContent())
                .resumeUrl(message.getResumeUrl())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}

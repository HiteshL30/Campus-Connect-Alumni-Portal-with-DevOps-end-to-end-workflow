package com.alumniconnect.service.listener;

import com.alumniconnect.event.ConnectionAcceptedEvent;
import com.alumniconnect.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class ChatEventListener {

    private static final Logger log = LoggerFactory.getLogger(ChatEventListener.class);
    private final ChatService chatService;

    public ChatEventListener(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Listens for connection acceptance and creates a chat room.
     * phase = AFTER_COMMIT is crucial: it ensures we only create a chat if the
     * connection
     * was successfully saved and committed in the database.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleConnectionAccepted(ConnectionAcceptedEvent event) {
        log.info("Handling connection accepted event between {} and {}",
                event.getRequester().getEmail(), event.getReceiver().getEmail());
        try {
            // chatService.getOrCreateChat uses REQUIRES_NEW to have its own transaction
            chatService.getOrCreateChat(event.getRequester().getId(), event.getReceiver().getId());
        } catch (Exception e) {
            // Crucial: we catch all exceptions to prevent the event from impacting any
            // other listeners
            // if we had any. Chat can still be created lazily later if this fails.
            log.error("Failed to create chat room for accepted connection between {} and {}",
                    event.getRequester().getEmail(), event.getReceiver().getEmail(), e);
        }
    }
}

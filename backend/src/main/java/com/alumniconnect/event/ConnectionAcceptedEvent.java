package com.alumniconnect.event;

import com.alumniconnect.entity.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ConnectionAcceptedEvent extends ApplicationEvent {
    private final User requester;
    private final User receiver;

    public ConnectionAcceptedEvent(Object source, User requester, User receiver) {
        super(source);
        this.requester = requester;
        this.receiver = receiver;
    }
}

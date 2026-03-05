package com.example.springboot.service;

import com.example.springboot.model.BookingState;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Section 5 – Booking Lifecycle Service.
 *
 * Encapsulates every legal state transition so that no other part of the
 * system can move a booking into an invalid state.
 *
 * Transition map:
 *   REQUESTED       → CONFIRMED | REJECTED | CANCELLED
 *   CONFIRMED       → PENDING_PAYMENT | CANCELLED
 *   PENDING_PAYMENT → PAID | CANCELLED
 *   PAID            → COMPLETED | CANCELLED
 *   REJECTED        → (terminal)
 *   CANCELLED       → (terminal)
 *   COMPLETED       → (terminal)
 */
@Service
public class BookingLifecycleService {

    private static final Map<BookingState, Set<BookingState>> TRANSITIONS = new EnumMap<>(BookingState.class);

    static {
        TRANSITIONS.put(BookingState.REQUESTED,
                EnumSet.of(BookingState.CONFIRMED, BookingState.REJECTED, BookingState.CANCELLED));

        TRANSITIONS.put(BookingState.CONFIRMED,
                EnumSet.of(BookingState.PENDING_PAYMENT, BookingState.CANCELLED));

        TRANSITIONS.put(BookingState.PENDING_PAYMENT,
                EnumSet.of(BookingState.PAID, BookingState.CANCELLED));

        TRANSITIONS.put(BookingState.PAID,
                EnumSet.of(BookingState.COMPLETED, BookingState.CANCELLED));

        // Terminal states – no outgoing transitions
        TRANSITIONS.put(BookingState.REJECTED, EnumSet.noneOf(BookingState.class));
        TRANSITIONS.put(BookingState.CANCELLED, EnumSet.noneOf(BookingState.class));
        TRANSITIONS.put(BookingState.COMPLETED, EnumSet.noneOf(BookingState.class));
    }

    /**
     * Returns true when moving from {@code current} to {@code target} is legal.
     */
    public boolean canTransition(BookingState current, BookingState target) {
        Set<BookingState> allowed = TRANSITIONS.get(current);
        return allowed != null && allowed.contains(target);
    }

    /**
     * Attempts to transition and throws if illegal.
     *
     * @return the new state label (String) that should be set on the Booking
     */
    public String transition(String currentStateLabel, BookingState target) {
        BookingState current = BookingState.fromLabel(currentStateLabel);

        if (!canTransition(current, target)) {
            throw new IllegalStateException(
                    "Cannot transition booking from '" + current.getLabel() +
                    "' to '" + target.getLabel() + "'");
        }

        return target.getLabel();
    }

    /**
     * Checks whether the booking is in a cancellable state.
     */
    public boolean isCancellable(String currentStateLabel) {
        BookingState current = BookingState.fromLabel(currentStateLabel);
        return canTransition(current, BookingState.CANCELLED);
    }

    /**
     * Returns the set of states reachable from the given state.
     */
    public Set<BookingState> allowedTransitions(String currentStateLabel) {
        BookingState current = BookingState.fromLabel(currentStateLabel);
        return Collections.unmodifiableSet(
                TRANSITIONS.getOrDefault(current, EnumSet.noneOf(BookingState.class)));
    }
}

package com.example.springboot.service;

import com.example.springboot.model.Booking;
import com.example.springboot.observer.ClientNotificationObserver;
import com.example.springboot.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ClientNotificationObserver notificationObserver;

    public BookingService(BookingRepository bookingRepository, ClientNotificationObserver notificationObserver) {
        this.bookingRepository = bookingRepository;
        this.notificationObserver = notificationObserver;
    }

    public void confirmBooking(Long bookingId, Long consultantId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getConsultant().getId().equals(consultantId)) {
            throw new RuntimeException("Not authorized");
        }
        booking.addObserver(notificationObserver);

        booking.confirm();
        booking.setState("Pending Payment");

        bookingRepository.save(booking);
    }

    public void rejectBooking(Long bookingId, Long consultantId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getConsultant().getId().equals(consultantId)) {
            throw new RuntimeException("Not authorized");
        }

        booking.addObserver(notificationObserver);

        booking.reject();

        bookingRepository.save(booking);
    }
}

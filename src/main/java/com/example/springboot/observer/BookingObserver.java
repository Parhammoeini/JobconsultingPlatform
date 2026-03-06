package com.example.springboot.observer;

import com.example.springboot.model.Booking;

public interface BookingObserver {
    void update(Booking booking);
}

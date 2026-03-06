package com.example.springboot.observer;

import com.example.springboot.model.Booking;

public class ClientNotificationObserver implements BookingObserver {

    @Override
    public void update(Booking booking) {

        switch (booking.getState()) {

            case "Pending Payment":
                System.out.println("Notify client: booking confirmed, pending payment");
                break;

            case "Rejected":
                System.out.println("Notify client: booking rejected");
                break;

            case "Paid":
                System.out.println("Notify consultant: payment received");
                break;
        }
    }
}

src/main/java/com/example/springboot/
├── model/
│   └── PaymentRequest.java        <-- (UC6: Secure Data Storage)
├── strategy/
│   ├── PaymentStrategy.java       <-- (GoF Strategy Interface)
│   ├── CreditCardStrategy.java    <-- (UC5: Card Validation)
│   ├── PayPalStrategy.java        <-- (UC5: PayPal Validation)
│   └── BankTransferStrategy.java  <-- (UC5: Bank Validation)
├── service/
│   ├── PaymentService.java        <-- (UC5: Workflow Logic)
│   ├── PaymentMethodService.java  <-- (UC6: CRUD Management)
│   └── BookingHistoryService.java <-- (UC4: History Logic)
└── repository/
    └── BookingRepository.java     <-- (The bridge to your teammates' code)

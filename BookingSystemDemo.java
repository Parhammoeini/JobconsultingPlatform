import java.util.UUID;

// --- 1. THE STATE LOGIC ---
enum BookingState {
    REQUESTED, CONFIRMED, PENDING_PAYMENT, PAID, REJECTED, CANCELLED, COMPLETED
}

// --- 2. THE STRATEGY PATTERN (UC5 & UC6) ---
interface PaymentMethod {
    void validate();
    String getType();
}

class CreditCard implements PaymentMethod {
    private String cardNumber, expiry, cvv;
    public CreditCard(String cardNumber, String expiry, String cvv) {
        this.cardNumber = cardNumber; this.expiry = expiry; this.cvv = cvv;
    }
    @Override
    public void validate() {
        if (cardNumber == null || cardNumber.length() != 16) 
            throw new IllegalArgumentException("Invalid Credit Card format");
    }
    @Override public String getType() { return "Credit Card"; }
}

class PayPal implements PaymentMethod {
    private String email;
    public PayPal(String email) { this.email = email; }
    @Override
    public void validate() {
        if (!email.contains("@")) throw new IllegalArgumentException("Invalid PayPal email");
    }
    @Override public String getType() { return "PayPal"; }
}

// --- 3. THE DOMAIN ENTITY ---
class Booking {
    private Long id;
    private BookingState state;

    public Booking(Long id, BookingState state) { this.id = id; this.state = state; }
    public BookingState getState() { return state; }
    public void setState(BookingState state) { this.state = state; }
}

// --- 4. THE SERVICE LAYER (The Logic Hub) ---
class TransactionResult {
    private String id; private boolean success;
    public TransactionResult(String id, boolean success) { this.id = id; this.success = success; }
    public String getTransactionId() { return id; }
    public boolean isSuccess() { return success; }
}

class BookingService {
    public TransactionResult processPayment(Booking booking, PaymentMethod method) {
        // Business Rule: Check state before processing
        if (booking.getState() == BookingState.CANCELLED) {
            throw new IllegalStateException("Cannot pay for a cancelled booking");
        }

        // Step 1: Validate (Strategy Pattern)
        method.validate();

        // Step 2: Simulate 2-second delay (Requirement 5.1.2)
        try { Thread.sleep(2000); } catch (InterruptedException e) { e.printStackTrace(); }

        // Step 3: Generate ID & Update State
        String transactionId = UUID.randomUUID().toString();
        booking.setState(BookingState.PAID);

        System.out.println("Payment successful via " + method.getType() + ". ID: " + transactionId);
        return new TransactionResult(transactionId, true);
    }
}


public class BookingSystemDemo {
    public static void main(String[] args) {
        BookingService service = new BookingService();
        
        // Test Case 1: Valid Credit Card
        Booking b1 = new Booking(1L, BookingState.CONFIRMED);
        CreditCard cc = new CreditCard("1234567812345678", "12/28", "123");
        service.processPayment(b1, cc);
        System.out.println("Booking 1 State: " + b1.getState()); // Should be PAID
    }
}

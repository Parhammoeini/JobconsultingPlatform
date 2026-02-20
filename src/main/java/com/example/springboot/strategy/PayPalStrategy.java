@Component
public class PayPalStrategy implements PaymentStrategy {
    @Override
    public boolean validate(PaymentRequest req) {
        return req.getEmail() != null && req.getEmail().contains("@");
    }

    @Override
    public String process(double amount) {
        try { Thread.sleep(2000); } catch (InterruptedException e) {}
        return "PP-" + UUID.randomUUID().toString();
    }

    @Override
    public String getMethodName() { return "PAYPAL"; }
}
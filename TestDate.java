import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TestDate {
    public static void main(String[] args) {
        try {
            LocalDateTime dt = LocalDateTime.parse("2026-06-29T00:00:00", DateTimeFormatter.ISO_DATE_TIME);
            System.out.println("Parsed: " + dt);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

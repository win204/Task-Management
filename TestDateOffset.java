import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class TestDateOffset {
    public static void main(String[] args) {
        String[] dates = {
            "2026-06-28T17:00:00.000Z",
            "2026-06-29T00:00:00+07:00",
            "2026-06-29T00:00:00"
        };
        for (String d : dates) {
            try {
                LocalDateTime ldt;
                try {
                    ldt = OffsetDateTime.parse(d).withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
                } catch (Exception e) {
                    ldt = LocalDateTime.parse(d, DateTimeFormatter.ISO_DATE_TIME);
                }
                System.out.println(d + " -> " + ldt);
            } catch (Exception e) {
                System.out.println(d + " -> ERROR");
            }
        }
    }
}

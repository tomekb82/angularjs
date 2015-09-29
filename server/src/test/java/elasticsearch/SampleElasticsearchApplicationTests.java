/*
package elasticsearch;

import java.net.ConnectException;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.test.OutputCapture;
import org.springframework.core.NestedCheckedException;
import tb.angularjs.Application;
import tb.angularjs.SampleElasticsearchApplication;

import static org.junit.Assert.assertTrue;

public class SampleElasticsearchApplicationTests {
    private static final String[] PROPERTIES = {
            "spring.data.elasticsearch.properties.path.data:target/data",
            "spring.data.elasticsearch.properties.path.logs:target/logs" };
    @Rule
    public OutputCapture outputCapture = new OutputCapture();
    @Test
    public void testDefaultSettings() throws Exception {
        try {
            new SpringApplicationBuilder(SampleElasticsearchApplication.class)
                    .properties(PROPERTIES).run();
        }
        catch (IllegalStateException ex) {
            if (serverNotRunning(ex)) {
                return;
            }
        }
        String output = this.outputCapture.toString();
        assertTrue("Wrong output: " + output,
                output.contains("firstName='Alice', lastName='Smith'"));
    }
    private boolean serverNotRunning(IllegalStateException ex) {
        @SuppressWarnings("serial")
        NestedCheckedException nested = new NestedCheckedException("failed", ex) {
        };
        if (nested.contains(ConnectException.class)) {
            Throwable root = nested.getRootCause();
            if (root.getMessage().contains("Connection refused")) {
                return true;
            }
        }
        return false;
    }
}*/

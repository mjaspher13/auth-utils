package tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.net.MalformedURLException;
import java.net.URL;

public class GoogleSearchTest {

    private WebDriver driver;

    @BeforeClass
    public void setup() throws MalformedURLException {
        // Set Desired Capabilities for Chrome
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setBrowserName("chrome");

        // Connect to Selenium Grid Hub
        driver = new RemoteWebDriver(new URL("http://selenium-hub:4444/wd/hub"), capabilities);
    }

    @Test
    public void testGoogleSearch() {
        // Open Google
        driver.get("https://www.google.com");

        // Search for "GitLab CI Maven Selenium"
        driver.findElement(By.name("q")).sendKeys("GitLab CI Maven Selenium" + Keys.RETURN);

        // Verify the results page
        assert driver.getTitle().contains("GitLab CI Maven Selenium");
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

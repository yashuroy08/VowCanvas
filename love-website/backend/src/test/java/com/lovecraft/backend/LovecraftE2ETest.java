package com.lovecraft.backend;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class LovecraftE2ETest {
    // Playwright ThreadLocals for parallel-safe execution
    protected static ThreadLocal<Playwright> playwrightTL = new ThreadLocal<>();
    protected static ThreadLocal<Browser> browserTL = new ThreadLocal<>();
    protected static ThreadLocal<BrowserContext> contextTL = new ThreadLocal<>();
    protected static ThreadLocal<Page> pageTL = new ThreadLocal<>();

    protected Page page() {
        return pageTL.get();
    }

    @BeforeEach
    void setUp() {
        Playwright playwright = Playwright.create();
        playwrightTL.set(playwright);

        Browser browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(true));
        browserTL.set(browser);

        BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                .setViewportSize(1920, 1080)
                .setRecordVideoDir(Paths.get("target/videos/"))
                .setLocale("en-US"));
        context.tracing().start(new Tracing.StartOptions()
                .setScreenshots(true).setSnapshots(true));
        contextTL.set(context);
        pageTL.set(context.newPage());
    }

    @AfterEach
    void tearDown(TestInfo testInfo) {
        String name = testInfo.getDisplayName().replaceAll("[^a-zA-Z0-9]", "_");
        contextTL.get().tracing().stop(new Tracing.StopOptions()
                .setPath(Paths.get("target/traces/" + name + ".zip")));
        pageTL.get().close();
        contextTL.get().close();
        browserTL.get().close();
        playwrightTL.get().close();
    }

    @Test
    @DisplayName("Should load the landing page and verify basic content")
    void testLandingPageLoads() {
        // We assume Vite is running on port 5173 or the app is served via Spring Boot.
        // Let's test the vite dev server url for now.
        page().navigate("http://localhost:5174/");

        // Wait for network idle and check for a key element on the page
        page().waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
        
        // Assert that the title or brand name is present
        boolean hasBrand = page().locator("text=LoveCraft").first().isVisible();
        assertTrue(hasBrand, "Brand name 'LoveCraft' should be visible");
        
        // Assert that the 'Create' button exists
        boolean hasCreateBtn = page().getByRole(com.microsoft.playwright.options.AriaRole.BUTTON, 
            new Page.GetByRoleOptions().setName("Create yours")).first().isVisible();
        assertTrue(hasCreateBtn, "Should have the 'Create yours' button");
    }
}

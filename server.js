import express from "express";
import bodyParser from "body-parser";
import { chromium } from "playwright";

const app = express();
app.use(bodyParser.json());

app.post("/mcp", async (req, res) => {
  try {
    const message = req.body;

    if (message.method === "tools/loginAndGetTitle") {
      const { email, password } = message.params;

      const browser = await chromium.launch();
      const page = await browser.newPage();

      await page.goto("https://web.uat.dr-adem.com/login");

      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await page.waitForLoadState("networkidle");

      const title = await page.title();
      await browser.close();

      return res.json({
        id: message.id,
        result: { title }
      });
    }

    res.json({ error: "Unknown method" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("MCP Server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server listening on port ${PORT}`);
});

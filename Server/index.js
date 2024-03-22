const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const { chromium } = require("playwright");
require("dotenv").config();
app.use(express.json());
app.use(cors());
const uri =
  "mongodb://MKahf:abcd+1234@ac-bcoknhk-shard-00-00.uepdn4d.mongodb.net:27017,ac-bcoknhk-shard-00-01.uepdn4d.mongodb.net:27017,ac-bcoknhk-shard-00-02.uepdn4d.mongodb.net:27017/?ssl=true&replicaSet=atlas-1300lv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let price = null;

async function scrapeDynamicData() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://snowtrace.io/");
  await page.waitForLoadState("networkidle", { timeout: 2000000 });

  const parentElement = await page.$("div.text-right");

  if (parentElement) {
    const specificElement = await parentElement.$("span.text-slate-500");
    if (specificElement) {
      const innerText = await specificElement.innerText();

      await browser.close();
      return innerText;
    } else {
      console.log("Specific Element not found within the parent element.");
    }
  } else {
    console.log("Parent Element not found.");
  }

  await browser.close();
}

async function scrapeAndStore() {
  const scrapedData = await scrapeDynamicData();
  console.log("data scraped", scrapedData);
  if (scrapedData) {
    insertDocument(scrapedData);
  }
}
async function insertDocument(price) {
  try {
    await client.connect();
    const database = client.db("GasPrice");
    const pricesCollection = database.collection("prices");
    const document = {
      timestamp: new Date(),
      price: price,
    };
    const result = await pricesCollection.insertOne(document);
    console.log("Inserted document with _id:", result.insertedId);
  } catch {
    console.log("error occured in insertion");
  } finally {
    await client.close();
  }
}

async function getPrices() {
  try {
    await client.connect();
    const database = client.db("GasPrice");
    const pricesCollection = database.collection("prices");
    const prices = await pricesCollection.find().limit(10).toArray();
    return prices;
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
  }
}

app.get("/", async (req, res) => {
  priceList = await getPrices();

  res.json(priceList);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  scrapeAndStore();
  setInterval(scrapeAndStore, 30 * 60 * 1000);
});

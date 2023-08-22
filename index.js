const express = require("express");
const axios = require("axios");

const app = express();
const port = 8008;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;
  const allNumbers = [];

  if (!urls) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const urlArray = Array.isArray(urls) ? urls : [urls];

    for (const url of urlArray) {
      try {
        const response = await axios.get(url);
        const numbers = response.data.numbers;

        if (Array.isArray(numbers)) {
          allNumbers.push(...numbers);
        }

        allNumbers = allNumbers
          .sort((a, b) => a - b)
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
      }
    }

    return res.json({ numbers: allNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

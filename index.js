import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const database = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "password",
  port: 5432,
});

database.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let countries = [];
let totalCount;

app.get("/", async (req, res) => {
  const response = await database.query(
    "SELECT country_code from visited_countries"
  );
  totalCount = response.rowCount;
  response.rows.forEach((row) => {
    countries.push(row.country_code);
  });
  res.render("index.ejs", {
    countries: countries,
    total: totalCount,
  });
});

app.post("/add", async (req, res) => {
  const country = req.body.country;

  database
    .query("SELECT country_code FROM countries WHERE country_name = $1", [
      country,
    ])
    .then((getCountries) => {
      if (getCountries.rows.length === 0) {
        // If no country_code is found, send a 404 response
        return res.status(404).send("Country not found");
      }

      const country_code = getCountries.rows[0].country_code;

      // Insert the country_code into visited_countries
      return database
        .query("INSERT INTO visited_countries(country_code) VALUES ($1)", [
          country_code,
        ])
        .then(() => {
          // Redirect after successful insertion
          res.redirect("/");
        });
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
      res.status(500).send("An error occurred");
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

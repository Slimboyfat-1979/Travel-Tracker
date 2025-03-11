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
  const response = await database.query("SELECT country_code from visited_countries");
  totalCount = response.rowCount;
  response.rows.forEach((row) => {
    countries.push(row.country_code);
  });
  res.render("index.ejs", {
    countries: countries,
    total: totalCount
  })
});

app.post("/add", (req, res) => {
    // const response = await database.query("INSERT INTO ")
})



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const host = 'api.frankfurter.app';

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`https://${host}/currencies`);
        const currencies = response.data; // Assuming the response is an object with currency codes and names
        const countryList = Object.keys(currencies).map(code => ({ code, name: currencies[code] }));
        res.render("index.ejs", { countries: countryList });
    } catch (error) {
        console.error("Error fetching currencies:", error);
        res.status(500).send("Error fetching currencies");
    }
});

app.post("/process-country", async (req, res) => {
    const from = req.body.fromCountry;
    const to = req.body.toCountry;
    const amount = req.body.amount;
    console.log("from: " + from + " to: " + to);
    try {
        if(from!=to){
        const response = await axios(`https://${host}/latest?amount=${amount}&from=${from}&to=${to}`);
        console.log(response.data);
        res.render("result.ejs",{result:response.data,fromcountry:from,tocountry:to})}
        else{
            res.render("result.ejs",{error:"invalid conversion"})
        }
       // res.json(response.data); // Sending response back to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Sending error response if request fails
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

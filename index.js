import Express from "express";
import fetch from 'node-fetch';


const app = Express();

let port = process.env.PORT || 3000;


app.get("/api/rates", (req, res) => {

    // If user didn't provide base or currency parameters
    if (req.query.base === undefined || req.query.currency === undefined)
    {
        res.status(400).json({"error": "Please provide a base and currency"})
        return;
    }

    var currencies = req.query.currency.split(","); // An array of the currencies given
    var base = req.query.base; // The base given

    fetch(`https://api.exchangeratesapi.io/latest?base=${base.toUpperCase()}`) // Get API
    .then(response => {
        if (response.ok)
        {
            return response.json();
        }
        else
        {
            res.status(400).json({"error":`Base ${base} is not supported.`});
            return;
        }

    })
    .then(data => {

        var output = {"results": {"base": "","date": "", "rates": {}}};

        // For each currency
        currencies.forEach( currency => {
            if (!(currency.toUpperCase() in data["rates"])) //If currency is not in API
            {

                res.status(400).json({"error":`Currency ${currency} is not supported.`})
                return;
            }
            else
            {
                output["results"]["rates"][currency.toUpperCase()] = data["rates"][currency.toUpperCase()];
            }

        })

        output["results"]["date"] = data["date"];
        output["results"]["base"] = data["base"];

        res.json(output);
    })
    .catch(error => console.log(error))

    return;

})


app.listen(port, () => console.log(`Running on port ${port}`))





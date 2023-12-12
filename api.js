const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000; // Możesz dostosować port do swoich potrzeb

const currencies = [
  { currency: 'dolar amerykański', code: 'USD' },
  { currency: 'euro', code: 'EUR' },
  { currency: 'funt szterling', code: 'GBP' },
];

async function getExchangeRates() {
  const exchangeRates = {};

  for (const currency of currencies) {
    const { currency: name, code } = currency;

    try {
      const response = await axios.get(`http://api.nbp.pl/api/exchangerates/rates/A/${code}/?format=json`);
      const rate = response.data.rates[0].mid;
      exchangeRates[code.toLowerCase()] = rate; // Przechowujemy kursy jako obiekty { "code": rate }
    } catch (error) {
      console.error(`Błąd podczas pobierania danych dla ${name} (${code}): ${error.message}`);
    }
  }

  return exchangeRates;
}

app.get('/dolar', async (req, res) => {
  const rates = await getExchangeRates();
  res.json({ kurs: rates.usd });
});

app.get('/euro', async (req, res) => {
  const rates = await getExchangeRates();
  res.json({ kurs: rates.eur });
});

app.get('/funt', async (req, res) => {
  const rates = await getExchangeRates();
  res.json({ kurs: rates.gbp });
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
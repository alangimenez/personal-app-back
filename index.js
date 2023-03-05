const config = require('./config/config.environments');
const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors')
const quotesRouter = require('./router/quotesRouter');
const lastValueRouter = require('./router/lastValueRouter');
const tirRouter = require('./router/tirRouter');
const cashflowRouter = require('./router/cashFlowRouter');
const registersRouter = require('./router/registerRouter');
const accountRouter = require('./router/accountRouter');
const investmentRouter = require('./router/investmentRouter');
const assetTypeRouter = require('./router/assetTypeRouter');
const otherQuotesRouter = require('./router/otherQuotesRouter');
const creditCardRouter = require('./router/creditCardRouter');
const expenseCreditCardRouter = require('./router/expensesCreditCardRouter');
const mercadoPagoRouter = require('./router/mercadoPagoRouter')
const periodRouter = require('./router/periodRouter')
const refundRouter = require('./router/refundRouter')
// const midSecurity = require('./middlewares/security');

// habilitar cors
app.use(cors())

// Hacer que node sirva los archivos de nuestro app React
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

// Manejar las peticiones GET en la ruta /api
app.get("/api", (req, res) => {
    res.json({ message: "Hola desde el servidor!" });
});

app.post("/api", (req, res) => {
    // console.log(JSON.parse(req.body.title))
    res.json({ message: req.body });
});

app.use('/quotes' , quotesRouter)
app.use('/lastvalue',lastValueRouter)
app.use('/tir', tirRouter)
app.use('/cashflow', cashflowRouter)
app.use('/registers', registersRouter)
app.use('/account', accountRouter)
app.use('/investment', investmentRouter)
app.use('/assettype', assetTypeRouter)
app.use('/otherquotes', otherQuotesRouter)
app.use('/creditcard', creditCardRouter)
app.use('/expensecreditcard', expenseCreditCardRouter)
app.use('/mercadopago', mercadoPagoRouter)
app.use('/period', periodRouter)
app.use('/refund', refundRouter)

// Todas las peticiones GET que no hayamos manejado en las líneas anteriores retornaran nuestro app React
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT} with node_env ${config.NODE_ENV}`);
});

// export 'app'
module.exports = app
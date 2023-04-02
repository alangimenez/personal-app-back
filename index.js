const config = require('./config/config.environments');
const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors')
const quotesRouter = require('./router/investments/quotesRouter');
const lastValueRouter = require('./router/investments/lastValueRouter');
const tirRouter = require('./router/investments/tirRouter');
const cashflowRouter = require('./router/investments/cashFlowRouter');
const registersRouter = require('./router/registerRouter');
const accountRouter = require('./router/accountRouter');
const investmentRouter = require('./router/investments/investmentRouter');
const assetTypeRouter = require('./router/assetTypeRouter');
const otherQuotesRouter = require('./router/investments/otherQuotesRouter');
const creditCardRouter = require('./router/creditCardRouter');
const expenseCreditCardRouter = require('./router/expensesCreditCardRouter');
const mercadoPagoRouter = require('./router/mercadoPagoRouter')
const periodRouter = require('./router/periodRouter')
const refundRouter = require('./router/refundRouter')
const userRouter = require('./router/user/userRouter')
const auth = require('./middlewares/auth');
// const midSecurity = require('./middlewares/security');

// cors???
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

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

app.use('/quotes', auth, quotesRouter)
app.use('/lastvalue', auth, lastValueRouter)
app.use('/tir', auth, tirRouter)
app.use('/cashflow', auth, cashflowRouter)
app.use('/registers', auth, registersRouter)
app.use('/account', auth, accountRouter)
app.use('/investment', auth, investmentRouter)
app.use('/assettype', auth, assetTypeRouter)
app.use('/otherquotes', auth, otherQuotesRouter)
app.use('/creditcard', auth, creditCardRouter)
app.use('/expensecreditcard', auth, expenseCreditCardRouter)
app.use('/mercadopago', auth, mercadoPagoRouter)
app.use('/period', auth, periodRouter)
app.use('/refund', auth, refundRouter)
app.use('/user', userRouter)

// Todas las peticiones GET que no hayamos manejado en las líneas anteriores retornaran nuestro app React
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT} with node_env ${config.NODE_ENV}`);
});

// export 'app'
module.exports = app
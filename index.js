//IMPORT FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

//IMPORT FROM OTHRE FILES
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

//INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://ggoomm:ghawm2688@cluster0.me30ntt.mongodb.net/?retryWrites=true&w=majority";

//MIDDLEWARE
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//CONNECTIONS
mongoose
.connect(DB)
.then(() => {
    console.log('connection success!');
}).catch(e => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
})

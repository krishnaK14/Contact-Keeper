//node modules
const express=require("express");
const connectDB=require("./config/db");
const path = require("path");

//express intialiation
const app=express();
//port
const PORT= process.env.PORT || 5000;

//database connection
connectDB();

//init middleware
app.use(express.json({extended:false}));

//defined routes
app.use("/api/users",require("./routes/users"));
app.use("/api/contacts",require("./routes/contacts"));
app.use("/api/auth",require("./routes/auth"));

//server static assets in production
if(process.env.NODE_ENV === 'production')
 //set static folder
 app.use(express.static('client/build'));

 app.get('*', (req,res) => res.sendFile(path.resolve(__dirname,'client','build','index.html')));


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})
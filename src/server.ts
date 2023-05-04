import express, { Request, Response } from 'express';
import { Query } from 'express-serve-static-core';


const app = express();
const server = app.listen(3000, () => console.log('Server is running...'));


//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRoutes } from './app/modules/student/student.route';
const app: Application = express()
// const port = 3000


// parsers
app.use(express.json());
app.use(cors())


// application routes
app.use('/api/v1/students',StudentRoutes);

const getAController = (req: Request, res: Response) => {
    res.send('Hello World!')
}

app.get('/', getAController)

export default app;

// console.log(process.cwd());
import express from 'express';
import type { NextFunction, Request, Response, Express } from 'express';
import cors from 'cors';


const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
// app.use(router);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World!');
    console.log("requisição feita com sucesso.")
})

app.listen(PORT, () => {
    console.log("servidor rodando na porta 3000.")
})
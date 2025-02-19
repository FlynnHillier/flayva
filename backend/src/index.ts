import express, { Request, Response } from "express";
import { env } from "@/env";

const app = express();
const port = env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

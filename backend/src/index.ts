import { env } from "@/env";
import app from "@server/app";

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import 'module-alias/register';
import { createServer } from 'http';
import 'dotenv/config';
import app from './app';
import { PORT } from './configs/app.configs';
import { connectToDB } from './services/mongoose';

const server = createServer(app);

server.listen(PORT, async () => {
  console.log('try to connect mongoose');
  await connectToDB();
  console.log('server is listen');
  console.log(`http://localhost:${PORT}/`);
});

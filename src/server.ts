import { createServer } from 'http';
import 'dotenv/config';
import app from './app';
import { PORT } from './config';
import { connectToDB } from './services/db';

const server = createServer(app);

server.listen(PORT, async () => {
  console.log('try to connect mongoose');
  await connectToDB();
  console.log('server is listen');
  console.log(`http://localhost:${PORT}/`);
});

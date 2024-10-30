import { createServer } from 'http';
import 'dotenv/config';
import app from './app';
import { PORT } from './config';

const server = createServer(app);

server.listen(PORT, () => {
  console.log('server is listen');
  console.log(`http://localhost:${PORT}/`);
});

import { createApp } from './app.js';
import { env } from './env.js';

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`AI Hub backend listening on http://localhost:${env.port}`);
});

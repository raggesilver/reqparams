import * as express from 'express';

export function createApp () {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: any, res: express.Response, next: any) => {
    console.error(error);
    return res.status(500).json({ error: 'Internal error' });
  });
  return app;
}

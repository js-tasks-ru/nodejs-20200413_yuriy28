const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = {};

router.get('/subscribe', async (ctx) => {
  ctx.body = await new Promise((resolve) => {
    const id = ctx.query['r'] || Math.random();
    clients[id] = resolve;
    ctx.req.on('close', () => {
      delete clients[id];
      resolve();
    });
  });
});

router.post('/publish', async (ctx) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400, 'Bad Request');
  }

  for (let id in clients) {
    if (clients.hasOwnProperty(id)) {
      clients[id](message);
    }
  }

  clients = {};
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;

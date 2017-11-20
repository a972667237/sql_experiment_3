const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index.html', {
    title: 'Hello Koa 2!'
  })
})
/*
{
    table: 'employee',
    attribute: ['eid', 'ename', 'city'],
    content: [
      {
        ['e00', 'Amy', 'Vestal'],
        ['e01', 'Amy', 'Vestal'],
        ['e02', 'Amy', 'Vestal'],
        ['e03', 'Amy', 'Vestal'],
        ['e04', 'Amy', 'Vestal']
      }
    ]
}
*/
router.param('id', function (id, ctx, next) {
    if (id>5||id<0) return ctx.status = 404;
    ctx.mid = id;
    return next();
  })
  .get('/get/:id', async (ctx, next) => {
  const { getInfo } = require("../models/getInfo");
  ctx.body = await getInfo(ctx.mid);
})

router.post("/update", async (ctx, next) => {
  const { updateInfo } = require("../models/updateInfo");
  ctx.body = await updateInfo(ctx.request.body);
})

router.post("/add", async (ctx, next) => {
  const { addInfo } = require("../models/addInfo");
  ctx.body = await addInfo(ctx.request.body);
})

router.post("/del", async (ctx, next) => {
  const { delInfo } = require("../models/delInfo");
  ctx.body = await delInfo(ctx.request.body);
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router

const Koa = require("koa");
const Router = require("koa-router");
const cheerio = require("cheerio");
const koaBody = require("koa-body");

const charset = require("superagent-charset");
const superagent = charset(require("superagent"));

const app = new Koa();
const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "abc";
});

router.get("/reptile", async (ctx, next) => {
  const res = await superagent
    .get(ctx.request.query.url)
    .charset("utf-8")
    .buffer(true);

  let html = res.text,
    $ = cheerio.load(html, {
      decodeEntities: false,
      ignoreWhitespace: false,
      xmlMode: false,
      lowerCaseTags: false,
    }),
    arr = [];
  // cheerio的使用类似jquery的操作
  $("table tbody").each((index, element) => {
    let $element = $(element);
    $element
      .find("#tctitle")
      .next()
      .find("a")
      .addClass("link")
      .attr("class", "link")
      .text("");
    arr.push({
      title: $element.find("a.blue14b").text(),
      image: $element.find("#bright img").attr("src"),
      summary: $element.find("#tctitle").next().text(),
      is_cgiia:
        $element.find("#tctitle font").attr("color") === "green" ? 1 : 0,
    });
  });
  console.log(html);
  ctx.body = html;
});

app.use(koaBody());
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log("app started at port 8080...");
});

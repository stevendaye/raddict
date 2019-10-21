import config from "../config.mjs";
import user from "../controllers"

const routes = server => {
  server.post(config.routes.user.create, user.create);
  server.post(config.routes.user.update, user.update);
  server.post(config.routes.user.findOrCreate, user.findOrCreate);
  server.get(config.routes.user.find, user.find);
  server.del(config.routes.user.destroy, user.destroy);
  server.post(config.routes.user.checkPassword, user.checkPassword);
  server.get(config.routes.user.list, user.list);

  server.listen(process.env.PORT, process.env.REST_LISTEN ? process.env.REST_LISTEN : "localhost", () => {
    console.log(`User authentication server ${server.name} running at ${server.url}`);
  });
};

export default routes;

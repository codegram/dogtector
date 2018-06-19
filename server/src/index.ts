import * as Hapi from "hapi";
import * as Boom from "boom";
import * as fs from "fs";
import * as redis from "redis";
import * as inert from "inert";
import { promisify } from "util";

// Utils
import { uploader, classifyImage } from "./utils";

// Models
import { FileUploaderOptions } from "./models/file-uploader-options.model";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});
const UPLOAD_PATH = "uploads";
const REDIS_LIST_LEY = "photos";
const fileOptions: FileUploaderOptions = { dest: `${UPLOAD_PATH}/` };

if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

const app = new Hapi.Server({
  port: 3001,
  host: "0.0.0.0",
  routes: { cors: true }
});

const start = async () => {
  await app.register(inert);

  app.route({
    method: "POST",
    path: "/upload",
    options: {
      payload: {
        output: "stream",
        allow: "multipart/form-data",
        maxBytes: 10048576
      }
    },
    handler: async function(request) {
      try {
        const data = request.payload;
        const file = data["photo"];
        const fileName = await uploader(file, fileOptions);

        const lpush = promisify(redisClient.lpush).bind(redisClient);
        await lpush(REDIS_LIST_LEY, fileName);

        const labels = await classifyImage(`${fileOptions.dest}${fileName}`);
        const winner = labels.slice(1).reduce((result, actual) => {
          if (actual.score > result.score) {
            return actual;
          }
          return result;
        }, labels[0]);

        const metadata = {
          fileName,
          labels,
          breed: winner.breed
        };

        const set = promisify(redisClient.set).bind(redisClient);
        await set(
          `${REDIS_LIST_LEY}_${metadata.fileName}_metadata`,
          JSON.stringify(metadata)
        );

        return metadata;
      } catch (err) {
        return Boom.badRequest(err.message, err);
      }
    }
  });

  app.route({
    method: "GET",
    path: "/uploads",
    handler: async function(request) {
      try {
        const lrange = promisify(redisClient.lrange).bind(redisClient);
        const get = promisify(redisClient.get).bind(redisClient);

        const photosList = await lrange(REDIS_LIST_LEY, 0, -1);
        const photos = Promise.all(
          photosList.map(async fileName => {
            const metadataStr = await get(
              `${REDIS_LIST_LEY}_${fileName}_metadata`
            );
            return JSON.parse(metadataStr);
          })
        );

        return photos;
      } catch (err) {
        return Boom.badRequest(err.message, err);
      }
    }
  });

  app.route({
    method: "GET",
    path: "/uploads/{param*}",
    handler: {
      directory: {
        path: "uploads"
      }
    }
  });

  app.route({
    method: "DELETE",
    path: "/uploads",
    handler: async function(request, h) {
      try {
        const del = promisify(redisClient.del).bind(redisClient);
        const keys = promisify(redisClient.keys).bind(redisClient);

        const metadataKeys = await keys(`${REDIS_LIST_LEY}_*_metadata`);
        for (const key of metadataKeys) {
          await del(key);
        }
        await del(REDIS_LIST_LEY);
        return "ok";
      } catch (err) {
        return Boom.badRequest(err.message, err);
      }
    }
  });

  try {
    await app.start();
  } catch (err) {
    throw err;
  }
  console.log(`Server running at: ${app.info.uri}`);
};

start();

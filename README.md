# edconnect-project

The only external requirement you need to start development is `Docker`. So make sure it is installed and running

Build image (only necessary to run if you haven't built the image before, or you modify a Dockerfile)
```
docker-compose build
```

Start development server (available at http://localhost:4000). Note the start command in the image is `npm run dev`. This is intended for dev environments. To switch to non-dev environments, run `npm start`
```
docker-compose up
```

Stop all containers spawned by docker-compose
```
docker-compose down
```

Stop all containers as well as remove volumes (this will clear the database, as the data is stored on volumes that are reused across multiple container invocations)
```
docker-compose down --volumes
```

Connect interactive shell to running container (this is where you run ad-hoc shell commands like npm install in your project. Do not execute commands in the host terminal)
```
docker-compose exec app sh
```

In dev mode, `nodemon` doesn't watch all the files, just the ones defined in `nodemon.json`. This is because when the express server is restarted it wipes out the session, so in order to reduce repetitive logging in, only files that necessitate a restart are watched.

The views (seen in `views` folder) uses a webpack server to serve view files in dev mode, and on each view file save, the view server rebuilds the files, and refreshes the browser. This is done by the webpck hot-module reload mechanism setup in the `@react-ssr` package. In some cases you'll probably need to refresh manually though for the views to re-evaluate some data. So probably better to get into the habit of refreshing manually to see new changes.

The database is seeded with some data on application startup (it only does this if the data isn't already available). You can browse the mongodb collections using a GUI browser like `NoSQLBooster for MongoDB`, and then connecting on `localhost:27017` 

Create a bogus listener in order to keep the node process from exiting (and therefore stopping the `app` container). You probably won't need this, its just an FYI for me
```
require('net').createServer().listen();
```

We should use a more secure session storage mechanism than the current default `MemoryStore` when deploying to production. Using mongodb for this purpose would be a good alternative. A snippet of how this can integrated is provided below.
```
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
});
app.use(session({
    ...
    store: store
}));
```

To enable file uploads you need to create an `uploads` folder in `app/server/`. You may also need to connect an interactive shell to the running container and relax permissions on the folder by running `chmod -R 777 uploads`, so the node process can write to the folder.
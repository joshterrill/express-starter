# express-starter

An express starter app written in ES6 syntax that functions as a REST API connected to a mongoose database.

### Download / Configure

1. Download

```
git clone https://github.com/joshterrill/express-starter
cd express-starter/
npm install
```


2. Configure by replacing the `<username>, <password>, <database>`, and all other values in `.env.example` with real values, and then rename it to just `.env`.

### Build and Run

```
npm start
or
npm run dev
```

### Authentication / Login / Registration

This server is set up with a simple authentication scheme, model, and registration/login endpoints which give JWT tokens that are enforced as a middleware through the `express-jwt` library. The routes can be found in `src/api/auth.js` and the mongoose model for the User can be found in `src/model/User.js`. In the `src/index.js` file there is a line that looks like this:

```javascript
app.use(jwt({ secret: process.env.JWT_SECRET}).unless({path: [/auth/i]}));
```

Which is used to handle exceptions for routes that do not require a JWT token. In the example above, only the `/auth` routes are exempt from a JWT token, but it is an array that can hold either regular expressions as shown above or strings.

### CRUD Routes

In the `src/index.js` file there is one example of CRUD route creation. This gives you the ability to have full CRUD access to a mongo collection through various RESTful endpoints such as: get all, get by id, get by ?, save, update, delete, etc. You can create new CRUD endpoints by creating new middlewares that are pointed to a specific context like this;

```javascript
app.use('/api/crud', crud('User', db));
app.use('/api/crud', crud('Entity', db));
app.use('/api/crud', crud('Events', db));
// etc, etc
```

### CORS Policy

For development purposes, the server is allowing all connections to make requests through these lines in the `src/index.js` file.

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});
```

This can be modified to your liking when pushing out to a production environment.
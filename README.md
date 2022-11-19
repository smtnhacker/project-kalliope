# project-kalliope

A book club app

## Development

There are two ways of running the development servers.

### Using Docker

Just run the following commands:

```bash
docker compose build
docker compose up
```

Note that currently, this does not allow hot-reload and nodemon to work.

### Running each services

If you want a better developer experience and have more control over the environment, you have to setup each individual service manually. 

#### Client

Make sure you have `npm` installed. For now, use version 16.15.

Ensure you are in the proper directory by running the following command:

```bash
cd client
```

Then, you have to install the required dependencies. Just run the following command:

```bash
npm install
```

To start the client development server, just run the following command:

```bash
npm start
```

#### Server

Make sure you have `npm` installed. For now, use version 16.15.

Ensure you are in the proper directory by running the following command (assuming you're in the root directory):

```bash
cd server
```

Then, you have to install the required dependencies and build the initial files. Just run the following commands:

```bash
npm install
npm run build
```

To start the server development server, just run the following command:

```bash
npm run dev
```

After running the services, you can access the app in:

```bash
http://localhost:3000
```

and the API server in:

```bash
http://localhost:8000
```
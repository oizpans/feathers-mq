# feathers-mq
<img src="https://img.shields.io/github/tag/oizpans/feathers-mq.svg" /> <img src="https://img.shields.io/npm/v/@feathersjs/feathers.svg?label=@feathersjs/feathers" /> <img src="https://img.shields.io/npm/v/nats.svg?label=nats" />

FeathersJS message queue wrapper for the client and server in microservice.
Serves as the transport-layer between 2 or more **featherJS instances**.

## Requirements
* There must be a running NATS server at least on localhost port **4222** of the server where app resides

## Installation
```ssh
npm install git+https://github.com/oizpans/feathers-mq.git
```

## Sample Usage
[Here](./sample-here.md)

### ChangeLogs
- **1.2.12** - remove nodemon dependency flatmap in package-lock, [Details](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/).
- **1.3.0**
  - Testing
  - Upgraded dependencies
  - Run nats server in dockerized environment.
  - with `retry-once` mechanism.
- **1.3.1** - Improve handling of errors. **[Issue here](https://github.com/oizpans/feathers-mq/issues/41)**
- **1.3.2** - backward-compatibility support on error handling.

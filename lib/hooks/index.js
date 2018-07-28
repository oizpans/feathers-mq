const debug = require('debug')('feathers-mq:hook:');
const NATS = require('nats');
const deniedMethods = ['find','get'];

module.exports = function Logger(){
  
  const nats = NATS.connect({json: true});
  
  return function logger(context){
    
    const appName = context.app.get('appName');
    
    if (!appName) {
      throw new Errors.BadRequest('App name is required');
    }
    
    // console.log(`${natsConfig.url}:${natsConfig.port}`)
    const serviceName = context.path;
    const methodName = context.method;
    
    if(deniedMethods.includes(methodName)){
      return context;
    }
    
    const logData = {
      result: context.result,
      method: context.method,
      service: context.path,
      data: context.data,
      params: context.params,
    };
    
    console.log(logData);
    
    const natsSubject = `${appName}.${serviceName}.${methodName}`;
    debug(`triggered %O`,natsSubject);
    nats.publish(natsSubject, logData);
    
    return context;
  }
}
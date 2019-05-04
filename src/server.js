//const https = require('https');
const http = require('http');
//const fs = require('fs');
const app = require('./app');
const url = require('url');
//const WebSocketServer = require('ws').Server
const port = process.env.PORT || 8443;
const path = require('path');

global.appRoot = path.resolve(__dirname);
process.env.NODE_ENV = "dev";

// Configuracion logger
const log4js = require('log4js');
//log4js.configure(path.join(__dirname,'/app/config/log4js_config.json'));
log4js.configure({
  "appenders":
   {
    "App": {
        "type": "dateFile",
        "filename": path.join(__dirname,'./app/logs/App'),
        "pattern": "-yyyy-MM-dd.log",
        "backups": 365,
        "alwaysIncludePattern": true
      }
  },
    "categories": {
      "default": { "appenders": ["App"], "level": "all" }
      }
});

global.logger = log4js.getLogger('App');



//const server = http.createServer(app);
/* let httpsServer = https.createServer({
  key: fs.readFileSync(global.appRoot + '/app/certs/fileManagerServer.key'),
  cert: fs.readFileSync(global.appRoot + '/app/certs/fileManagerServer.cert')
}, app).listen(port, function () {
  logger.info('********* Starting ScreenPop v.1.0 **********');
  logger.info('Server listen on port ' + port);
  console.log('Enviroment: ',process.env.NODE_ENV);
  console.log("https server listening on port " + port + "...");
  console.info('==> 🌎  Go to http://localhost:%s', aport);
}); */

let httpsServer = http.createServer(app).listen(port, function () {
  logger.info('********* Starting ScreenPop v.1.0 **********');
  logger.info('Server listen on port ' + port);
  console.log('Enviroment: ',process.env.NODE_ENV);
  console.log("https server listening on port " + port + "...");
  console.info('==> 🌎  Go to http://localhost:%s', port);
});


let noop = () => { };

httpsServer.on('uncaughtException', (request, response, route, error) => {
  console.error(error.stack);
  response.send(error);
});

httpsServer.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
});



// *******************************************************
//  Cierra conexiones cuando la aplicacion es interrumpida
// *******************************************************
var Shutdown = function() {
  logger.info('Shutdown() -> Received kill signal, shutting down gracefully.');
  //console.log("Received kill signal, shutting down gracefully.");
  
  httpsServer.close(function() {
      logger.info('Shutdown() -> Closed out remaining connections.');
      logger.info('*************** Shutdown finished **************');
      setTimeout(function() { process.exit(); }, 3000);
  });

  // if after
  setTimeout(function() {
      logger.error('Shutdown() -> Could not close connections in time, forcefully shutting down');
      logger.info('*************** Shutdown finished **************');
      setTimeout(function() { process.exit(); }, 1000);
  }, 10 * 1000);
};


// ********************************************************
//  Control de interrupciones
// ********************************************************
// listen for TERM signal .e.g. kill

process.on('SIGTERM', Shutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', Shutdown);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

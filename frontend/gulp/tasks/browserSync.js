module.exports = function(gulp, data, util, taskName) {
  "use strict";

  const url = require("url");
  const proxy = require("proxy-middleware");

  gulp.task("browser-sync", function() {
    var proxyOptions = url.parse("http://localhost:4000/xhr");
    proxyOptions.route = "/xhr/";
    return global.browserSync.init({
      port: "4000",
      server: {
        baseDir: data.someCfg.conf.path.dest.base,
        middleware: [proxy(proxyOptions)]
      },
      injectchanges: true
    });
  });
};

var yate = require('yate');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

module.exports = function() {
    this.cacheable();

    if (this.query) {
        var parsedQuery = querystring.parse(this.query.slice(1));
        var commonPath = parsedQuery.common;

        compileCommonModule(commonPath);
    }

    var js = yate.compile(this.resourcePath).js;
    var filename = path.basename(this.resourcePath, '.yate');

    return 'exports["yate-' + filename + '"] = (function(){' + js + '})();';

};

function compileCommonModule(path) {
    var objPath = path + '.obj';

    var isExist = fs.existsSync(objPath);

    if (!isExist) {
        yate.compile(path);
    }

    var obj = JSON.parse(fs.readFileSync(objPath, 'utf8'));

    yate.modules = {
        'common': obj
    };
}
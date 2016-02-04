var yate = require('yate');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

module.exports = function() {
    var parsedQuery = querystring.parse(this.query.slice(1));
    var commonPath = parsedQuery.common;
    var objPath = commonPath + '.obj';

    var isExist = fs.existsSync(objPath);

    if (!isExist) {
        yate.compile(commonPath);
    }

    var obj = JSON.parse( fs.readFileSync(objPath, 'utf8') );
    yate.modules = {};
    yate.modules['common'] = obj;

    var js = yate.compile(this.resourcePath).js;
    return 'exports.yate_' + path.basename(this.resourcePath, '.yate') + ' = (function(){' + js + '})();';

};
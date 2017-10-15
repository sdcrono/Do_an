const configValues = require("./config");
module.exports = {
    getDbConnectionString: function(){
        return 'mongodb://'+configValues.uname+':'+configValues.pwd+'@ds133932.mlab.com:33932/nurses';
    }
}
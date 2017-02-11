const request = require('request');
const fns = {
    get : (url, options) => {
            request({
                url: url,
                method: 'get',
                qs: options.data
            }, (error, response, body) => {
                try{
                    let result = JSON.parse(body) || {};
                    if(!error && response.statusCode == 200){
                        options.success ? options.success(result,response) : undefined;
                    }else {
                        options.failure ? options.failure(error) : undefined;
                    }
                    options.callback ? options.callback(result,response) : undefined;
                }catch(e){
                    options.failure ? options.failure("内部错误") : undefined;
                }
            });


    },
    post : (url, options) => {
            request({
                url: url,
                method: 'post',
                json: options.data
            }, (error, response, body) => {
                try{
                    let result = body || {};
                    if(!error && response.statusCode == 200){
                        options.success ? options.success(result,response) : undefined;
                    }else {
                        options.failure ? options.failure(error) : undefined;
                    }
                    options.callback ? options.callback(result,response) : undefined;
                }catch(e){
                    options.failure ? options.failure("内部错误") : undefined;
                }
            });

    },
    success : (result, res) => {
        res.json({
            status: true,
            result: result
        });
    },
    failure : (error, res) => {
        res.json({
            status : false,
            error : error
        });
    }
};

module.exports = fns;
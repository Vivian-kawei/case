/**
 * Created by accurme on 2017/1/8.
 */

/**
 * @param url Json访问地址
 * @param callback 回调函数
 */
function getJson(url, callback) {
    $.getJSON(url, function(data) {
        typeof callback === 'function' ? callback(data) : undefined;
    });
}

/**
 * 开启数据库链接
 * @param options
 * @returns {*}
 */
function openDB(options) {

    var dataBase = openDatabase(options.dbName, options.version || 1, options.description, options.size || (20 * 1024)); // 默认20MB

    if(dataBase){

        return dataBase;

    }else {
        alert("您的浏览器不支持HTML5本地数据库");
        return undefined;
    }
}

$(document).ready(function() {

    NProgress.start(); //页面开始加载

    var dbName = "params";

    getJson(rootPath + "/json/case_diagnosis.json", function(data){

        var db = window.db = openDB({dbName : dbName, version : data.version, description : '诊断数据'});

        if(db){

            db.transaction(function (trans) {//启动一个事务，并设置回调函数

                trans.executeSql("create table if not exists diagnosis(_id text not null,name text not null, duration text not null, type text not null)", [], function (trans, result) {

                    trans.executeSql("select count(*) as count from diagnosis", [], function (trans, result) {
                        if(result.rows[0].count == 0){
                            for(var i = 0 ; i < data.content.length ; i++ ){
                                trans.executeSql("insert into diagnosis(_id, name, duration, type) values(?, ?, ?, ?)",[data.content[i]._id, data.content[i].name, data.content[i].duration, data.content[i].type],function(trans, result){
                                    console.log("insert success!");
                                },function(trans, message){
                                    console.error("insert error!",message);
                                });
                            }
                        }
                        NProgress.done();
                    });

                }, function (trans, message) {
                    console.error("create table error!",message);
                });

                //trans.executeSql("drop table diagnosis"); //删除数据库表

            });

        }
    });
});
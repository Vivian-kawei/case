/**
 * Created by accurme on 2017/1/8.
 */
(function() {

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
     * @param dbName 数据库名称
     * @param version 整数型
     * @param options 回调函数
     */
    function openDB(dbName, version, options) {

        version = version || 1;
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        if(window.indexedDB){

            var request = window.indexedDB.open(dbName, version);

            request.onerror = function(e){
                console.log(e.currentTarget.error.message);
            };

            request.onsuccess=function(e){
                var db = e.target.result;
                typeof options.success === 'function' ? options.success(db) : undefined;
            };

            request.onupgradeneeded=function(e){
                var db = e.target.result;
                typeof options.upgrade === 'function' ? options.upgrade(db) : undefined;
                console.log('版本更新：' + version);
            };

        }else {
            alert("您的浏览器不支持HTML5本地数据库");
        }
    }

    $(document).ready( function() {

        NProgress.start(); //页面开始加载

        var dbName = "params";
        var storeName = "diagnosis";
        var field = ["_id", "name", "duration"];

        getJson(rootPath + "/json/case_diagnosis.json", function(data){

            openDB(dbName, data.version, {

                success : function(db){


                    setTimeout(function(){

                        var transaction = db.transaction(storeName, 'readwrite');
                        var store = transaction.objectStore(storeName);

                        for(var i = 0 ; i < data.content.length ; i++){
                            store.add(data.content[i]);
                        }

                        console.log(store.getAll())

                    },1000);



                    //window.closeDB =  window.closeDB || window.mozCloseDB || window.webkitCloseDB || window.msCloseDB;
                    //closeDB(db);

                    NProgress.done();
                },

                upgrade : function(db){ //如果版本更新，会先执行这个方法，再执行success

                    console.log(data.version, db);

                    if(!db.objectStoreNames.contains(storeName)){
                        db.createObjectStore(storeName, {keyPath:"_id"});
                    }else{


                    }
                }

            })
        });
    });

})();
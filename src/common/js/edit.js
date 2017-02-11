const EditorState = require("prosemirror-state").EditorState;
const EditorView = require("prosemirror-view").EditorView;
const schema = require("prosemirror-schema-basic").schema;
const exampleSetup = require("prosemirror-example-setup").exampleSetup;
const {Schema, DOMParser, DOMSerializer} = require("prosemirror-model");
const {InputRule, inputRules} = require("prosemirror-inputrules");
const Vue = require("vue");

module.exports = (function(){

    const style = document.createElement("style");
    style.textContent = `

        .lore {
            border: none;
            background: none;
            font-size: 16px;
            color: blue;
        }

    `;

    document.querySelector("head").appendChild(style);

    const lore = {
        attrs: {
            value: {},
            data: {}
        },
        toDOM: node => ["input", {
            class: "lore",
            type: "button",
            value: node.attrs.value,
            data: node.attrs.data
        }],
        parseDOM: [{
            tag: "input[type='button'].lore",
            getAttrs: dom => {
                return {
                    value : dom.getAttribute("value"),
                    data : dom.getAttribute("data")
                }
            }
        }],
        inline: true,
        group: "inline"
    };

    const loreSchema = new Schema({
        nodes: schema.nodeSpec.addBefore("image", "lore", lore),
        marks: schema.markSpec
    });

    const loreType = loreSchema.nodes.lore;

    const loreInputRule = new InputRule(new RegExp("\\【([\\w]|[\\u4E00-\\u9FA5])+\\】"), (state, match, start, end) => {
        vue.currInput = null;
        let text = match[0].substring(1,match[0].length - 1);
        let loreNode = loreType.createAndFill({value:text,data:"_"});
        return state.tr.replaceWith(start, end, loreNode);
    });

    const dataBase = openDatabase("params", "1.0", "诊断数据", 20 * 1024); // 20MB
    let searchFontCount = 1;

    const loreSearchRule = new InputRule(new RegExp("([\\w]|[\\u4E00-\\u9FA5])+"), (state, match, start, end) => {

        let text = match.input.substring(match.input.length - searchFontCount,match.input.length);

        if(dataBase){

            dataBase.transaction( trans => {
                trans.executeSql("select * from diagnosis where name like '" + text + "%' ",[],function(trans, result){
                    if(result.rows.length > 0){
                        let coords = currEditor.coordsAtPos(state.selection.from);
                        let list = [...result.rows];
                        vue.currInput = {
                            position : {
                                top: coords.top,
                                left: coords.left,
                                right: coords.right,
                                bottom: coords.bottom
                            },
                            list : list,
                            active : list[0],
                            state : state,
                            type : loreType,
                            start : end - searchFontCount + 1,
                            end : end
                        };
                        searchFontCount++;
                    }
                },(trans, error) => {
                    console.log(error);
                });
            });

        }else{
            alert("您的浏览器不支持HTML5本地数据库");
        }

    });

    let createEditor = window.createEditor = function(id, html, $parent){
        let el = document.getElementById(id);
        let content = document.createElement("div");
        el.innerHTML = "";
        content.innerHTML = html;
        let view = window['$'+id] = new EditorView(el, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(loreSchema).parse(content),
                plugins: exampleSetup({schema: loreSchema}).concat(inputRules({rules: [loreInputRule,loreSearchRule]}))
            }),
            onAction: action => view.updateState(view.state.applyAction(action)),
            onFocus : function(){
                window.currEditor = window['$'+id];
            },
            onBlur : function(view){
                var $content = DOMSerializer.fromSchema(loreSchema).serializeFragment(view.state.doc.content);
                var contentDom = document.createElement("div");
                contentDom.appendChild($content);
                Vue.set($parent.cse, id, contentDom.innerHTML);
            },
            handleClick : function(){
                refresh();
            }
        });


        function refresh(){
            searchFontCount = 1;
            vue.currInput = null;
        }

        function handleKeydown(e){
            e = e || window.event;
            let keyCode = [9, 38, 40];
            if(vue.currInput && keyCode.indexOf(e.keyCode) > -1){
                e.preventDefault();
                e.stopPropagation();
                let self = vue.currInput;
                let index = self.list.indexOf(self.active);
                switch(e.keyCode) {
                    case 38 :
                        if(index <= 0){
                            index = self.list.length - 1;
                        }else{
                            index--
                        }
                        break;
                    case 40 :
                        if(index >= self.list.length - 1){
                            index = 0;
                        }else{
                            index++
                        }
                        break;
                    case 9 :
                        let loreNode = loreType.createAndFill({value: self.active.name, data: self.active._id});
                        currEditor.props.onAction(self.state.tr.replaceWith(self.start, self.end, loreNode).action());
                        refresh();
                        break
                }
                self.active = self.list[index];
            }else if(vue.currInput && (e.keyCode == 8 || e.keyCode == 27)){
                refresh();
            }
        }

        document.querySelector("#container").onkeydown = handleKeydown;
    };

    return createEditor;

})();

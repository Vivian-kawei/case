<template>
    <div class="section">
        <div class="type">{{type}}：</div>
        <div :id="id" class="editor"></div>
    </div>
</template>

<script>
import createEditor from './../../../common/js/edit';
export default{
    props: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        data: {
            type: String
        }
    },
    mounted: function() {
        var self = this;
        // console.log(self.id, createEditor);
        createEditor(self.id, '', self.$parent);
    }
};
</script>

<style>
/***** editor *****/
.editor {
    width: 100%;
    resize: none;
    font-size: 16px;
    padding-bottom: 10px;
}

textarea.editor {
    border: 1px solid #ddd;
}

.ProseMirror {
    min-height: 190px;
    border: 1px solid #ddd;
}
</style>
<template>
    <div class="section">
        <div class="type">{{type}}：</div>
        <textarea :id="id" class="editor" :style="'min-height: ' + height" v-model="text"></textarea>
    </div>
</template>

<script>
export default{
    props: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        height: {
            type: String,
            default: '150px'
        },
        data: {
            type: String
        }
    },
    data() {
        return { text: this.data };
    },
    watch: {
        text(val) {
            var self = this;
            console.log(val);
            if (self.val) {
                self.data[self.id] = val;
            }
        },
        data(val) {
            this.text = val;
        }
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

.ProseMirror-content {
    min-height: 190px;
    border: 1px solid #ddd;
}
</style>
<template>
    <div :id="id" class="selector" :style="getPosition()">
        <div :class="getClass(item)" v-for="item in data.list" @mouseover="changeAcitve(item)" @click="submit">{{item.name}}</div>
    </div>
</template>

<script>
export default{
    props: {
        id: {
            type: String
        },
        data: {
            type: String
        }
    },
    methods: {
        getClass(item) {
            var self = this;
            return {
                item: true,
                active: self.data.active === item
            };
        },
        getPosition() {
            var self = this;
            var position = self.data.position;
            return {
                top: position.top + 24 + 'px',
                left: position.left + 'px'
            };
        },
        changeAcitve(item) {
            var self = this;
            var data = self.data;
            data.active = item;
        },
        submit() {
            var self = this;
            var data = self.data;
            var loreNode = data.type.createAndFill({value: data.active.name, data: data.active._id});
            window.currEditor.props.onAction(data.state.tr.replaceWith(data.start, data.end, loreNode).action());
            self.$root.currInput = null;
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
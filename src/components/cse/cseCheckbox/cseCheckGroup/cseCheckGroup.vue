<template>
    <div class="warp">
        <p v-if="data.name">{{data.name}}：</p>
            <div class="checkboxs">
                <div class="item" v-for="(item, key) in data.options">
                    <input :id="item.name" :title="item.name" type="checkbox" :value="key" v-model="data.value">
                        <label :for="item.name" :title="item.name">{{item.name}}</label>
                </div>
                <div class="item other" @keydown.enter="add">
                    <input type="checkbox" value="其他" v-model="form.checkbox">
                    <input type="text" autocomplete="off" v-model="form.value" placeholder="其他，回车确认添加">
                 </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            form: {
                id: 'new',
                checkbox: false,
                value: ''
            }
        };
    },
    methods: {
        add: function() {
            var self = this;
            var form = self.form;
            if (form.value) {
                var id = parseInt(Math.random() * 25) + '';
                self.data.options.push({id: id, name: form.value, isNegative: '0'});
                if (form.checkbox) {
                    self.data.value.push(id);
                }
                self.form = { id: id, checkbox: false, value: '' };
            }
        },
        isString: function(object) {
            return typeof object === 'string';
        }
    }
};
</script>

<style>
/***** checkbox *****/

.checkboxs {
    overflow: hidden;
}

.checkboxs .item {
    width: 33.333%;
    height: 26px;
    line-height: 26px;
    float: left;
    margin-bottom: 10px;
    padding-right: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}

.checkboxs .item input[type='checkbox'] {
    margin-right: 10px;
}

.checkboxs .other input[type='checkbox'] {
    margin-right: 9px;
}

.checkboxs .other input[type='text'] {
    width: 190px;
    height: 25px;
    border: 1px solid #ddd;
    font-size: 14px;
}

.checkboxs.groups{
    padding-left: 15px;
    list-style-type: none;
}

.checkboxs.groups p {
    margin-bottom: 10px;
}

.checkboxs .checkboxs {
    padding-left: 15px;
}
</style>
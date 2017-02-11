<template>
    <div class="section">
        <div :id="id" class="form">
            <div class="group" v-for="(item, key) in data">
                <label :for="key">{{item.name}}</label>
                <input v-if="!item.options" :id="key" type="text" autocomplete="off" v-model="item.value" @keyup="rule(item)">
                <div class="right" v-if="item.unit">{{item.unit}}</div>
                <select v-if="item.options" :id="key" v-model="item.value">
                    <option v-for="option in item.options" :value="option.value || option.name">{{option.name}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        id: {
            type: String
        },
        data: {
            type: Object
        }
    },
    methods: {
        rule(item) {
            if (item.rule === 'integer') {
                item.value = item.value.replace(/[^0-9]/g, '');
            }
            if (item.rule === 'float') {
                item.value = item.value.replace(/[^0-9^.]/g, '');
            }
        }
    }
};
</script>

<style>
/***** info *****/
.form {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.form .group {
    width: 50%;
    height: 30px;
    float: left;
    margin: 10px 0;
    padding-right: 10px;
    position: relative;
}

.form .group label {
    margin-right: 5px;
    display: inline-block;
    line-height: 30px;
}

.form .group label:after {
    content: "：";
}

.form .group input {
    width: 65%;
    height: 30px;
    font-size: 16px;
    padding: 0 10px;
    background: white;
    border: 1px solid #ddd;
}

.form .group .right + input {
    padding: 0 30px 0 10px;
}

.form .group .right {
    padding: 0 7px;
    line-height: 30px;
    text-align: center;
    cursor: default;
    position: absolute;
    top: 0;
    right: 44px;
}

.form select {
    width: 220px;
    height: 30px;
    border: 1px solid #ddd;
    padding: 0 5px;
    font-size: 14px;
}



</style>
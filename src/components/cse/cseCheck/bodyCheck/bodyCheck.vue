<template>
    <ul class="check group">
        <li v-for="item in data" v-if="!subCategory || (item.subCategory && item.subCategory == subCategory)">
            <span class="label">{{item.name}}：</span>
            <span class="options">
                <span class="option" v-for="(option, id) in item.options">

                    <br v-if="item.options && isLong(item.options)" />
                    <span style="margin-left: 15px;" v-if="item.options && isLong(item.options)" ></span>
                                
                    <input :id="getId([category,subCategory,item.name,id,option.name])" v-if="isBoolean(item.isMultiple) && !item.isMultiple" type="radio" :value="id" v-model="item.value[0]">
                    <input :id="getId([category,subCategory,item.name,id,option.name])" v-if="!isBoolean(item.isMultiple) || item.isMultiple" type="checkbox" :value="id" v-model="item.value">
                    <label :for="getId([category,subCategory,item.name,id,option.name])">{{option.name}}</label>

                    <span class="describe" v-if="option.descriptions && item.value.indexOf(id) > -1">
                        <span>（</span>
                        <span style="margin: 0 5px;">
                            <span v-if="isArray(option.descriptions.name)" v-for="(name, j) in option.descriptions.name">
                                <label :for="getId([category,subCategory,item.name,id,name])" style="margin-right: 2px;">{{name}}</label>
                                <input :id="getId([category,subCategory,item.name,id,name])" v-if="isArray(option.descriptions.description)" type="text" autocomplete="off" v-model="option.descriptions.description[j]" style="width: 70px;margin-right: 5px">
                                <span v-if="isArray(option.descriptions.unit) && isString(option.descriptions.unit[j])">{{option.descriptions.unit[j]}}</span>
                                <span v-if="j < option.descriptions.name.length -1">，</span>
                            </span>
                            <span v-if="isArray(option.descriptions.options)" v-for="(name, j) in option.descriptions.options">
                                <input :id="getId([category,subCategory,item.name,id,name])" v-if="isBoolean(option.descriptions.isMultiple) && !option.descriptions.isMultiple" type="radio" :value="name" v-model="option.descriptions.description[0]">
                                <input :id="getId([category,subCategory,item.name,id,name])" v-if="!isBoolean(option.descriptions.isMultiple) || option.descriptions.isMultiple" type="checkbox" :value="name" v-model="option.descriptions.description">
                                <label :for="getId([category,subCategory,item.name,id,name])" style="margin-right: 2px;">{{name}}</label>
                                <span v-if="j < option.descriptions.options.length -1" style="margin-left: 10px;"></span>
                            </span>
                        </span>
                        <span>）</span>
                    </span>
                </span>
            </span>
        </li>
    </ul>
</template>

<script>
import cseCheckGroup from 'components/cse/cseCheckbox/cseCheckGroup/cseCheckGroup.vue';
export default{
    props: {
        category: {
            type: String
        },
        subCategory: {
            type: String
        },
        data: {
            type: Object
        }
    },
    methods: {
       isArray(object) {
            return Array.isArray(object);
        },
        isBoolean(object) {
            return typeof object === 'boolean';
        },
        isString(object) {
            return typeof object === 'string';
        },
        getId(strs) {
            var str = '';
            for (var i = 0; this.isArray(strs) && i < strs.length; i++) {
                if (strs[i]) {
                    if (i === 0) {
                        str += strs[i];
                    } else {
                        str += '-' + strs[i];
                    }
                }
            }
            return str;
        },
        isLong(obj) {
            var count = 0;
            if (obj) {
                for (var i in obj) {
                    var temp = obj[i];
                    if (temp.descriptions) {
                        count++;
                    }
                }
            }
            return count > 2;
        }
    },
    components: {
      'v-cseCheckGroup': cseCheckGroup
    }
};
</script>

<style>
</style>
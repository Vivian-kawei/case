<template>
    <div class="section"  v-if="group.active">
        <div :id="id" class="check wrap">
            <div v-if="group.category" class="title">{{group.category}}<i class="close fa fa-times" aria-hidden="true" @click="close(group)"></i></div>

                <v-bodyCheck v-if="id === 'bodyCheck' && !group.subCategory" v-bind:data="group.items" v-bind:category="group.category"></v-bodyCheck>
                       
                <ul class="check group" v-if="id == 'bodyCheck' && group.subCategory">
                    <li v-for="name in subGroup">
                        <span class="label">{{name}}：</span>
                        <v-bodyCheck :data="group.items" :category="group.category" :sub-category="name"></v-bodyCheck>
                    </li>
                </ul>

                <v-labExam v-if="id === 'labExam'" :data="group.items"></v-labExam>

                <v-imgExam v-if="id == 'imgExam'" :data="group"></v-imgExam>

        </div>
    </div>
</template>

<script>
import bodyCheck from 'components/cse/cseCheck/bodyCheck/bodyCheck.vue';
import labExam from 'components/cse/cseCheck/labExam/labExam.vue';
import imgExam from 'components/cse/cseCheck/imgExam/imgExam.vue';
export default{
    props: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        group: {
            type: Object
        }
    },
    data() {
        return {
            subGroup: ['视诊', '触诊', '叩诊', '听诊']
        };
    },
    methods: {
        close: function(item) {
            item.active = false;
        }
    },
    components: {
      'v-bodyCheck': bodyCheck,
      'v-labExam': labExam,
      'v-imgExam': imgExam
    }
};
</script>

<style>
/***** check *****/

.check.wrap {
    margin-bottom: 15px;
}

.check.wrap:last-child {
    margin: 0;
}

.check .title {
    line-height: 30px;
    background: #eee;
    padding: 0 15px;
    margin-bottom: 10px;
    font-size: 14px;
}

.check .close {
    float: right;
    line-height: 30px;
    opacity: 0.5;
    cursor: pointer;
}

.check .close:hover {
    opacity: 0.8;
}

.check .group {
    font-size: 14px;
    line-height: 30px;
    padding: 0 15px;
}

.check .group li{
    list-style-type: none;
}

.check .group input[type='text'] {
    border: none;
    border-bottom: 1px solid #ddd;
    padding: 0 5px;
}

.check .option {
    margin: 0 10px;
}

.check input[type='radio'] ,
.check input[type='checkbox'] {
    vertical-align: -2px;
    margin-right: 2px;
}

.check.table {
    width: 100%;
    margin-top: 10px;
}

.check.table th ,
.check.table td {
    border: 1px solid #e6e6e6;
    font-size: 14px;
    padding: 5px;
}

.check.table input[type='text'] {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
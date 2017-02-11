<template>
    <div class="section">
        <div class="type" :id="id">{{type}}：</div>
        <v-cseCheckGroup v-if="data && isArray(data.value)" :data="data"></v-cseCheckGroup>
        <ul v-if="data && !isArray(data.value)" class="checkboxs groups">
            <li v-for="group in data">
                <v-cseCheckGroup :data="group"></v-cseCheckGroup>             
            </li>
         </ul>
    </div>
</template>

<script>
import cseCheckGroup from 'components/cse/cseCheckbox/cseCheckGroup/cseCheckGroup.vue';
export default{
    props: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        data: {
            type: [Array, Object]
        }
    },
    methods: {
        isArray: function(object) {
            return Array.isArray(object);
        }
    },
    components: {
      'v-cseCheckGroup': cseCheckGroup
    }
};
</script>

<style>
.wrap .title{
    text-align: left;
}

</style>
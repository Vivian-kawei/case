<template>
    <div class="plans">
        <div class="plans-warp">
            <div class="plan" v-for="plan in data">
                <div class="plan-title">
                    {{plan.name}}
                    <i class="add fa fa-plus" aria-hidden="true" @click="addGroup(plan)"></i>
                </div>
                <div class="period" v-for="period in plan.periods">
                    <div class="period-title" v-text="period.name"></div>
                    <v-planTable :period="period" :data="period.items"></v-planTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import planTable from 'components/model/plans/planTable/planTable.vue';
export default{
    props: {
        data: {
            type: Array
        }
    },
    methods: {
        addGroup(plan) {
            var self = this;
            /* eslint-disable no-undef */
            var groupName = prompt('请输入新增组名称');
            if (groupName != null) {
                this.$http.post('/addPeriod', {planId: plan.id, name: groupName}).then(function(response) {
                    plan.periods.push({
                        'id': response.data.result.id,
                        'planId': self.data.id,
                        'name': groupName,
                        'items': []
                    });
                    /* eslint-disable no-undef */
                    alert('添加成功');
                });
            } else {
                self.form.periodId.value = '';
                /* eslint-disable no-undef */
                alert('新增分组失败...');
            }
        }
    },
    components: {
        'v-planTable': planTable
  }
};
</script>

<style>
/***** plan *****/
.plan {
    margin-bottom: 30px;
}

.plans {
    margin-top: 10px;
}


.plans .plan-title {
    line-height: 30px;
    background: #eee;
    padding: 0 15px;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
}

.plans .plan-title .add {
    float: right;
    line-height: 30px;
    opacity: 0.5;
    cursor: pointer;
}

.plans .plan-title .add:hover {
    opacity: 0.8;
}

.plans .period {
    margin-bottom: 20px;
}

.plans .period-title{
    font-size: 14px;
    margin-top: 10px;
}

.plans .period .link {
    color: #2299dd;
}

.plans .period .link:hover {
    color: #1d81bb;
    cursor: pointer;
}

.plans .period .period-table td {
    padding: 5px;
    position: relative;
    max-width: 160px;
}

.plans .period td input {
    width: 40px;
    height: 100%;
    border: none;
    background: transparent;
}

.plans .period td select {
    width: 100%;
    height: 100%;
    border: none;
}

.plans .period td .drug {
    width: 150px;
    height: 100%;
}

.plans .period .inline-text {
    width: 100%;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.plans .period td .drug span.placeholder {
    color: #aaa;
}

.plans .period .drug-search {
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    border: 1px solid #ddd;
    background: white;
    z-index: 10;
}

.plans .period .drug-search .search-input {
    width: 100%;
    height: 31px;
    padding: 0 5px;
}

.plans .period .drug-search .search-result {
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-height: 192px;
    border-top: 1px solid #eee;
}

.plans .period .drug-search .search-item {
    line-height: 26px;
    text-align: left;
    padding: 0 5px;
}

.plans .period .drug-search .search-item:hover {
    cursor: pointer;
    background: #eee;
}


</style>
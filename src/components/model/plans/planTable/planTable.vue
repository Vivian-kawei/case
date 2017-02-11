<template>
    <table class="period-table">
        <thead>
            <tr>
                <th v-for="th in head" v-text="th"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in data">
                <td v-for="td in body">
                    <p class="inline-text">
                        <span v-if="td != 'delete'" :title="item[td]" v-text="item[td]"></span>
                        <span v-if="td == 'delete'"><a class="link">删除</a></span>
                    </p>
                </td>
            </tr>
            <tr>
                <td v-for="(item, key) in form">
                    <!--药品-->
                    <div v-if="item.type == 'search'" class="drug">
                        <p class="inline-text" @click="showSearch">
                            <span v-show="item.value" v-text="item.value"></span>
                            <span v-show="!item.value" class="placeholder" title="请输入药品名称或拼音首字母..">请输入药品名称或拼音首字母..</span>
                        </p>
                        <div class="drug-search" v-show="search.active" @click.stop>
                            <input class="search-input" type="text" autocomplete="off" v-model="search.input" autofocus>
                            <div class="search-result" v-show="search.result.length > 0">
                                <div class="search-item" v-for="item in search.result" @click="selectDrug($event, item)" :title="item.name + '(' + item.strength + ')'">{{item.name}}({{item.strength}})</div>
                            </div>
                        </div>
                    </div>

                    <!--下拉框-->
                    <select :class="key" v-if="item.type == 'select'" v-model="item.value">
                        <option v-for="option in item.options" :value="option" v-text="option"></option>
                    </select>

                    <!--输入框-->
                    <input :class="key" v-if="item.type == 'text'" type="text" :placeholder="item.name" autocomplete="off" v-model="item.value">
                </td>
                <td>
                    <span><a class="link" @click="save">保存</a></span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default{
    props: {
        data: {
            type: Array
        },
        period: {
            type: Object
        }
    },
    data() {
        return {
            head: ['药品名称', '用法', '剂量', '单位', '频次', '备注', '操作'],
            body: ['drugName', 'usage', 'dosage', 'unit', 'frequency', 'notes', 'delete'],
            form: {
                drugName: {name: '药品', type: 'search', value: ''},
                usage: {name: '用法', type: 'select', value: '', options: ['po(口服)', 'ivdrip(静脉滴注)', 'im(肌肉注射)', 'iv(静脉注射)', 'ih(皮下注射)', 'ip(腹腔注射)']},
                dosage: {name: '剂量', type: 'text', value: ''},
                unit: {name: '单位', type: 'select', value: '', options: ['g', 'mg', 'μg', 'U', '万U', 'MU', 'ml']},
                frequency: {name: '频次', type: 'select', value: '', options: ['qd(每日一次)', 'bid(每日两次)', 'tid(每日三次)', 'qod(隔日一次)', 'qw(每周一次)', 'biw(每周两次)', 'tiw(每周三次)', 'qow(隔周一次)', '2w(每两周一次)', '3w(每三周一次)', '4w(每四周一次)', 'q1/2h(30分钟一次)', 'qh(每小时一次)', 'q2h(二小时一次)', 'q3h(三小时一次)', 'q4h(四小时一次)', 'q6h(六小时一次)', 'q8h(八小时一次)', 'q12h(12小时一次)']},
                notes: {name: '备注', type: 'text', value: ''}
            },
            currDrug: null,
            search: {
                active: false,
                input: '',
                result: []
            }
        };
    },
    methods: {
        showSearch(e) {
            var self = this;
            self.search.active = true;
            setTimeout(function () {
                var input = e.target.parentNode;
                if (input.className !== 'drug') {
                    input = input.parentNode;
                }
                input = input.querySelector('input.search-input');
                input.focus();
                document.onclick = function (e) {
                    self.search.active = false;
                    self.search.input = '';
                    document.onclick = undefined;
                };
            }, 20);
            if (self.form.drugName.value) {
                self.search.input = self.form.drugName.value;
            }
        },
        selectDrug(e, item) {
            var self = this;
            self.currDrug = item;
            self.form.drugName.value = item.name;
            self.form.unit.value = item.unit;
            self.search.active = false;
            self.search.input = '';
            document.onclick = undefined;
        },
        save() {
            var self = this;
            var flag = true;
            var form = {};
            for (var key in self.form) {
                var temp = self.form[key];
                if (!temp.value) {
                    flag = false;
                } else {
                    form[key] = temp.value;
                }
            }
            if (flag) {
                form.drugId = self.currDrug.id;
                form.periodId = self.period.id;
                this.$http.post('/addDrug', {data: form}).then(function(response) {
                     self.period.items.push(form);
                        for (var key in self.form) {
                            var temp = self.form[key];
                            temp.value = '';
                        }
                });
                 console.log();
            } else {
                /* eslint-disable no-undef */
                alert('表单填写不完整');
            }
        }
    }
};
</script>

<style>
</style>
<template>
  <div class='model'>
    <div class="container" id="container">
      <div class='title'>患者病例模型<span>（{{modelData.modelName}}）</span></div>
        <div class='group'>
          <p class='group-title'>基本信息：</p>
          <v-modelTable v-if='modelData.case' v-bind:data='modelData.case' v-bind:head='head[0]' v-bind:body='body[0]'></v-modelTable>
        </div>
        <div class='group'>
          <p class='group-title'>症状、体征、家族史、个人史和过敏史：</p>
          <v-modelTable v-if='modelData.symptomsData' v-bind:data='allSymptoms' :head='head[1]' :body='body[1]' title='症状' class='fixed' ></v-modelTable>
          <v-modelTable v-if='modelData.bodyCheckData' v-bind:data='allBodyCheck' :head='head[1]' :body='body[1]' title='体格检查' class='fixed' ></v-modelTable>
          <v-modelTable v-if='modelData.familyData' v-bind:data='modelData.familyData' :head='head[1]' :body='body[1]' title='家族史' class='fixed'></v-modelTable>
          <v-modelTable v-if='modelData.personData' v-bind:data='modelData.personData' :head='head[1]' :body='body[1]' title='个人史' class='fixed' ></v-modelTable>
          <v-modelTable v-if='modelData.medicineData' v-bind:data='modelData.medicineData' :head='head[1]' :body='body[1]' title='过敏史' class='fixed' ></v-modelTable>
        </div>
        <div class='group'>
          <p class='group-title'>辅助检查：</p>
          <v-modelTable v-if='modelData.labExamData && isArray(group.items) && group.items.length > 0' v-for='group in allLabExam' v-bind:data='group.items' :head='head[2]' :body='body[2]' :title='group.category' class='lab-exam'></v-modelTable>  
        </div>
        <div class='group'>
          <p class='group-title'>初步诊断：</p>
          <v-modelTable v-if='isArray(modelData.diagnosisData) && modelData.diagnosisData.length > 0' :data='allDiagnosisData' :head='head[4]' :body='body[4]' class='fixed'></v-modelTable>              
        </div>
        <div class='group'>
          <p class='group-title'>药物治疗方案：</p>
          <v-plans v-if='isArray(modelData.drugPlans) && modelData.drugPlans.length > 0' :data='modelData.drugPlans'></v-plans>
        </div>
        <div class="btns">
          <button type="button" @click="save">保存</button>
        </div> 
    </div> 
  </div>
</template>

<script>
import modelTable from 'components/model/modelTable/modelTable.vue';
import plans from 'components/model/plans/plans.vue';
import Vue from 'vue';
export default {
  data() {
    return {
      modelData: {},
      caseData: {},
      head: [
                ['项目', '结果', '模型适用范围', '模型必要条件'],
                ['?', '模型必要条件'],
                ['? : yyyy-mm-dd', '结果', '模型适用范围', '单位'],
                ['? : yyyy-mm-dd', '结果', '模型必要条件'],
                ['病名', '患病时长（年）', '模型适用范围（年）', '模型必要条件']
            ],
      body: [
                ['name', 'text', 'range', 'require'],
                ['name', 'require'],
                ['name', 'value', 'range', 'unit'],
                ['title', 'name', 'require'],
                ['name', 'duration', 'range', 'require']
            ]
    };
  },
  created() {
    const self = this;
    // 获取浏览器id
    // let id = window.location.hash && window.location.hash.substring(1, window.location.hash.length);
    // id = id.replace(/\//g, '');
    let id = self.$route.params.id;
    console.log('id', id);
    this.$http.get('static/json/data.json').then((response) => {
      self.caseData = response.data;
      console.log(111, self.caseData);
      this.$http.post('/getCase', {id: id, withDrugPlans: true}).then(function(response) {
        if (!response.data.result.errcode) {
          var result = response.data.result;

          if (!result.errcode) {
            result.case = {
              gender: Object.assign(result.gender, {text: result.gender.original === 1 ? '男' : '女', name: '性别', radio: [{value: 1, name: '男'}, {value: 2, name: '女'}, {value: 0, name: '不限'}]}),
              age: Object.assign(result.age, {text: result.age.value + '岁', name: '年龄', hasRange: true, disable: true, isRequired: true}),
              maritalStatus: Object.assign(result.maritalStatus, {text: result.maritalStatus.value, name: '婚姻'}),
              birthPlace: Object.assign(result.birthPlace, {text: result.birthPlace.value, name: '出生地'}),
              ethnicGroup: Object.assign(result.ethnicGroup, {text: result.ethnicGroup.value, name: '民族'}),
              occupation: Object.assign(result.occupation, {text: result.occupation.value, name: '职业'}),
              weight: {value: result.weight, text: result.weight + 'kg', name: '体重'},
              height: {value: result.height, text: result.height + 'cm', name: '身高'},
              waistline: {value: result.waistline, text: result.waistline + 'cm', name: '臀围'},
              hipline: {value: result.hipline, text: result.hipline + 'cm', name: '腰围'},
              bmi: Object.assign(result.bmi, {text: result.bmi.value.toFixed(2), name: '体质指数(BMI)', hasRange: true, disable: true, isRequired: true}),
              lol: Object.assign(result.lol, {text: result.lol.value.toFixed(2), name: '综合肥胖指数', hasRange: true, disable: true, isRequired: true}),
              bp: Object.assign(result.bp, {text: result.bp.sbp + 'mmHg / ' + result.bp.dbp + 'mmHg', name: '血压', hasRange: true}),
              heartRate: Object.assign(result.heartRate, {text: result.heartRate.value, name: '心率', hasRange: true})
            };
            console.log(333, result.case);
          }
          self.modelData = result;
          console.log(222, self.modelData);
          console.log(444, self.modelData.case);
        } else {
          /* eslint-disable no-undef */
          alert(response.data.result.errmsg);
        }
      });
    });
  },
  computed: {
    allSymptoms() {
      var array = [];
      var self = this;
      for (var key in self.modelData.symptomsData) {
        var temp = self.modelData.symptomsData[key];
        if (Array.isArray(temp)) {
          for (var key2 in temp) {
            var temp2 = temp[key2];
            if (temp2.isNegative) { // 过滤异常
              array.push(temp2);
            }
          }
        }
      }
      return array;
    },
    allBodyCheck() {
      var array = [];
      var self = this;
      for (var key in self.modelData.bodyCheckData) {
        var group = self.modelData.bodyCheckData[key];
        if (group.active && group.items) {
          for (var key2 in group.items) {
            var items = group.items[key2];
            for (var key3 in items) {
              var item = items[key3];
              if (item.isNegative) { // 过滤异常
                array.push(item);
              }
            }
          }
        }
      }
      return array;
    },
    allLabExam() {
      var array = [];
      var self = this;
      if (self.modelData.labExamData) {
        for (var key in self.modelData.labExamData) {
          var group = self.modelData.labExamData[key];
          var temp = self.caseData.labExamData[key];
          var category = {category: temp.category, items: []};
          for (var key2 in group.items) {
            var item = group.items[key2];
            if (item.value) {
              Vue.set(item, 'hasRange', true);
              category.items.push(item);
            }
          }
          array.push(category);
        }
      }
      return array;
    },
    allDiagnosisData() {
      var self = this;
      return self.modelData.diagnosisData.map(function(item) {
      if (item.duration) {
        Vue.set(item, 'hasRange', true);
        item.isRequired = true;
        item.disable = true;
      }
      return item;
      });
    }
  },
  methods: {
    isArray(obj) {
      return Array.isArray(obj);
    },
    save() {
      var self = this;
      /* eslint-disable no-unused-vars */
      var save = function(modelName) {
        console.log(JSON.stringify(self.modelData));
        self.$http.post('/saveCase', {caseId: self.modelData.id, caseData: JSON.stringify(self.modelData)}).then(function(response) {
            var result = response.data.result;
            if (!result.errcode) {
              alert('“' + modelName + '”修改成功！');
                window.location.reload();
            } else {
              alert(result.errmsg);
            }
        });
      };
      if (self.modelData.modelName) {
        save(self.modelData.modelName);
      } else {
      var modelName = prompt('请输入模型名称');
        if (modelName !== null) {
          self.modelData.modelName = modelName;
          save(modelName);
        }
      }
    }
  },
  components: {
    'v-modelTable': modelTable,
    'v-plans': plans
  }
};
</script>

<style>
/***** group ****/
.group .group-title {
    margin-top: 20px;
    font-weight: bold;
}
/***** button *****/
.btns {
    text-align: center;
    border-top: 1px solid #ddd;
    margin-top: 30px;
    padding: 40px 0 20px 0;
}

.btns button {
    width: 80px;
    height: 30px;
}
</style>
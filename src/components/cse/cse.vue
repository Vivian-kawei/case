<template>
<div class="case">
  <div class="container" id="container">
    <div class="title">患者病例模板</div>
    <v-selector v-if="$root.currInput" v-bind:data="$root.currInput"></v-selector>
    <v-bar v-bind:csebar="cse"></v-bar>
    <v-cseForm v-bind:data="cse.patientData" id="patientData" ref="patientData"></v-cseForm>
    <v-cseEditor v-bind:data="cse.complainData"id="complainData" type="主诉" ref="complainData"></v-cseEditor>
    <v-cseEditor v-bind:data="cse.presentData" id="presentData" type="现病史" ref="presentData"></v-cseEditor>
    <v-cseEditor v-bind:data="cse.pastData" id="past" type="既往史" ref="pastData"></v-cseEditor>
    <v-cseCheckbox v-bind:data="cse.personData" id="personData" type="个人史" ref="personData"></v-cseCheckbox>
    <v-cseArea v-bind:data="cse.maritalHistoryData" id="maritalHistoryData" type="婚育史" ></v-cseArea>
    <v-cseCheckbox v-bind:data="cse.familyData" id="familyData" type="家族史" ref="familyData"></v-cseCheckbox>
    <v-cseCheckbox v-bind:data="cse.medicineData" id="medicineData" type="药物过敏史" ref="medicineData"></v-cseCheckbox>
    <v-cseCheckbox v-bind:data="cse.symptomsData" id="symptomsData" type="临床症状" ref="symptomsData"></v-cseCheckbox>
    <v-cseForm v-bind:data="cse.baseConditionData" id="baseConditionData" ref="baseConditionData"></v-cseForm>
    <v-cseForm v-bind:data="cse.extendConditionData" id="extendConditionData" ref="extendConditionData"></v-cseForm>
    <p class="line-title">体格检查</p>
    <v-cseCheck id="bodyCheck" type="体格检查" v-for="group in cse.bodyCheckData" v-bind:group="group" ref="bodyCheck"></v-cseCheck>
    <p class="line-title">实验室检查</p>
    <v-cseCheck id="labExam" type="实验室检查" v-for="group in cse.labExamData" :group="group" ref="labExam"></v-cseCheck>
    <p class="line-title">影像学检查</p>
    <v-cseCheck id="imgExam" type="影像学检查" v-for="group in cse.imgExamData" :group="group" ref="imgExam"></v-cseCheck>
    <v-cseDiagnosis v-bind:data="cse.diagnosisData" id="diagnosisData" v-bind:type="'初步检查'" ref="diagnosisData"></v-cseDiagnosis>
    <v-btns v-bind:caseid="caseId" :data="cse"></v-btns>
  </div>
</div>
</template>

<script>
import selector from 'components/cse/selector/selector.vue';
import bar from 'components/cse/bar/bar.vue';
import cseForm from 'components/cse/cseForm/cseForm.vue';
import cseEditor from 'components/cse/cseEditor/cseEditor.vue';
import cseArea from 'components/cse/cseEditor/cseArea.vue';
import cseCheckbox from 'components/cse/cseCheckbox/cseCheckbox.vue';
import cseCheck from 'components/cse/cseCheck/cseCheck.vue';
import cseDiagnosis from 'components/cse/cseDiagnosis/cseDiagnosis.vue';
import btns from 'components/cse/saveButton/btns.vue';
export default{
    data() {
        return {
            cse: {
            },
            caseId: ''
        };
    },
    created() {
        const self = this;
        // 获取浏览器id
        // let id = window.location.hash && window.location.hash.substring(1, window.location.hash.length);
        // id = id.replace(/\//g, '');
        let id = self.$route.params.id;
        console.log(id);
        this.$http.get('static/json/data.json').then((response) => {
            self.cse = response.data;

            if (id) {
                this.$http.post('/getCase', {id: id}).then(function(response) {
                    // console.log(response);
                    if (!response.data.result.errcode) {
                        var result = response.data.result;
                        // 病例ID
                        self.caseId = id;
                        // 个人信息
                        for (var key in self.cse.patientData) {
                            var temp = result[key];
                            if (temp) {
                                switch (key) {
                                    case 'gender':
                                        self.cse.patientData[key].value = temp.original;
                                        break;
                                    case 'age':
                                        self.cse.patientData[key].value = temp.value;
                                        break;
                                    case 'maritalStatus':
                                        self.cse.patientData[key].value = temp.value;
                                        break;
                                    case 'birthPlace':
                                        self.cse.patientData[key].value = temp.value;
                                        break;
                                    case 'ethnicGroup':
                                        self.cse.patientData[key].value = temp.value;
                                        break;
                                    case 'occupation':
                                        self.cse.patientData[key].value = temp.value;
                                        break;
                                    default :
                                        self.cse.patientData[key].value = temp;
                                        break;
                                }
                            }
                        }

                        // 主诉
                        self.cse.complainData = result.chiefComplaints || '';
                        // 现病史
                        self.cse.presentData = result.presentIllHis || '';
                        // 既往史
                         self.cse.pastData = result.pastMedHistory || '';
                        // 个人史
                        Array.isArray(result.personData) && result.personData.map(function(item) {
                            self.cse.personData.value.push(item.id);
                             return item;
                        });
                        // 婚育史
                        self.cse.maritalHistoryData = result.maritalHis || '';
                        // 家族史
                        Array.isArray(result.familyData) && result.familyData.map(function(item) {
                            self.cse.familyData.value.push(item.id);
                            return item;
                        });
                        // 药物史
                        Array.isArray(result.medicineData) && result.medicineData.map(function(item) {
                            self.cse.medicineData.value.push(item.id);
                            return item;
                        });
                        // 临床症状
                        if (result.symptomsData) {
                            for (var key in result.symptomsData) {
                                var item = result.symptomsData[key];
                                item.map(function(item2) {
                                    if (self.cse.symptomsData[key]) {
                                        self.cse.symptomsData[key].value.push(item2.id);
                                    }
                                    return item2;
                                });
                            }
                        }
                        // 一般检查
                        for (var key in self.cse.baseConditionData) {
                            var temp = result[key];
                            if (key === 'sbp' || key === 'dbp') {
                                temp = result['bp'];
                            }
                            if (temp) {
                                switch (key) {
                                    case 'heartRate':
                                        self.cse.baseConditionData[key].value = temp.value;
                                        break;
                                    case 'sbp':
                                        self.cse.baseConditionData[key].value = temp[key];
                                        break;
                                    case 'dbp':
                                        self.cse.baseConditionData[key].value = temp[key];
                                        break;
                                    default :
                                        self.cse.baseConditionData[key].value = temp;
                                        break;
                                }
                            }
                        }
                        // 扩展检查
                        for (var key in result.extendConditionData) {
                            var temp = result.extendConditionData[key];
                            self.cse.extendConditionData[key].value = temp.name;
                        }
                        // 体格检查
                        for (var key in result.bodyCheckData) {
                            var temp = result.bodyCheckData[key];
                            var items = self.cse.bodyCheckData[key].items;
                            self.cse.bodyCheckData[key].active = !!temp.active;
                            for (var key2 in temp.items) {
                                var temp2 = temp.items[key2];
                                var item = items[key2];
                                if (temp2 && Array.isArray(temp2)) {
                                    temp2.map(function(option) {
                                        item.value.push(option.id);
                                        if (option.descriptions) {
                                            item.options[option.id].descriptions.description = option.descriptions;
                                        }
                                        return option;
                                    });
                                }
                            }
                        }

                        // 实验室检查
                        for (var key in result.labExamData) {
                            var temp = result.labExamData[key];
                            var item = self.cse.labExamData[key];
                            item.active = !!temp.active;
                            for (var key2 in temp.items) {
                                if (item.items[key2]) {
                                    item.items[key2].value = temp.items[key2].value;
                                }
                            }
                        }
                        // 影像学检查
                        for (var key in result.imgExamData) {
                            var temp = result.imgExamData[key];
                            var item = self.cse.imgExamData[key];
                            item.active = !!temp.active;
                            temp.value.map(function(temp2) {
                                if (item && Array.isArray(item.value)) {
                                   item.value.push(temp2.id);
                                }
                            });
                        }
                        // 初步诊断
                        if (Array.isArray(result.diagnosisData)) {
                            result.diagnosisData.map(function(item) {
                                self.cse.diagnosisData.values.push(item.id);
                                self.cse.diagnosisData.objects.push({_id: item.id, name: item.name, duration: item.duration});
                            });
                        }
                    } else {
                        /* eslint-disable no-undef */
                        alert(response.data.result.errmsg);
                    }
                });
            }
        });
    },
    components: {
      'v-cseForm': cseForm,
      'v-cseEditor': cseEditor,
      'v-cseArea': cseArea,
      'v-cseCheckbox': cseCheckbox,
      'v-cseCheck': cseCheck,
      'v-cseDiagnosis': cseDiagnosis,
      'v-bar': bar,
      'v-selector': selector,
      'v-btns': btns
    }
};
</script>

<style>
 @import "../../common/fonts/font-awesome.css";

/***** section *****/

.section {
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
}

.section:last-child {
    border-bottom: 1px solid transparent;
}

.section .type {
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 10px;
}
/***** header *****/
.header {
    border-bottom: 1px solid #ddd;
}

.header .content {
    overflow: hidden;
    padding: 10px 0;
}

.header .title {
    line-height: 70px;
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
}

.header .float {
    line-height: 26px;
    letter-spacing: 1px;
}

.header .float.left {
    float: left;
}

.header .float.right {
    float: right;
}
/***** hr *****/
.line-title {
    text-align: center;
    font-weight: bold;
    line-height: 40px;
    margin-top: 10px;
    font-size: 18px;
}
/***** button *****/
.btns {
    text-align: center;
    padding-top: 20px;
}

.btns button {
    width: 80px;
    height: 30px;
}
</style>
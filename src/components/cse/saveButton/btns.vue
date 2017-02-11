<template>
    <div class="section">
        <div class="btns">
            <button type="button" @click="save">保存</button>
            <button type="button" v-if="caseid" v-on:click="href('/model')" style="margin-left: 20px;">查看模型</button>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        caseid: {
            type: String
        },
        data: {
            type: Object
        }
    },
    methods: {
         href(url) {
            var self = this;
            if (url && self.caseid) {
                window.location.href = url + '#' + self.caseid;
            }
        },
        save() {
            var self = this;
            var caseData = self.data;
            var saveData = {'bp': {}};
            // 病人信息
            for (var key in caseData.patientData) {
                var value;
                if (caseData.patientData[key].rule || key === 'gender') { // 判断是数字还是字符串
                    value = caseData.patientData[key].value ? parseInt(caseData.patientData[key].value) : 0;
                } else {
                    value = caseData.patientData[key].value;
                }
                switch (key) {
                    case 'gender':
                        saveData[key] = {'original': value};
                        break;
                    case 'age':
                        saveData[key] = {'value': value};
                        break;
                    case 'maritalStatus':
                        saveData[key] = {'value': value};
                        break;
                    case 'birthPlace':
                        saveData[key] = {'value': value};
                        break;
                    case 'ethnicGroup':
                        saveData[key] = {'value': value};
                        break;
                    case 'occupation':
                        saveData[key] = {'value': value};
                        break;
                    default:
                        saveData[key] = value;
                        break;
                }
            }
            // 主诉
            saveData.chiefComplaints = caseData.complainData;
            // 现病史
            saveData.presentIllHis = caseData.presentData;
            // 既往史
            saveData.pastMedHistory = caseData.pastData;
            // 婚育史
            saveData.maritalHis = caseData.maritalHistoryData;
            // 个人史
            saveData.personData = caseData.personData.value.map(function(id) {
                var option = caseData.personData.options[id];
                return {id: id, name: option.name, isNegative: !!option.isNegative};
            });
            // 家族史
            saveData.familyData = caseData.familyData.value.map(function(id) {
                var option = caseData.familyData.options[id];
                return {id: id, name: option.name, isNegative: !!option.isNegative};
            });
            // 药物史
            saveData.medicineData = caseData.medicineData.value.map(function(id) {
                var option = caseData.medicineData.options[id];
                return {id: id, name: option.name, isNegative: !!option.isNegative};
            });
            // 临床症状
            saveData.symptomsData = {};
            for (var key in caseData.symptomsData) {
                var item = caseData.symptomsData[key];
                if (item.value.length > 0) {
                    saveData.symptomsData[key] = item.value.map(function(id) {
                        var option = item.options[id];
                        return {id: id, name: option.name, isNegative: !!option.isNegative};
                    });
                }
            }
            // 一般检查
            for (var key in caseData.baseConditionData) {
                var value = caseData.baseConditionData[key].value ? parseFloat(caseData.baseConditionData[key].value) : 0;
                switch (key) {
                    case 'heartRate':
                        saveData[key] = {'value': value};
                        break;
                    case 'sbp':
                        saveData['bp'][key] = value;
                        break;
                    case 'dbp':
                        saveData['bp'][key] = value;
                        break;
                    default :
                        saveData[key] = value;
                        break;
                }
            }
            // 扩展检查
            saveData.extendConditionData = {};
            for (var key in caseData.extendConditionData) {
                var isNegative = false;
                var item = caseData.extendConditionData[key];
                item.options.map(function(item2) {
                    if (item2.name === item.value) {
                        isNegative = item2.isNegative;
                    }
                    return item2;
                });
                saveData.extendConditionData[key] = {id: key, name: item.value, isNegative: !!isNegative};
            }
            // 体格检查
            saveData.bodyCheckData = {};
            for (var groupKey in caseData.bodyCheckData) {
                var group = caseData.bodyCheckData[groupKey];
                var newGroup = {active: group.active, items: {}};
                for (var itemKey in group.items) {
                    var item = group.items[itemKey];
                    if (item.value.length > 0) {
                        newGroup.items[itemKey] = item.value.map(function(id) {
                            var option = item.options[id];
                            if (option.descriptions) {
                                return {id: id, name: option.name, isNegative: !!option.isNegative, descriptions: option.descriptions.description};
                            } else {
                                return {id: id, name: option.name, isNegative: !!option.isNegative};
                            }
                        });
                    }
                }
                saveData.bodyCheckData[groupKey] = newGroup;
            }
            // 实验室检查
            saveData.labExamData = {};
            for (var key in caseData.labExamData) {
                var item = caseData.labExamData[key];
                var newItem = {id: item.id, active: item.active, items: {}};
                for (var key2 in item.items) {
                    var item2 = item.items[key2];
                    if (item2.value) {
                        newItem.items[key2] = {id: item2.id, name: item2.name, value: parseFloat(item2.value), unit: item2.unit};
                    }
                }
                saveData.labExamData[key] = newItem;
            }
            // 影像学检查
            saveData.imgExamData = {};
            for (var key in caseData.imgExamData) {
                var imgExamTempArray = [];
                var item = caseData.imgExamData[key];
                item.options.map(function(item2) {
                    if (item.value.indexOf(item2.id) > -1) {
                        imgExamTempArray.push({id: item2.id, name: item2.name, isNegative: !!item2.isNegative});
                    }
                });
                saveData.imgExamData[key] = {id: item.id, name: item.category, active: item.active, value: imgExamTempArray};
            }
            // 初步检查
            saveData.diagnosisData = [];
            caseData.diagnosisData.objects.map(function(item) {
                saveData.diagnosisData.push({id: item._id, name: item.name, duration: item.duration ? parseInt(item.duration) : 0});
                return item;
            });
            console.log(JSON.stringify(saveData));
            self.$http.post('/saveCase', {caseid: self.caseid, caseData: JSON.stringify(saveData)}).then(function(result) {
                console.log(result);
                if (!result.data.result.errcode) {
                    if (self.caseid) {
                        /* eslint-disable no-undef */
                        alert('修改成功，编号：' + self.caseid);
                    } else {
                        /* eslint-disable no-undef */
                        alert('保存成功，编号：' + result.data.result.id);
                        window.location.hash = '#' + result.data.result.id;
                    }
                        window.location.reload();
                    } else {
                        /* eslint-disable no-undef */
                        alert(result.data.result.errmsg);
                    }
            });
        }
    }
};
</script>

<style>
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
<template>
<table>
  <thead>
    <tr>
      <th v-for='th in head' v-text='parseHead(th)'></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for='(item, key) in data'>
      <td v-for='td in body' :rowspan='isMerge(key,td)' v-if='td == "title" ? key == 0 : true'>
        <!--最大最小范围输入框(除了血压)-->
        <span class='range' v-if='td == "range" && key != "bp" && item.hasRange'>
          <input v-if='isNumber(item.valueFrom)' class='mini' type='text' autocomplete='off' v-model.number='item.valueFrom'>
          <input v-if='isNumber(item.durationFrom)' class='mini' type='text' autocomplete='off' v-model.number='item.durationFrom'>
          <span>到</span>
          <input v-if='isNumber(item.valueTo)' class='mini' type='text' autocomplete='off' v-model.number='item.valueTo'>
          <input v-if='isNumber(item.durationTo)' class='mini' type='text' autocomplete='off' v-model.number='item.durationTo'>
        </span>
        <!--血压范围-->
        <div class='range' v-if='td == "range" && key == "bp" && item.hasRange'>
          <p class='row'>
            <span style='margin-right: 10px;'>收缩压：</span>
            <input class='mini' type='text' autocomplete='off' v-model.number='item.sbpFrom'>
            <span>到</span>
            <input class='mini' type='text' autocomplete='off' v-model.number='item.sbpTo'>
          </p>
          <p class='row'>
            <span style='margin-right: 10px;'>关　系：</span>
              <select v-model.number='item.rel'>
                <option value='0'></option>
                <option value='1'>和</option>
                <option value='2'>或</option>
            </select>
          </p>
          <p class='row'>
            <span style='margin-right: 10px;'>舒张压：</span>
            <input class='mini' type='text' autocomplete='off' v-model.number='item.dbpFrom'>
            <span>到</span>
            <input class='mini' type='text' autocomplete='off' v-model.number='item.dbpTo'>
          </p>
        </div>
        <!--单选范围-->
        <span class='range' v-if='td == "range" && isArray(item.radio)' v-for='option in item.radio'>
          <input type='radio' :value='option.value' v-model.number='item.acceptable'> {{option.name}}
        </span>
        <!--是否必要条件-->
        <span class='require' v-if='td == "require" && isBoolean(item.isRequired)'>
          <input :id='title + key' type='checkbox' :true-value='true' :false-value='false' v-model='item.isRequired' :disabled='!!item.disable'>
          <label :for='title + key' style='vertical-align: 2px;'> 是</label>
        </span>
        <!--文本值-->
        <span class='text' v-if='ignore.indexOf(td) > -1 && item[td]' v-text='item[td]'></span>
        <!--合并的标题-->
        <span class='txt' v-if='title && td == "title"' v-text='title'></span>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  props: {
    data: {
      type: [Object, Array]
    },
    head: {
      type: Array
    },
    body: {
      type: Array
    },
    title: {
      type: String,
      default: ''
    },
    class: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ignore: ['name', 'text', 'value', 'unit', 'duration', 'drugName', 'usage', 'dosage', 'frequency', 'time', 'notes']
    };
  },
  methods: {
    isNumber(object) {
      return typeof object === 'number';
    },
    isArray(object) {
      return Array.isArray(object);
    },
    isBoolean(object) {
      return typeof object === 'boolean';
        },
    parseHead(name) {
      var self = this;
      if (name.indexOf('?') > -1 && self.title) {
          name = name.replace(/\?/g, self.title);
           if (name.indexOf('yyyy-mm-dd') > -1) {
            var date = new Date();
            name = name.replace(/yyyy-mm-dd/g, date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }
      }
      return name;
    },
    isMerge(index, td) {
      var self = this;
      if (self.title && td === 'title' && index === 0) {
        return self.data.length;
      } else {
        return undefined;
      }
    }
  }
};
</script>

<style>
/***** table *****/

.model table {
    width: 100%;
    margin-top: 10px;
}

.model table.fixed {
    table-layout: fixed
}

.model table th {
    background: #f7f7f7;
}

.model table th ,
.model table td {
    border: 1px solid #e6e6e6;
    font-size: 14px;
    padding: 5px 10px;
    text-align: center;
}

.model table td .range {
    margin: 0 10px;
}

.model table td .range input[type=text] {
    border: none;
    border-bottom: 1px solid #ddd;
    background: none;
    padding: 0 5px;
}

.model table td .range input[type=text].mini {
    width: 30px;
}

.model table td .range p.row {
    padding: 5px 0;
}

.model table td  select {
    width: 74px;
    border: 1px solid #ddd;
    padding: 0 5px;
    font-size: 14px;
}

/*** 辅助检查：实验室检查 ***/
.model table.lab-exam td:nth-child(1){
    width: 40%;
}

.model table.lab-exam td:nth-child(2){
    width: 15%;
}

.model table.lab-exam td:nth-child(3){
    width: 25%;
}

.model table.lab-exam td:nth-child(4){
    width: 20%;
}
</style>
<template>
  <table class="check table">
    <thead>
      <tr>
        <th>检查项</th>
        <th>检查值</th>
        <th>上限</th>
        <th>下限</th>
        <th>单位</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <td>{{item.name}}</td>
          <td style="width: 20%;"><input type="text" autocomplete="off" v-model="item.value" @keyup="rule" @blur="judge($event, item.refValueFrom, item.refValueTo)" @keydown.enter="judge($event, item.refValueFrom, item.refValueTo)"></td>
          <td style="width: 15%;text-align: center;">{{item.refValueFrom}}</td>
          <td style="width: 15%;text-align: center;">{{item.refValueTo}}</td>
          <td style="width: 15%;text-align: center;">{{item.unit}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default{
    props: {
        data: {
            type: [Array, Object]
        }
    },
    methods: {
        rule(e) {
            var value = e.srcElement.value;
            e.srcElement.value = value.replace(/[^0-9^.]/g, '');
        },
        judge(e, from, to) {
            var value = e.srcElement.value;
            if (value) {
                if (/^[0-9]+.?[0-9]*$/g.test(value)) {
                    value = parseFloat(value);
                    if (value < from || value > to) {
                        e.srcElement.focus();
                    } else {
                        e.srcElement.blur();
                    }
                } else {
                    e.srcElement.focus();
                }
            } else {
                e.srcElement.blur();
            }
        }
      }
};
</script>

<style>

</style>
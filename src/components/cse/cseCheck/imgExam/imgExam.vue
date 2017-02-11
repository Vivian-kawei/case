<template>
  <table class="check table">
    <tbody>
      <tr v-for="item in data.options">
        <td>{{item.name}}</td>
        <td v-if="data.isMultiple" style="width: 15%;text-align: center;">
          <input type="checkbox" :value="item.id" v-model="data.value">
        </td>
        <td v-if="!data.isMultiple" style="width: 15%;text-align: center;">
          <input type="radio" :value="item.id" v-model="data.value[0]">
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default{
    props: {
        data: {
            type: Object
        }
    }
};
</script>

<style>
</style>
<template>
  <div class="section">
    <div :id="id" class="diagnosis">
      <div class="content"> 
        <div class="type">{{type}}：</div>  
      </div>
                      
      <div class="search">
        <div class="search-input">
          <input placeholder="请输入初步诊断关键字..."/>
        </div>
        <div class="search-result">
          <p>暂无相关记录...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    props: {
        id: {
            type: String
        },
        type: {
            type: String
        }
    },
    methods: {
        editItem(item) {
            var self = this;
            if (self.current && self.current === item) {
                self.clear();
            } else {
                self.current = item;
                self.text = item.name;
            }
        },
        deleteItem(item) {
            var self = this;
            self.data.objects.splice(self.data.objects.indexOf(item), 1);
            self.data.values.splice(self.data.objects.indexOf(item), 1);
            self.clear();
        },
        clear() {
            var self = this;
            self.current = null;
            self.text = '';
        }
    }
};
</script>

<style>
/***** diagnosis *****/

.diagnosis {
    min-height: 300px;
    position: relative;    
}

.diagnosis .search {
    width: 50%;
    height: 100%;
    padding: 0 10px;
    border-left: 1px solid #ddd;
    position: absolute;
    top: 0;
    right: 0;
}

.diagnosis .search-input {
    padding: 5px 0;
    position: relative;
}

.diagnosis .search-input input {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    background: white;
    border: 1px solid #ddd;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
}

.diagnosis .search-input input:hover,
.diagnosis .search-input input:focus {
    border: 1px solid #aaa;
}

.diagnosis .search-input button:hover {
    -webkit-box-shadow: 0 1px 6px #848484;
    -moz-box-shadow: 0 1px 6px #848484;
    box-shadow: 0 1px 6px #848484;
    opacity: 0.9;
    cursor: pointer;
}

.diagnosis .search-result {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 50px;
    bottom: 0;
    overflow: auto;
    border: 1px solid #ddd;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
}

.diagnosis .search-result ul {
    padding: 5px 0;
    line-height: 30px;
    font-size: 14px;
}

.diagnosis .search-result ul li {
    list-style-type: none;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    cursor: pointer;
}

.diagnosis .search-result ul li:hover {
    background: #eee;
}

.diagnosis .search-result p {
    padding: 10px;
    font-size: 14px;
    color: #aaa;
}

.diagnosis .content ol {
    padding: 0 0 0 30px;
}

.diagnosis .content ol li {
    font-size: 14px;
    line-height: 30px;
    position: relative;
    padding-right: 80px;
}

.diagnosis .content ol li i{
    width: 30px;
    line-height: 30px;
    text-align: center;
    display: none;
    cursor: pointer;
    opacity: 0.7;
    position: absolute;
    top: 0;
    right: 0;
}

.diagnosis .content ol li.edit i,
.diagnosis .content ol li:hover i {
    display: block;
}

.diagnosis .content ol li.edit {
    font-weight: bold;
}

.diagnosis .content ol li.edit i,
.diagnosis .content ol li:hover i:hover {
    opacity: 1;
}

.diagnosis .content ol li i.edit{
    right: 40px;
}

.diagnosis .content ol li i.delete{
    right: 10px;
}
</style>
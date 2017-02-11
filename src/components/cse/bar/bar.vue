<template>
  <div class="nav" id="nav">
    <div v-for="item in cseNav" class="group">
      <div v-if="item" @mouseenter="checkSplitCount($event, item)" @click="skip(item.id)" v-bind:class="getNavItemClass(item)">
        <div class="item-name">
          <span>{{item.name}}</span>
        </div>

        <div v-if="item.hasSubNav && csebar[item.id + 'Data']" class="sub-nav" v-bind:style="getSubNavStyle(item.id)">
            <div v-for="group in subNav[item.id + 'Groups']" class="wrap">
                <div v-for="sub in group" class="item" @click.stop="changeActive(sub)">
                    {{sub.category}}
                    <i :class="getIconClass(sub)" aria-hidden="true"></i>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default{
    props: {
        csebar: {
            type: Object
        }
    },
    data() {
        return {
            splitCount: 0,
            skipOffsetTop: 55,
            itemHeight: 36,
            subNav: {},
            cseNav: [
              { id: 'patientData', name: '病人信息' },
              { id: 'complainData', name: '主诉' },
              { id: 'presentData', name: '现病史' },
              { id: 'pastData', name: '既往史' },
              { id: 'personData', name: '个人史' },
              { id: 'maritalHistoryData', name: '婚育史' },
              { id: 'familyData', name: '家族史' },
              { id: 'medicineData', name: '药物过敏史' },
              { id: 'symptomsData', name: '临床症状' },
              { id: 'baseConditionData', name: '基础检查' },
              { id: 'extendConditionData', name: '扩展检查' },
              { id: 'bodyCheck', name: '体格检查', hasSubNav: true },
              { id: 'labExam', name: '实验室检查', hasSubNav: true },
              { id: 'imgExam', name: '影像学检查', hasSubNav: true },
              { id: 'diagnosisData', name: '初步检查' }
            ]
        };
    },
    methods: {
        getNavItemClass(item) {
            return {
                item: true,
                sub: !!item.hasSubNav
            };
        },
        getIconClass(item) {
            if (item) {
                return {
                    'fa': true,
                    'fa-check-circle': true,
                    'active': item.active
                };
            } else {
                return {};
            }
        },
        changeActive(item) {
            item.active = !item.active;
        },
        skip(id) {
            var self = this;
            window.scrollTo(0, document.getElementById(id).offsetTop - self.skipOffsetTop);
        },
        getSubNavStyle(id) {
            var self = this;
                if (self.subNav[id + 'Groups']) {
                    var count = self.subNav[id + 'Groups'].length;
                    return {
                        width: (count * 180) + ((count - 1) * 10) + 20 + 'px'
                    };
                } else {
                    return {};
                }
        },
        checkSplitCount(e, item) {
            if (item.hasSubNav) { // 有子菜单
                var self = this;
                var windowHeight = window.innerHeight;// 窗口高度
                var offsetTop = e.target.offsetTop;// div相对于屏幕的位置
                var splitCount = parseInt((windowHeight - offsetTop) / self.itemHeight);// 分割的数量
                var data = self.csebar[item.id + 'Data'];
                var index = 0;
                var group = [];
                var groups = [];
                for (var key in data) { // 重新分组
                    if (index % splitCount === 0) {
                        if (group.length > 0) {
                            groups.push(group);
                        }
                        group = [];
                    }
                    group.push(data[key]);
                    index++;
                }
                if (group.length > 0) {
                    groups.push(group);
                }
                Vue.set(self.subNav, item.id + 'Groups', groups);
            }
        }
    },
    mounted() {
        var side = document.getElementById('nav');
            window.onscroll = function() {
            if (document.querySelector('body').scrollTop > 35) {
                var marginRight = window.getComputedStyle(document.getElementById('container'));
                var right = marginRight.marginRight.replace('px', '');
                console.log(right);
                side.style.position = 'fixed';
                side.style.top = '10px';
                    side.style.right = right - 130 + 'px';
            } else {
                side.style.position = 'absolute';
                side.style.top = '0';
                side.style.right = '-130px';
            }
        };
    }
};
</script>

<style>
/***** side *****/

.nav {
    width: 120px;
    padding: 0 10px;
    background: #fcfcfc;
    -webkit-box-shadow: 0 1px 6px #ccc;
    -moz-box-shadow: 0 1px 6px #ccc;
    -ms-box-shadow: 0 1px 6px #ccc;
    -o-box-shadow: 0 1px 6px #ccc;
    box-shadow: 0 1px 6px #ccc;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    position: absolute;
    top: 0;
    right: -130px;
}

.nav .group {
    border-bottom: 1px solid #eee;
}

.nav .group:last-child {
    border-bottom: none;
}

.nav .group .item {
    margin: 0 -10px;
    line-height: 36px;
    cursor: pointer;
    position: relative;
    font-size: 14px;
    text-align: center;
}

.nav .group .item:hover {
    background: #eee;
}

.nav .group .item .item-name {
    width: 100%;
    height: 100%;
    padding: 0 20px;
}

.nav .group .item.sub:after {
    content: "\f0d9";
    font-family: FontAwesome,sans-serif;
    width: 26px;
    line-height: 36px;
    text-align: center;
    font-size: 16px;
    position: absolute;
    top: 0;
    left: 0;
}

.nav .group:first-child .item {
    -webkit-border-radius: 4px 4px 0 0;
    -moz-border-radius: 4px 4px 0 0;
    border-radius: 4px 4px 0 0;
}

.nav .group:last-child .item {
    -webkit-border-radius: 0 0 4px 4px;
    -moz-border-radius: 0 0 4px 4px;
    border-radius: 0 0 4px 4px;
}

.nav .sub-nav {
    background: #fcfcfc;
    padding: 0 10px;
    -webkit-box-shadow: 0 1px 6px #ccc;
    -moz-box-shadow: 0 1px 6px #ccc;
    -ms-box-shadow: 0 1px 6px #ccc;
    -o-box-shadow: 0 1px 6px #ccc;
    box-shadow: 0 1px 6px #ccc;
    display: none;
    text-align: left;
    position: absolute;
    top: 0;
    right: 121px;
    z-index: 3000;
}

.nav .sub-nav .wrap {
    width: 180px;
    display: inline-block;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid #eee;
    vertical-align: top;
    position: relative;
}

.nav .sub-nav .wrap:last-child {
    margin-right: 0;
    border-right: none;
    padding-right: 0;
}

.nav .item:hover .sub-nav {
    display: block;
}

.nav .sub-nav .item {
    text-align: left;
    padding: 0 20px;
}

.nav .sub-nav .wrap i.fa {
    width: 36px;
    line-height: 36px;
    text-align: center;
    color: #ccc;
    position: absolute;
    right: 0;
    top: 0;
}

.nav .sub-nav .wrap i.fa.active {
    color: #10b537;
}

</style>
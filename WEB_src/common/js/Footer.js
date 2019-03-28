Vue.component('nav-footer', {
  data: function () {
    return {
      footer: [{font: "首页", hf: '/CESADefault.aspx?index=1'},
                {font: "会员", hf: '/CESADefault.aspx?vip=1'},
                {font: '我的', hf: '/CESADefault.aspx?user=1'}],
    }
  },
  template: `<div class="ser-footer">
                <a :href='v.hf' :class="i == datas?'active': ''" v-for="(v,i) in footer">
                  <i class="icon"></i>
                  <span class="font" v-text="v.font"></span>
                </a>
              </div>`,
                
  props:['datas'],
  methods: {},
  mounted () {}
})
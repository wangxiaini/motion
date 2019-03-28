Vue.component('nav-title', {
  data: function () {
    return {
      
    }
  },
  template: '<ul class="navs clearfix">\
              <li v-for="(v,i) in count" @click="navActive(i)" :key="i">\
                <a v-text="v" :class="{active:navactive == i}"></a>\
              </li>\
            </ul>',
                
  props:['count','navactive'],
  methods: {
    navActive (i) {
      this.$emit('navclick',i)
    }
  }
})
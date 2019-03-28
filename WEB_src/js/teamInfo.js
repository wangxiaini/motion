var vm = new Vue ({
    el: '#minesign',
    data: {
        team_id:2,
        error:false,
        infos:[],
        UserList:[],
        activeType:['其他','足球','篮球','乒乓球','羽毛球','桥牌','马拉松'],
        matchNull,
        sliceTime,
        splitPath
    },
    methods: {

    },
    mounted() {
        setShare('','', ReviseURL('user=1'))
        this.team_id = getQueryString('id'); //获取url中"?"符后的字串
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action':'GetMyTeamInfoByTeamID',
                'team_id':this.team_id
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded'
            // }
        }).then((res) => {
            this.infos.push(res.data)
            this.UserList = this.infos[0].UserList

        }).catch((error) => {
            this.error = true
        });
    },
})

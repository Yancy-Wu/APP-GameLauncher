export default {
    ready: {
        progressBar: false,
        btnText: '启动游戏',
        btnDisabled: false,
        infoText: '',
        infoType: '',
    },
    install: {
        progressBar: true,
        btnText: '正在安装',
        btnDisabled: true,
        infoText: '安装',
        infoType: 'install'
    },
    update: {
        progressBar: true,
        btnText: '正在更新',
        btnDisabled: true,
        infoText: '更新',
        infoType: 'update'
    },
    check: {
        progressBar: false,
        btnText: '检查更新中',
        btnDisabled: true,
        infoText: '',
        infoType: ''
    }
}
const app = Vue.createApp({
    data() {
        return {
            author: '',
            messages: [],
            curr_message: '',
            socket: io('http://localhost:4000')
        }
    },
    methods: {
        sendMessage() {
            this.socket.emit('message', { content: this.curr_message, author: this.author })
            this.curr_message = ''
        },
    },
    mounted() {
        this.socket.on('connected', (data) => {
            this.author = data.name
        }),
            this.socket.on('message', (data) => {
                this.messages.push(data.message)
            })
    },
})

const mountedApp = app.mount('#app')

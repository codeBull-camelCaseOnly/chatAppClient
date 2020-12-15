const app = Vue.createApp({
    data() {
        return {
            author: '',
            name_error: false,
            messages: [],
            curr_message: '',
            socket: io('http://localhost:3000')
        }
    },
    methods: {
        sendMessage() {
            this.socket.emit('message', { content: this.curr_message, author: this.author })
            this.curr_message = ''
        },
        changeName() {
            this.name_error = false
            this.socket.emit('changename', { name: this.author })
        }
    },
    mounted() {
        this.socket.on('connected', (data) => {
            this.author = data.name
        }),
            this.socket.on('message', (data) => {
                this.messages.push(data.message)
            }),
            this.socket.on('invalid_name', (data) => {
                this.author = data.orig_name
                this.name_error = true
            })
    },
})

const mountedApp = app.mount('#app')

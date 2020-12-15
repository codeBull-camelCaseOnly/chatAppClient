const app = Vue.createApp({
    data() {
        return {
            author: '',
            name_error: false,
            messages: [],
            curr_message: '',
            color: '',
            socket: io('http://localhost:3000'),
            dark_mode: true
        }
    },
    watch: {
        dark_mode: function () {
            document.body.classList.toggle('bg-dark')
            var tmp = document.getElementById('card').classList
            tmp.toggle('bg-dark')
            tmp.toggle('text-light')
        }
    },
    methods: {
        sendMessage() {
            this.socket.emit('message', { content: this.curr_message, author: this.author, color: this.color })
            this.curr_message = ''
        },
        changeName() {
            this.name_error = false
            this.socket.emit('changename', { name: this.author })
        },
    },
    mounted() {
        this.socket.on('connected', (data) => {
            this.author = data.name
            this.color = data.color
        }),
            this.socket.on('message', (data) => {
                this.messages.push(data.message)
                this.$nextTick(() => {
                    container = document.getElementById('messages');
                    container.scrollTop = container.scrollHeight;
                })
            }),
            this.socket.on('invalid_name', (data) => {
                this.author = data.orig_name
                this.name_error = true
            })
    },
})

const mountedApp = app.mount('#app')

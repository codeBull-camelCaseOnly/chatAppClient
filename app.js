const app = Vue.createApp({
    data() {
        return {
            author: '',
            name_error: false,
            messages: [],
            curr_message: '',
            color: '',
            socket: io('http://localhost:3000'),
            dark_mode: true,

            available_rooms: [
                { name: 'Kartik\'s room' },
                { name: '12345\'s room' }
            ]
        }
    },
    watch: {
        dark_mode: function () {
            document.querySelector('body').classList.toggle('bg-dark')
            if (this.dark_mode) {
                this.globalReplace('bg-light', 'bg-dark')
                this.globalReplace('text-dark', 'text-light')
            }

            else {
                this.globalReplace('bg-dark', 'bg-light')
                this.globalReplace('text-light', 'text-dark')
            }
        }
    },
    methods: {

        globalReplace(class1, class2) {

            eles = document.querySelectorAll('.' + class1)
            eles.forEach(element => {
                // console.log(element)
                element.classList.add(class2)
                element.classList.toggle(class1)
            });
        },
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

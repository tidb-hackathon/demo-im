﻿var emitter = emitter.connect({
    host: "localhost",
    port: 8080,
    secure: false
}); 
var key = 'KnwDRKWg3Xrhn_3UtTJTXfieIz4BUBDn';
var vue = new Vue({
    el: '#app',
    data: {
        currentUser: getPersistentVisitorId(),
        messages: [],
        message: '',
        emoji: [
            "😀", "😬", "😁", "😂", "😃", "😄", "😅", "😆", "😇", "😉", "😊",
            "🙂", "😋", "😌", "😍", "😘", "😗", "😙", "😚", "😜", "😝", "😛", 
            "😎", "😏", "😶", "😐", "😑", "😒", "😳", "😞", "😟", "😠", "😡",
            "😔", "😕", "🙁", "☹", "😣", "😖", "😫", "😩", "😤", "😮", "😱",
            "😨", "😰", "😯", "😦", "😧", "😢", "😥", "😪", "😓", "😭", "😵", 
            "😲", "😷"
        ]
    },
    methods: {
        sendMessage: function () {
            var message = this.$data.message;
            this.$data.message = '';

	        // publish a message to the chat channel
	        console.log('emitter: publishing');
	        emitter.publish({
                key: key,
                channel: "article1/" + "12345",
                ttl: 1200,
                message: JSON.stringify({
                    name: 'test',
                    hash: getPersistentVisitorId(),
                    text: message,
                    date: new Date(),
                })
            });
        },

        append: function(emoji) {
            this.$data.message += ' ' + emoji + ' ';
        }
    }
});

emitter.on('connect', function(){
    // once we're connected, subscribe to the 'chat' channel
    console.log('emitter: connected');
    emitter.subscribe({
        key: key,
        channel: "article1/12345",
        last: 5
    });

    jdenticon.update(".img-circle");
})

// on every message, print it out
emitter.on('message', function(msg){

    // log that we've received a message
    console.log('emitter: received ' + msg.asString() );

    // If we have already 5 messages, remove the oldest one (first)
    if (vue.$data.messages.length >= 5){
        vue.$data.messages.shift();
    }

    // Push the message we've received and update an identicon once it's there
    vue.$data.messages.push(msg.asObject());
    setTimeout(function(){ 
        jdenticon.update(".img-circle");
    },5);
});

//client socket implementation.
const $messageForm = document.querySelector("#chatForm");
const $messageFormSubBtn = $messageForm.querySelector("#submitChat");
const $messageFormInp = $messageForm.querySelector("#message");
const $messageFormLocBtn = document.querySelector("#sendLocation");

    
socket = io();
socket.on("connect", () => {
    console.log('client connect');
})

socket.on('message', data => {
    console.log(data);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormSubBtn.setAttribute('disabled', 'disabled');
    let message = e.target.elements.message.value; //document.querySelector("#message").value;
    //console.log(message);
    if (message.length > 0) {
        socket.emit('sendMessage', message, (error) => {
            $messageFormSubBtn.removeAttribute('disabled');
            $messageFormInp.value = "";
            $messageFormInp.focus();
            if (error) {
                console.log(error);
                return
            } else {
                console.log("Delivered success");
            }
        });
    }
})

$messageFormLocBtn.addEventListener('click', (e) => {
    $messageFormLocBtn.setAttribute('disabled', 'disabled');
    if (!navigator.geolocation) {
        alert("Geolocation is not supported in your browsers, please try with another browser");
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        socket.emit('sendLocation', {lat,lng}, (err = '') => {
            $messageFormLocBtn.removeAttribute('disabled');
            console.log(err);
        });
    })
});

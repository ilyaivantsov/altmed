window.onload = function () {
    const socket = io.connect("localhost:3000");

    socket.on("call-made", async data => {

    });

    socket.on("answer-made", async data => {

    });

    socket.on("call-rejected", data => {

    });
}
new Vue({
    el: '#app',
    data() {
        return {
            stream: null,
            socket: null,
            audioChunks: [],
            mediaRecorder: null,
            rec: '...',
            loading: true,
            profile: false,
            recorder: false,
            videoChat: false,
            name: null,
            address: null,
            disease: null,
        }
    },
    vuetify: new Vuetify(),
    methods: {
        createVideoCall: function () {
            this.videoChat = true;
            navigator.getUserMedia(
                { video: true, audio: true },
                stream => {
                    this.stream = stream;
                    const localVideo = document.getElementById("local-video");
                    if (localVideo) {
                        localVideo.srcObject = this.stream;
                    }

                    // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
                },
                error => {
                    console.warn(error.message);
                }
            );
        },
        endCall: function () {
            this.videoChat = false;
            this.stream.getTracks().forEach(track => track.stop());
        },
        startRec: function () {
            navigator.getUserMedia({ audio: true },
                stream => {
                    this.loading = true;
                    this.rec = '...';
                    this.recorder = true;
                    this.stream = stream;
                    this.mediaRecorder = new MediaRecorder(stream);

                    this.mediaRecorder.addEventListener("dataavailable", event => {
                        this.audioChunks.push(event.data);
                    });

                    this.mediaRecorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(this.audioChunks);
                        let reader = new FileReader();
                        reader.readAsDataURL(audioBlob);
                        reader.onloadend = () => {
                            base64 = reader.result;
                            base64 = base64.split(',')[1];
                            this.rec = base64;
                        }
                        this.mediaRecorder = null;
                        this.stream = null;
                        this.audioChunks = [];
                        this.loading = false;
                    });

                    this.mediaRecorder.start();

                    setTimeout(() => {
                        this.mediaRecorder.stop();
                    }, 8000);
                },
                error => {
                    console.warn(error.message);
                }
            )
        }
    },
    created() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        // this.socket = io.connect("localhost:3000");
        console.log('asdasd');
    }
});
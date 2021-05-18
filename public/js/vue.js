new Vue({
    el: '#app',
    data() {
        return {
            getCalled: false,
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
                            let base64 = reader.result;
                            base64 = base64.split(',')[1];
                            this.sendAudioToServer(base64);
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
        },
        getJoke: function () {
            this.recorder = true;
            const url = `http://${location.host}/joke`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                res => res.json()
            ).then(
                data => this.rec = data.value
            ).catch(err => console.error(err));
        },
        sendAudioToServer: function (base64) {
            const url = `http://${location.host}`;
            const data = { audio: base64 };
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                res => res.json()
            ).then(
                // data => this.rec = data.message
            ).catch(err => console.error(err));
        }
    },
});
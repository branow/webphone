/**
 * AudioVisualizer (Work for local and Remote MediaStream)
 * Reference: https://mdn.github.io/voice-change-o-matic
 * @author Ricardo JL Rufino
 * @singleton
 */
var AudioVisualizer = (function () {

    var started = false;
    var drawVisual; // requestFrame
    var canvas;
    var remoteAudio; // if you use reote
    var analyser;
    var options;

    /**
     * @param {*} _canva 
     * @param {*} (Optional) _remoteAudio - For WebRCT visualization
     */
    this.init = function (_canvas, _remoteAudio, _options) {
        canvas = _canvas;
        remoteAudio = _remoteAudio;
        options = _options;
    }

    this.start = function(){

        if(!canvas) return; // not initialized
        
        // fork getUserMedia for multiple browser versions, for those
        // that need prefixes
        
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);


        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var source;

        analyser = audioCtx.createAnalyser();
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        var canvasCtx = canvas.getContext("2d");

        var dataArray = null;
        var bufferLength = null;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        if(remoteAudio){
            console.log("Using provided mediaStream ");
            
            setTimeout(async () => {
                source = audioCtx.createMediaStreamSource(remoteAudio);
                source.connect(analyser);
                started = true;
                visualize();
            }, 100);

        }else{ // Use Local Media
            
            console.log("Using local mediaStream ");

            if (navigator.getUserMedia) {
                console.log('getUserMedia supported.');
                navigator.getUserMedia (
                    // constraints - only audio needed for this app
                    {
                        audio: true
                    },
                
                    // Success callback
                    function(stream) {
                        source = audioCtx.createMediaStreamSource(stream);
                        source.connect(analyser);
                        started = true;
                        visualize();
                    },
                
                    // Error callback
                    function(err) {
                        console.log('The following gUM error occured: ' + err);
                        started = false;
                    }
                );
            } else {
                console.log('getUserMedia not supported on your browser!');
                started = false;
            }
        }

        function visualize() {
            analyser.fftSize = 2048;
            bufferLength = analyser.fftSize;

            dataArray = new Float32Array(bufferLength);
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            draw();
        }


        var draw = function() {
            
            drawVisual = requestAnimationFrame(draw);
        
            analyser.getFloatTimeDomainData(dataArray);
            
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.fillStyle = options.fillStyle || '#56585a';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
            canvasCtx.lineWidth = options.lineWidth || 2;
            canvasCtx.strokeStyle = options.strokeStyle || '#23d160';
        
            canvasCtx.beginPath();
        
            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;
        
            for(var i = 0; i < bufferLength; i++) {
                
                var v = dataArray[i] * 150.0;
                var y = HEIGHT/2 + v;
        
                if(i === 0) {
                canvasCtx.moveTo(x, y);
                } else {
                canvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
        
            canvasCtx.lineTo(canvas.width, canvas.height/2);
            canvasCtx.stroke();
        };
                
    }

    this.stop = function(){
        if(!canvas) return;
        if(started){
            started = false;
            window.cancelAnimationFrame(drawVisual);
            var canvasCtx = canvas.getContext("2d");
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    return this;

}).call({}); // create singleton instance

export default AudioVisualizer;

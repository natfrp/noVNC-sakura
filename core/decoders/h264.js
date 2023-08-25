export default class H264Decoder {
    decodeRect(_x, _y, _width, _height, sock, display, _depth) {
        const length = sock.rQshift32();
        if (sock.rQwait('H264', length + 4, 4)) {
            return false;
        }

        const flag = sock.rQshift32();
        const data = sock.rQshiftBytes(length);

        if (!this.decoder) {
            this.decoder = new VideoDecoder({
                output(frame) {
                    display.resize(frame.displayWidth, frame.displayHeight);
                    display.frame(frame);
                    frame.close();
                },
                error(e) {
                    console.error(e);
                }
            });

            const codec = 'avc1.' + [...data.slice(5, 8)].map(x => x.toString(16).padStart(2, '0')).join('');
            this.decoder.configure({
                codec,
                avc: { format: 'annexb' },
                optimizeForLatency: true,
                hardwareAcceleration: 'prefer-hardware',
            });
            console.debug('video decoder configured: ' + codec);
        }

        this.decoder.decode(new EncodedVideoChunk({
            type: 'key',
            timestamp: 0,
            data,
        }));

        return true;
    }

    reset() {
        if (this.decoder) {
            console.debug('video decoder reset');

            this.decoder.close();
            this.decoder = null;
        }
    }
}

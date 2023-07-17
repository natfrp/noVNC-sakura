export default class H264Decoder {
    decodeRect(_x, _y, _width, _height, sock, display, _depth) {
        const length = sock.rQshift32();
        if (sock.rQwait('H264', length + 4, 4)) {
            return false;
        }

        const flag = sock.rQshift32();

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
            this.decoder.configure({ codec: 'avc1.42001e' });
        }

        this.decoder.decode(new EncodedVideoChunk({
            type: 'key',
            timestamp: 0,
            data: sock.rQshiftBytes(length),
        }));

        return true;
    }
}

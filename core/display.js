/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2019 The noVNC Authors
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

import * as Log from './util/logging.js';
import { toSigned32bit } from './util/int.js';

export default class Display {
    constructor(target) {
        // the full frame buffer (logical canvas) size
        this._fbWidth = 0;
        this._fbHeight = 0;
        this._scWidth = 0;

        Log.Debug(">> Display.constructor");

        // The visible canvas
        this._target = target;

        if (!this._target) {
            throw new Error("Target must be set");
        }

        if (typeof this._target === 'string') {
            throw new Error('target must be a DOM element');
        }

        if (!this._target.getContext) {
            throw new Error("no getContext method");
        }

        this._targetCtx = this._target.getContext('2d');

        Log.Debug("User Agent: " + navigator.userAgent);

        Log.Debug("<< Display.constructor");

        // ===== PROPERTIES =====

        this._scale = 1;
        this._frames = 0;
        this._firstFrame = null;
    }

    // ===== PUBLIC METHODS =====

    absX(x) {
        return toSigned32bit(x / this._scale);
    }

    absY(y) {
        return toSigned32bit(y / this._scale);
    }

    screenResize(width) {
        this._scWidth = width;
        if (this._fbWidth) {
            this._scale = Math.min(width / this._fbWidth, 1);
        }
    }

    resize(width, height) {
        this._fbWidth = width;
        this._fbHeight = height;

        this._scale = Math.min(this._scWidth / this._fbWidth, 1);

        this._target.width = width * this._scale;
        this._target.height = height * this._scale;
    }

    frame(frame) {
        if (this._firstFrame === null) {
            this._firstFrame = performance.now();
        }
        this._frames++;
        this._targetCtx.drawImage(frame, 0, 0, this._target.width, this._target.height);
    }

    fps() {
        return this._firstFrame === null ? 0 : (this._frames / (performance.now() - this._firstFrame) * 1000);
    }
}

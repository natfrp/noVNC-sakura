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
    }

    // ===== PUBLIC METHODS =====

    absX(x) {
        return toSigned32bit(x / this._scale);
    }

    absY(y) {
        return toSigned32bit(y / this._scale);
    }

    resize(width, height) {
        this._fbWidth = width;
        this._fbHeight = height;

        this._target.width = width * this._scale;
        this._target.height = height * this._scale;
    }

    frame(frame) {
        this._targetCtx.drawImage(frame, 0, 0, this._target.width, this._target.height);
    }
}

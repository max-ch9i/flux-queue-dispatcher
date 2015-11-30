'use strict';

var Dispatcher = require('flux').Dispatcher;
var Queue = require('queue');
var invariant = require('invariant');

class QDispatcher extends Dispatcher {
    constructor() {
        super();
        this._actionQueue = new Queue();
        this._actionQueue.concurrency = 1; // make it synchronous
        this._actionQueueActive = false;
        this._actionQueue.on('end', function() {
            this._actionQueueActive = false;
        }.bind(this));
    }
    dispatch(payload, cb) {
        invariant(
            !this._isDispatching,
            'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );
        this._startDispatching(payload);
        try {
          for (var id in this._callbacks) {
                if (this._isPending[id]) {
                    continue;
                }
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
            cb();
        }
    }
    onQueueEnd(cb) {
        this._actionQueue.on('end', cb.bind(this));
    }
    queueDispatch(payload) {
        this._actionQueue.push(function(cb) {
            this.dispatch(payload, cb);
        }.bind(this));

        if (!this._actionQueueActive) {
            this._actionQueueActive = true;
            this._actionQueue.start();
        }
    }
}

module.exports = QDispatcher;
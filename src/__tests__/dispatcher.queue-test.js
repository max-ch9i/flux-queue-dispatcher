'use strict';

jest.dontMock('../dispatcher.queue.js');
jest.dontMock('flux');
jest.dontMock('queue');
jest.dontMock('invariant');
jest.dontMock('flux/utils');
jest.dontMock('immutable');

describe('QDispatcher', function() {
    var QDispatcher = require('../dispatcher.queue.js');
    var ReduceStore = require('flux/utils').ReduceStore;
    var Immutable = require('immutable');

    it('extends Dispatcher', function() {
        var Dispatcher = require('flux').Dispatcher;

        var _disp = new QDispatcher();
        expect(_disp instanceof Dispatcher).toBe(true);
    });

    it('implements queueDispatch method', function() {
        var _disp = new QDispatcher();
        expect(typeof _disp.queueDispatch).toBe('function');
    });

    it('implements onQueueEnd method', function() {
        var _disp = new QDispatcher();
        expect(typeof _disp.onQueueEnd).toBe('function');
    });

    it('adds asynchronous events to the queue', function(done) {
        class QueueStore extends ReduceStore {
            getInitialState() {
                return new Immutable.List();
            }
            reduce(state, action) {
                return state.push(state.item);
            }
        }
        
        var _disp = new QDispatcher();
        var _store = new QueueStore(_disp);

        _disp.onQueueEnd(function() {
            var state = _store.getState();
            expect(state.size).toBe(1);
            done();
        });

        _disp.queueDispatch({
            item: 'cyan'
        });
    });
});
### Flux dispatcher with queued actions

[![Build status][travis-img]][travis-url]

Implements the Flux dispatcher with queued actions.

### Motivation

The [basic implementation][disp-base] prevents us from running `dispatch()` while dispatching.
However, if `dispatch()` is triggered by, for example, an AJAX request, we can't guarantee it is not called during a dispatch.

To handle this situation all `dispatch()` calls are put into a queue and executed sequentially.

### Usage

Set up the dispatcher module.

```javascript
// @file /dispatcher.js
import QueueDispatcher from 'flux-queue-dispatcher';

var dispatcher = new QueueDispatcher();
export default dispatcher;
export const dispatch = dispatcher.queueDispatch.bind(disp);
```

Use it whenever actions are triggered.

```javascript
// @file /comp1.js
import React from 'react';
import {dispatch} from './dispatcher.js';

class Comp1 extends React.Component {
    _event() {
        // Make asynchornous dispatch
        setTimeout(function() {
            dispatch({
                type: 'action1'
            });
        }, 100);
        // The time of the callback execution is unknown
        $.get('/data', function(result) {
            dispatch({
                type: 'action2',
                payload: result
            });
        });
    }
    render() {
        return <a click={this._event}>Click me!</a>;
    }
}
export default Comp1;
```

Read more about the [Flux dispatcher][disp-flux].

[travis-img]: https://travis-ci.org/maximus8891/flux-queue-dispatcher.svg
[travis-url]: https://travis-ci.org/maximus8891/flux-queue-dispatcher
[disp-base]: https://github.com/facebook/flux/blob/master/src/Dispatcher.js#L183
[disp-flux]: https://facebook.github.io/flux/docs/dispatcher.html#content
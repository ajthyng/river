const Immer = require('immer')

class Queue {
  constructor () {
    this._queue = []
  }

  get size () {
    return this._queue.length
  }

  enqueue (item) {
    this._queue = Immer.produce(this._queue, draft => {
      draft.push(item)
    })
  }

  dequeue () {
    if (this._queue.length >= 1) {
      const dequeuedItem = Immer.produce(this._queue, draft => {
        return draft[0]
      })
      this._queue = Immer.produce(this._queue, (draft) => {
        draft.shift()
      })
      return dequeuedItem
    } else {
      return null
    }
  }

  peek () {
    return Immer.produce(this._queue, draft => {
      return draft[0]
    })
  }
}

module.exports = {
  Queue
}

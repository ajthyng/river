const { Observable, from, defer, of } = require('rxjs')
const { mergeAll, map, concatMap, delay } = require('rxjs/operators')

function isDefined (value) {
  return value !== undefined && value !== null
}

function isNotDefined (value) {
  return value === undefined || value === null
}

class River {
  _createObservableFromCursor (cursor) {
    return new Observable(async (subscriber) => {
      while (await cursor.hasNext()) {
        subscriber.next(await cursor.next())
      }
      await cursor.close()
      subscriber.complete()
    })
  }

  flow ({
    cursor,
    throttle,
    concurrency,
    handler
  }) {
    if (isNotDefined(cursor)) {
      throw new Error('A cursor must be provided.')
    }

    if (isNotDefined(cursor.hasNext)) {
      throw new Error('A cursor must have a \'hasNext\' method.')
    }

    if (isNotDefined(cursor.next)) {
      throw new Error('A cursor must have a \'next\' method.')
    }

    const cursorObservable = this._createObservableFromCursor(cursor)

    const source$ = from(cursorObservable)

    return source$.pipe(
      concatMap(event => of(event).pipe(delay(throttle ?? 0))),
      map(item => defer(async () => {
        if (isDefined(handler) && typeof handler === 'function') {
          return handler.call(this, item)
        }
        return item
      })),
      mergeAll(concurrency)
    )
  }
}

module.exports = {
  River
}

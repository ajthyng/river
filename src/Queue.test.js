const { Queue } = require('./Queue')

describe('Queue', () => {
  it('should immutably queue items', () => {
    const itemOne = { name: 'one' }
    const itemTwo = { name: 'two' }
    const queue = new Queue()

    queue.enqueue(itemOne)
    queue.enqueue(itemTwo)

    const item = queue.dequeue()

    item.name = 'three'

    expect(itemOne.name).toBe('one')
  })

  it('should change length of queue when dequeueing an item', () => {
    const itemOne = { name: 'one' }
    const itemTwo = { name: 'two' }
    const queue = new Queue()

    queue.enqueue(itemOne)
    queue.enqueue(itemTwo)

    queue.dequeue()

    expect(queue.size).toBe(1)
  })

  it('should peek an item', () => {
    const itemOne = { name: 'one' }
    const itemTwo = { name: 'two' }
    const queue = new Queue()

    queue.enqueue(itemOne)
    queue.enqueue(itemTwo)

    queue.dequeue()
    expect(queue.peek()).toEqual({
      name: 'two'
    })
    expect(queue.size).toBe(1)
  })

  it('should return null for an empty queue', () => {
    const queue = new Queue()
    expect(queue.dequeue()).toBeNull()
  })
})

import heapq from "heapq";

export default class PriorityQueue {
  // class PriorityQueue {
  constructor() {
    this.heap = [];
    this.entry_finder = new Map();
    this.cmp = function (x, y) {
      return x[1] < y[1];
    };
  }
  add(task, priority = 0) {
    if (this.entry_finder.has(task)) {
      this.remove(task);
    }
    let entry = [task, priority];
    this.entry_finder.set(task, entry);
    heapq.push(this.heap, entry, this.cmp);
  }
  remove(task) {
    if (this.entry_finder.get(task) === undefined) {
      return false;
    } else {
      let entry = this.entry_finder.get(task);
      entry[0] = "removed";
      this.entry_finder.delete(task);
      return true;
    }
  }
  get(task) {
    //return index of task
    if (this.entry_finder.get(task) === undefined) {
      return -1;
    } else {
      return this.entry_finder.get(task)[1];
    }
  }
  pop() {
    while (this.heap) {
      let task = heapq.pop(this.heap, this.cmp)[0];
      if (task !== "removed") {
        this.entry_finder.delete(task);
        return task;
      }
    }
    return -1;
  }
  isEmpty() {
    return this.entry_finder.size === 0;
  }
  // pdq() {
  //   debugger;
  //   let pdq = new PriorityQueue();
  //   debugger;
  //   let x = { row: 5, col: 7 };
  //   pdq.add(x, 1);
  //   console.log(pdq.get(x));
  //   console.log(pdq.get({ row: 5, col: 7 }));
  //   pdq.add("m", 3);
  //   // pdq.get("a");
  //   pdq.add("b", 5);
  //   pdq.add("v", 7);
  //   pdq.add("w", 3);
  //   pdq.get("q", 110);
  //   pdq.add("r", 77);
  //   pdq.add("x", 2);
  //   while (pdq) {
  //     console.log(pdq.pop());
  //   }
  // }
}

// export default PriorityQueue.prototype.pdq;

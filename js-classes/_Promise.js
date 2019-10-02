class $Promise {
    promise = null;
    resolved = false;
    constructor(fn) {
        this.promise = new Promise(fn).then(() => { this.resolved = true });
    }
    then(fn) {
        this.promise.then(() => { fn() });
    }
}


p1 = new Promise(res => {
    console.log('promise 1');
    setTimeout(() => {console.log('end1');res()}, 2000);
})
p2 = new Promise(res => {
    console.log('promise 2');
    setTimeout(() => {console.log('end2');res()}, 3000);
})
Promise.all([p1, p2]).then(() => {
    console.log('all ended');
    console.log(arguments);
})
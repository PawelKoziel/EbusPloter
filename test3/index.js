const getData = function(e)  {
    console.log(e.target.value)
    localStorage.setItem('inputKey', e.target.value)
}
const inputField = document.getElementById('text');
inputField.value = localStorage.getItem('inputKey');

const debounce = function (fn, delay) {
    let timer
    return function () {
        let context = this
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, arguments)
        }, delay)
    }
}


inputField.addEventListener('keyup', debounce(getData, 300))


// let count = 10

// for (let i = 0; i < 10; i++) {
//     setTimeout(() => {
//         console.log(count * 500)
//         count--
//     }, i * 500);
// }

'use strict';

/**********************************************************************************************
 *                                                                                            *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                     *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions                    *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function  *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments      *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures                           *
 *                                                                                            *
 **********************************************************************************************/


/**
 *  Возвращает функцию, которая является композицией двух заданных функций f (x) и g (x).
 *  Результатом должена быть функцией одного аргумента (позволяет вызывать аргумент x),
 *  который работает как применение функции f к результату применения функции g к x, т.е.
 *  getComposition (f, g) (x) = f (g (x))
 *
 *
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 *
 * @example
 *   getComposition(Math.sin, Math.asin)(x) => Math.sin(Math.acos(x))
 *
 */
function getComposition(f,g) {
     return function(x){
        return f(g(x));
    }
}


/**
 * Возвращает функцию возведения в степень для переданного аргумента
 *
 * @param {number} exponent
 * @return {Function}
 *
 * @example
 *   var power2 = getPowerFunction(2); // => x^2
 *   power2(2) => 4
 *   power2(4) => 16
 *
 *   var power05 = getPowerFunction(0.5); // => x^0.5
 *   power05(4) => 2
 *   power05(16) => 4
 *
 */
function getPowerFunction(exponent) {
   return function(x){
        return Math.pow(x,exponent);
    }
}


/**
 * Возвращает полином на основании переданных аргументов
 * Подробнее: https://en.wikipedia.org/wiki/Polynomial#Definition
 *
 * @params {integer}
 * @return {Function}
 *
 * @example
 *   getPolynom(2,3,5) => y = 2*x^2 + 3*x + 5
 *   getPolynom(1,-3)  => y = x - 3
 *   getPolynom(8)     => y = 8
 *   getPolynom()      => null
 */
function getPolynom() {
    let arr = [];
    switch(arguments.length){
        case 3: arr.push(arguments[0], arguments[1], arguments[2]); break;
        case 2: arr.push(arguments[0], arguments[1]); break;
        case 1: arr.push(arguments[0]); break;
        case 0: arr.push(null); break;
    }
    return function(x){
        switch(arr.length){
            case 3: return arr[0] * Math.pow(x, 2) + arr[1] * x + arr[2];
            case 2: return arr[0]*x + arr[1];
            case 1 || 0: return arr[0];
        }
    }
}


/**
 * Заменяет переданную функцию и возвращает функцию,
 * которая в первый раз вызывает переданную функцию, а затем всегда возвращает результат кэширования.
 *
 * @params {Function} func - функция для запонимания
 * @return {Function} запомненная функция
 *
 * @example
 *   var memoizer = memoize(() => Math.random());
 *   memoizer() => любое рандомное число (при первом запуске вычисляется Math.random())
 *   memoizer() => тоже раномное число (при втором запуске возвращается закешированный результат)
 *   ...
 *   memoizer() => тоже рандомное число  (при всех последующих вызовах возвращается тоже закешированный результат)
 */
function memoize(func) {
    let obj = {};
    return function(){
        let temp = JSON.stringify(arguments);
        if(!obj.hasOwnProperty(temp)){
            obj[temp] = func.call(this);
        }
        return obj[temp];
    }
}


/**
 * Возвращает функцию, которая пытаеся вызвать переданную функцию, и,
 * если она выбрасывает ошибку, повторяет вызов функции заданное количество раз.
 * @param {Function} функция
 * @param {number} количество попыток
 * @return {Function}
 *
 * @example
 * var attempt = 0, retryer = retry(() => {
 *      if (++attempt % 2) throw new Error('test');
 *      else return attempt;
 * }, 2);
 * retryer() => 2
 */
function retry(func, attempts) {
    return function () {
        let res = 0;
        try {
            res = func();
        }
        catch (ex) {
            for (var index = 0; index < attempts; index++) {
                try {
                    res = func();
                }
                catch (er) {

                }
            }

        }
        return res;
    }
}


/**
 * Возвращает логирующую обертку для указанного метода,
 * Logger должен логировать начало и конец вызова указанной функции.
 * Logger должен логировать аргументы вызываемой функции.
 * Формат вывода:
 * <function name>(<arg1>, <arg2>,...,<argN>) starts
 * <function name>(<arg1>, <arg2>,...,<argN>) ends
 * 
 * @param {Function} функция
 * @param {Function} логирующая функция - функия для вывода логов с однис строковым аргументом
 * @return {Function}
 *
 * @example
 *
 * var cosLogger = logger(Math.cos, console.log);
 * var result = cosLogger(Math.PI));     // -1
 *
 * log from console.log:
 * cos(3.141592653589793) starts
 * cos(3.141592653589793) ends
 *
 */
function logger(func, logFunc) {
     return (...args)=>{
        let str = '';
        for (let index = 0; index < args.length; index++) {
            if (args[index] instanceof Array) {
                str += '[';
                for (let i = 0; i < args[index].length; i++)
                    if ((typeof (args[index][i])).toLowerCase() == "string")
                        str += "\"" + args[index][i] + "\",";
                    else
                        str += args[index][i] + ",";
                str = str.slice(0, str.length - 1);
                str += '],';
            }
            else
                str += args[index] + ',';
        }
        str = str.slice(0, str.length - 1);
        logFunc(`${func.name}(${str}) starts`);
        let res = func.apply(this, args);
        logFunc(`${func.name}(${str}) ends`);
        return res;
    }
}


/**
 * Возвращает фуункцию с частично примененными аргументами
 * @param {Function} fn
 * @return {Function}
 *
 * @example
 *   var fn = function(x1,x2,x3,x4) { return  x1 + x2 + x3 + x4; };
 *   partialUsingArguments(fn, 'a')('b','c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b')('c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c')('d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c','d')() => 'abcd'
 */
function partialUsingArguments(fn) {
    const args = Array.from(arguments).slice(1);
    return function() {
        return fn.apply(null, args.concat(Array.from(arguments)));
    };
}


/**
 * Возвращает функцию IdGenerator, которая возвращает следующее целое число при каждом вызове начиная с переданного
 *
 * @param {Number} стартовое число
 * @return {Function}
 *
 * @example
 *   var getId4 = getIdGenerator(4);
 *   var getId10 = gerIdGenerator(10);
 *   getId4() => 4
 *   getId10() => 10
 *   getId4() => 5
 *   getId4() => 6
 *   getId4() => 7
 *   getId10() => 11
 */
function getIdGeneratorFunction(startFrom) {
    let start = startFrom;
    return function inc(){
        return start++;
    }    
}


module.exports = {
    getComposition: getComposition,
    getPowerFunction: getPowerFunction,
    getPolynom: getPolynom,
    memoize: memoize,
    retry: retry,
    logger: logger,
    partialUsingArguments: partialUsingArguments,
    getIdGeneratorFunction: getIdGeneratorFunction,
};

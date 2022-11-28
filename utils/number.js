/**
 * 按照区间生成随机数
 *
 * example: getRoundNumber(5, 15, 3)
 * return: [9, 6, 13]
 *
 * example: getRoundNumber(6, 20, 1)
 * return: 10
 *
 * @param {number} min 最小值 默认值 0
 * @param {number} max 最大值 默认值 1
 * @param {number} number 要生成几个随机数，默认生成1个
 * @returns {number|array} 生成的随机数 [min, max] 左闭右闭区间
 */
export const getRoundNumber = (min = 0, max = 1, number = 1) => {
    const tempMin = Math.ceil(min);
    const tempMax = Math.floor(max);
    const result = [];

    for (let i = 0; i < number; i++) {
        result.push(Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin);
    }

    return number === 1 ? result[0] : result;
}


/**
 * 格式化价格(每隔3位一个逗号)
 *
 * example: formatPrice(123456789)
 * return: '123,456,789'
 *
 * example: formatPrice(123456789, true)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.00, true)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.00)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.8)
 * return: '123,456,789.80'
 *
 * @param {number} price 价格
 * @param {number} decimal 是否需要小点两位; 如果价格已是小数，则此参数无效
 * @returns {string} 被格式化后的价格,例如 '123,456,789.00'
 */
export const formatPrice = (price, decimal = false ) => {
    const regExp = /\B(?=(\d{3})+(?!\d))/g;

    if (decimal || price.toString().includes('.')) {
        return price.toFixed(2).toString().replace(regExp, ',');
    }

    return price.toString().replace(regExp, ',');
}

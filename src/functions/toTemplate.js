module.exports = (str,obj) => {

    const a = str.split(/\$\{((?:\w|\.)+)\}/)

    for (let i = 1; i < a.length; i += 2) {

        const [objName,prop] = a[i].split('.')
        a[i] = obj[objName] ? obj[objName][prop] : `\${${a[i]}}`

    }

    return a.join('')

}
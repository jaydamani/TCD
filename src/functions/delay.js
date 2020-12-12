const delay = (func, ms,...argz) => {

    const limit = Math.pow(2,32)
    if(ms < limit) setTimeout(func,ms,...argz)
    else setTimeout(delay,limit,func,ms - limit,...argz)

}

module.exports = delay
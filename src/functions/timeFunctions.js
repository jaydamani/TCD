const units = {
	s :{
		amount : 1000,
		name : 'second'
	},
	m : {
		amount : 1000*60,
		name : 'minute'
	},
	h : {
		amount : 1000*60*60,
		name : 'hour'
	},
	d : {
		amount : 1000*60*60*24,
		name : 'day'
	},
	M : {
		amount : 1000*60*60*24*30,
		name : 'month'
	},
	y : {
		amount : 1000*60*60*24*30*12,
		name : 'year'
	}
}

const array = Object.values(units).sort((a,b) => a.amount - b.amount)

const time2MS = time => time.match(/[0-9]+[s,m,h,d,M,y]/g)
.reduce((a,b) => a + b.substring(0,b.length - 1)*units[b[b.length - 1]].amount,0)

const MS2String = t => {

    let string = ''

    for (const a in array) {

		if(t <= 1000) break
		let b = array[+a + 1] ? t % array[+a + 1].amount : t

		if(b != 0) string += ` ${b/array[a].amount} ${array[a].name}${b == 1 ? '' : 's'}` 
		t -= b

    }

    return string

}

module.exports = { time2MS, MS2String }
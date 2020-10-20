let baseFunction = require("../registry/structures/baseFunction")
let units = {
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
	w : {
		amount : 1000*60*60*24*4,
		name : 'week'
	},
	m : {
		amount : 1000*60*60*24*30,
		name : 'month'
	},
	y : {
		amount : 1000*60*60*24*30*12,
		name : 'year'
	}
}
let array = Object.values(units).sort((a,b) => a.amount - b.amount)

module.exports = function(timeArray){
	
	let t = 0
	let time
	let timeString = ''
	
	for(let time of timeArray){

		let unit = units[time[time.length - 1]]
		time = time.substring(0,time.length-1)
		t += time*unit.amount

	} 

	time = new Date((new Date).getTime + t)

	for (const a in array) {

		if(t <= 1000) break
		let b

		if(array[+a + 1]) b = t%units[+a + 1].amount
		else b = t
		
		timeString += ` ${b/array[a].amount} ${array[a].name}`
		t -= b
		
	}
	
	return { time ,timeString }

}
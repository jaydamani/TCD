let fs = require('fs')
let txt = fs.readFileSync('./test/input.txt').toString().split('): this;\n')
txt = txt.map(a => 'BaseEvent.'
+ a.slice('		public on(event: \''.length ,a.indexOf(', listener: ') - 1)
.replace("' | '"," | BaseEvent.")
.replace("' | '"," | BaseEvent."))
fs.writeFileSync('./test/output.txt',txt.join('\n | '))

#!/usr/bin/env node
//gain access to the core module "stream"
const {Readable, Writable, Transform } = require('stream');
const {createReadStream, writeFile} = require('fs');

//grab argument from console
let fileArg = process.argv[2];
let destArg = process.argv[3];

//create new instances of each of the stream classes below
const readStream = createReadStream(fileArg);
const writeStream = Writable();
const transformStream = Transform();

//define the inner methods

readStream.on('data', buffer => {
    readStream.pause();
    readStream.push(buffer);
    console.log('buffer', buffer.toString());
});
readStream.on('end', ()=> {
    readStream.push(null);
    console.log("end of read");
});


transformStream._transform = (buffer, encoding, done) => {
  done(null, `${buffer.toString().toUpperCase()}`)
}

writeStream._write = (buffer, _, done) => {
  writeFile(destArg, buffer, 'utf8', (err) =>{
    if (err) throw err;
  })
  process.stdout.write(`wrote to file`);
  done;
}



readStream.pipe(transformStream).pipe(writeStream);
// readStream.pipe(writeStream);

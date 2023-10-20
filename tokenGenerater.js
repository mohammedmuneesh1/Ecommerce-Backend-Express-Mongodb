const crypto = require('crypto');

// Generate a random 16-byte (128-bit) value
const randomValue = crypto.randomBytes(16);
console.log('Random Value:', randomValue.toString('hex'));

//this code for generating random number
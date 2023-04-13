const mongoose = require('mongoose');
const uri = process.env.DATABASE

async function main() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

main().catch(err => console.log(err));
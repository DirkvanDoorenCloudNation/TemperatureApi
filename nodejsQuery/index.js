"use strict";
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dirk:QQ65eKZzzYYq943O@sfax-sxjvq.mongodb.net?retryWrites=true&w=majority";
(async() =>{

    let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected");
    const database = client.db('sample_weatherdata');
    const collection = database.collection('data');
    let query =  {"position.coordinates.0": 34.7};
    try{
        const result  = await collection.find(query);
        let count = await result.count();
        let temperature = 0
        await result.forEach(i =>{
            temperature += i['airTemperature']['value']
        })        
        client.close()
        return (temperature/count);
    }
    catch(error){
        console.log(error);
        client.close()
    }
    
})()


        
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("sample_weatherdata").collection("data");
//   // perform actions on the collection object
//   collection.find({"position.coordinates.0": 34.7},function(err, result){
//       if(err) throw err;
//       console.log(result)
//   })
//   client.close();
// });


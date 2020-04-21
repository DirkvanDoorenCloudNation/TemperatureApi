"use strict";
const MongoClient = require('mongodb').MongoClient;
//  old username and old password in here
const uri = "mongodb+srv://dirk:QQ65eKZzzYYq943O@sfax-sxjvq.mongodb.net?retryWrites=true&w=majority"; 
(async() =>{

    let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected");
    const database = client.db('sample_weatherdata');
    const collection = database.collection('data');
    let query =  {"position.coordinates.0": 34.7,"position.coordinates.1": 10.8};
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


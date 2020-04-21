"use strict";
const MongoClient = require('mongodb').MongoClient;
let username = process.env.USERNAME
let password = process.env.password
const uri = "mongodb+srv://"+ username+ ":"+ password + "@sfax-sxjvq.mongodb.net?retryWrites=true&w=majority";


exports.handler = async (event, context) =>{
  context.callbackWaitsForEmptyEventLoop = false;
  let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("connected");
  const database = client.db('sample_weatherdata');
  const collection = database.collection('data');
  let query =  {
    "position.coordinates.0": 34.7, 
    "position.coordinates.1": 10.8, 
    "ts" : { $gte: { $date : 1559347200000} , $lte : { $date : 1561931999000}  } 
  };
  try{
      const result  = await collection.find(query);
      let count = await result.count();
      let temperature = 0;
      await result.forEach(i =>{
          temperature += i['airTemperature']['value'];
      });
      client.close();
      return {
        "statusCode": 200,
        "body": JSON.stringify(temperature/count)
      };
  }
  catch(error){
      client.close();
      return{
        "statusCode": 400,
        "body": JSON.stringify("bad request")
      }
      
  }
};
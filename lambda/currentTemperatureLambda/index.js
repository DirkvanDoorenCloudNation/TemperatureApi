const https = require('https');
const fs = require('fs');



exports.handler = async (event) => {
    let dataString = '';
    const options = {
      'method': 'GET',
      'hostname': 'api.openweathermap.org',
      'path': '/data/2.5/weather?q=Covilh%C3%A3&units=metric&appid=a0d3a63d3c00b3f5a1f27e567be85182', //Ideally you would get this appid from secretsmanager
      'maxRedirects': 20
    };
    const temperature = await new Promise((resolve, reject)=>{
        const req = https.get(options, function(res){
            res.on('data', chunk=>{
                dataString += chunk;
            });
            res.on('end', ()=>{
                const json = JSON.parse(dataString);
                console.log(json);
                console.log(json['dt']);
                let dateTime = json['dt'];
                const date = new Date(dateTime * 1000);
                console.log("this is the date ", date);
                console.log(json['main']);
                console.log(dataString);
                let response ={
                    "Temperature": json['main']['temp'],
                    "TimeOfMeasurement": date
                }
                resolve({
                    statusCode : 200,
                    body: JSON.stringify(response)
                });
            });
        });
        req.on('error', (e)=>{
            reject({
                statusCode: 400,
                body: JSON.stringify(e)
            });
        });
    });
    return temperature;
};

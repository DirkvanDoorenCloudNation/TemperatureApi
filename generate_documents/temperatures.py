from datetime import datetime
from datetime import timedelta
import copy
import json
import bson
import uuid
#looked up the coordinates
coordinates = [34.7,10.8]
#looked up temperatures in sfax in june 2019  #source https://www.tameteo.com/tunisie/sfax/historique
temperatures = [
    20,
    20,
    22,
    23,
    28,
    26,
    26,
    29,
    29,
    28,
    28,
    26,
    25,
    27,
    27,
    27,
    26,
    25,
    25,
    26,
    28,
    29,
    31,
    33,
    29,
    29,
    27,
    29,
    30,
    28
]
#hardcoded date
formatdate = "{}-06-2019"
# get a template to fill out
with open("./template.json") as file:
    template = json.load(file)

template_array = []
for i in range(len(temperatures)):
    # to match the date format 01,02,03 etc
    if i<9:
        stringdate = formatdate.format(f"0{i+1}") 
    else: 
        stringdate = formatdate.format(i+1)
    date = datetime.strptime(stringdate, "%d-%m-%Y")
    #correct for timezone
    date_no_tz = date + timedelta(hours=2)
    timestamp = int(str(datetime.timestamp(date_no_tz)).split(".")[0])*1000
    # fill out the template with manditory data objectid, lon,lat, timestamp and temperature measurement.
    template['_id'] = {'$oid': str(bson.objectid.ObjectId())}
    template['position']['coordinates'][0] = {'$numberDouble': str(coordinates[0])}
    template['position']['coordinates'][1] = {'$numberDouble': str(coordinates[1])}
    template['ts'] = {'$date': {'$numberLong': str(timestamp)}}
    template['airTemperature'] = {'value': {'$numberDouble': str(temperatures[i])}, 'quality': '1'}
    template_array.append(copy.deepcopy(template))
    # write to an output file. 
    # (lesson learned. next time make an array and write that to file, upload allows for multiple uploads in the form of array)
    # with open(f"{formatdate.format(i+1)}.json", "w+") as file:
    #     json.dump(template, file)

# for the comparison of datetime. not necessary anymore, nodejs uses Date('')
# max_time = '30-06-2019 23:59:59'
# min_time = '01-06-2019 00:00:00'
# max_date = datetime.strptime(max_time, "%d-%m-%Y %H:%M:%S")  + timedelta(hours=2)
# min_date = datetime.strptime(min_time, "%d-%m-%Y %H:%M:%S")  + timedelta(hours=2)
# min_timestamp = int(str(datetime.timestamp(min_date)).split(".")[0])*1000
# max_timestamp = int(str(datetime.timestamp(max_date)).split(".")[0])*1000
# print(min_timestamp)
# print(max_timestamp)
# use in query gte 1559347200000 lte 1561939199000

with open("total.json", "w+") as file:
    json.dump(template_array, file)
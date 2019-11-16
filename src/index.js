const checks = require('./checks');
const mqtt = require('mqtt');
const needle = require('needle');

if(!checks.check_environment()) {
    console.log('startup failed');
    process.exit(1);
}

let messages_received = 0;
let messages_sent = 0;

let mqtt_client = mqtt.connect(process.env.MQTT_URL);
mqtt_client.on('connect', () => {
    console.log('MQTT connected');
    Object.keys(process.env).filter(t=>t.match(/MQTT_TOPIC/)).forEach(t => {
        console.log(`subcribed to ${process.env[t].replace("*","#")}`)
        mqtt_client.subscribe(process.env[t].replace("*","#"));
    })
})
mqtt_client.on('error',(err) => {
    console.error(err);
    process.exit(2);
})

let messages = []
mqtt_client.on('message', (topic,msg) => {
    messages_received++;
    if(!process.env.BATCH) {
        send_to_splunk([{_time: new Date().getTime(),topic:topic,msg:msg}]);
    } else {

    }
});

let batch = () => {
    if(messages.length<1) return;
    let data = [];

    let batch=process.env.BATCH||100;
    while(batch>0 && messages.length>0) {
        batch--;
        data.push(messages.shift());
    }

    console.log(data.length);
    send_to_splunk(data);
}

setInterval(batch,1000);

let http_pending=0;
let send_to_splunk = (data) => {
    let _data = "";
    data.forEach(d => _data =+ JSON.stringify({
        _time: data._time,
        sourcetype: process.env.SPLUNK_SOURCETYPE||'mqtt2splunk',
        event: {
            topic: data.topic,
            message:data.msg
        }
    })+"\r\n");

    http_pending++;
    needle.post(
        process.env.SPLUNK_URL+'/services/collector/event',
        _data,
        {
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Splunk '+process.env.SPLUNK_TOKEN
            }
        },
        (err,res) => {
            http_pending--;
            if(err) {
                messages.unshift(data)
                return console.err(err);
            }
            // console.log('sent '+data.length+' events');
            messages_sent += data.length;
        }
    );
}

process.on('SIGINT', () => {
    mqtt_client.end();
    console.log('terminating...')
    setInterval(() => {
        if(http_pending>0) return;
        console.log(`received ${messages_received} and sent ${messages_sent} with ${messages.length} pending`);
        process.exit(0);
    },100)
})
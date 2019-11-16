module.exports = {
    check_environment: () => {
        let result=true;

        if(!process.env.MQTT_URL) {
            result=false;
            console.warn('Missing $MQTT_URL [mqtts://user:pass@broker/]');
        }

        if(!process.env.SPLUNK_URL) {
            result=false;
            console.warn('Missing $SPLUNK_URL [https://splunk:8088]');
        }

        if(!process.env.SPLUNK_TOKEN) {
            //d451c3db-a823-4616-a7d9-dc7e36d040fc
            result=false;
            console.warn('Missing $SPLUNK_TOKEN');
        }

        if(Object.keys(process.env).filter(k=>k.match(/^MQTT_TOPIC/)).length<1) {
            result=false;
            console.warn('Missing $MQTT_TOPIC* [MQTT_TOPIC_1=#, MQTT_TOPIC=some/topic]');
        }
        return result;
    }
}
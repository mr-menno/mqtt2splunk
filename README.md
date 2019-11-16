Simple MQTT to Splunk HTTP Event Collector (HEC)

Required environment variables:
 * `MQTT_URL` - example: mqtt://user:pass@broker
 * `SPLUNK_URL` - examples: https://hec.example.com
 * `SPLUNK_TOKEN` - obtained by creating an HEC input

 One or more MQTT topics defined through environment variables:
  * `MQTT_TOPIC`=topic/to/subscribe
  * `MQTT_TOPIC_1`=topic/one
  * `MQTT_TOPIC_2`=topic/two

For topics, use either `+` for a single level, or `#` for a wildcard.  Since some configuration files do not support wildcards, you can use `*` instead.



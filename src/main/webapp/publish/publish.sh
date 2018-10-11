#!/bin/bash

rm -f ../mayonnaise-min.js

java -jar yuicompressor-2.4.2.jar mayonnaise.js -o mayonnaise-min.js --charset utf-8

mv mayonnaise-min.js ../mayonnaise-min.js
rm -f mayonnaise.js

rm -f ../plugin/animate-min.js
java -jar yuicompressor-2.4.2.jar ../plugin/animate.js -o ../plugin/animate-min.js --charset utf-8
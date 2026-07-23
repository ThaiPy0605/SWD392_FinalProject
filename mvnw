#!/bin/sh
# ----------------------------------------------------------------------------
# Maven Start Up Batch script
# ----------------------------------------------------------------------------

if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME="/C/Program Files/Android/openjdk/jdk-21.0.8"
fi

exec "$JAVA_HOME/bin/java" -jar ".mvn/wrapper/maven-wrapper.jar" "$@"

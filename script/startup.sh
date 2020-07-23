echo "Stopping generator-1.0.0-SNAPSHOT.jar"
pid=`ps -ef | grep generator-1.0.0-SNAPSHOT.jar | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
   echo "kill -9 的id:" $pid
   kill -9 $pid
fi
nohup java -jar -Xms128m -Xmx128m generator-1.0.0-SNAPSHOT.jar &


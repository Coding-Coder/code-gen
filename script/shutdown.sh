echo "Stopping gen-1.0.1-SNAPSHOT.jar"
pid=`ps -ef | grep gen-1.0.1-SNAPSHOT.jar | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
   echo "kill -9 的id:" $pid
   kill -9 $pid
fi


echo "Stopping gen.jar"
pid=`ps -ef | grep gen.jar | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
   echo "stop pid:" $pid
   kill -9 $pid
fi


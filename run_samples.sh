#!/bin/sh
set -e

echo "---JavaScript Starting---"
cd javascript
for api in gift_certificate order do
	for i in $api/*.js; do
		[ -f "$i" ] || break
		echo $i
		NODE_TLS_REJECT_UNAUTHORIZED=0 node $i
	done
done
cd ..
echo "---JavaScript Finished---"
exit 1


echo "---PHP Starting---"
cd php 
for api in gift_certificate order do
	cd $api
	for i in /*.php; do
		[ -f "$i" ] || break
		echo $i
		php $i
	done
	cd ..
done
cd ..
echo "---PHP Finished---"


echo "---Python Starting---"
cd python
for api in gift_certificate order do
	for i in $api/*.py; do
		[ -f "$i" ] || break
		echo $i
		PYTHONPATH=. venv/Scripts/python.exe $i
	done
done
cd ..
echo "---Python Finished---"



echo "---Ruby Starting---"
cd ruby 
for api in gift_certificate order do
	for i in $api/*.rb; do
		[ -f "$i" ] || break
		echo $i
		ruby $i
	done
done
cd ..
echo "---Ruby Finished---"



echo "---Typescript Starting---"
cd typescript
# compile all the typescript and then run the js files found.
tsc
for api in gift_certificate order do
	for i in $api/*.js; do
		[ -f "$i" ] || break
		echo $i
		NODE_TLS_REJECT_UNAUTHORIZED=0 node $i
	done
done
cd ..
echo "---Typescript Finished---"



echo "---C# Starting---"
cd csharp
/c/Program\ Files\ \(x86\)/Microsoft\ Visual\ Studio/2019/Community/MSBuild/Current/Bin/MSBuild.exe SDKSample.csproj -property:Configuration=Debug
bin/Debug/SdkSample.exe
cd ..
echo "---C# Finished---"



echo "---Java Starting---"
cd java 
mvn package
java -jar target/sdk_samples-1.0-SNAPSHOT.jar
cd ..
echo "---Java Finished---"




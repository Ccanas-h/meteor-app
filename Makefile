export
commandlinetools_version=9123335
ANDROID_HOME=/usr/share/android-sdk2

install i:
	sudo apt install openjdk-17-jdk-headless
	sudo npm install -g @ionic/cli
	sudo n 16.14

install-capacitor icap:
	sudo apt install openjdk-17-jdk-headless
	npm i @capacitor/android
	ionic integrations enable capacitor

run rf:
	ionic serve --port 4400 --external

run-android-capacitor ra:
	ionic cap run android

#ionic cap add android
capacitor-sync-android sa:
	ionic capacitor sync android

#npx cap open android O desde android studio
#Esto previo a hacer la apk
for-apk apk:
	ionic build
	ionic capacitor build android



build b:
	export ANDROID_HOME=/usr/share/android-sdk2/ && ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..

android-sdk2:
	wget https://dl.google.com/android/repository/commandlinetools-linux-$(commandlinetools_version)_latest.zip -P ~/
	sudo unzip ~/commandlinetools-linux-$(commandlinetools_version)_latest.zip -d ~/
	sudo mkdir -p /usr/share/android-sdk2/cmdline-tools/latest
	sudo mv ~/cmdline-tools/* /usr/share/android-sdk2/cmdline-tools/latest
	sudo ln -nsf /usr/share/android-sdk2/cmdline-tools/latest/bin/sdkmanager /usr/bin/sdkmanager
	sdkmanager --update
	yes | sdkmanager --licenses
	yes | sudo sdkmanager "platforms;android-33" "build-tools;30.0.3" "build-tools;33.0.2"
	sudo ln -nsf /usr/share/android-sdk2/platform-tools/adb /usr/bin/adb
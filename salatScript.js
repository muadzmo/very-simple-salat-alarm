const alarmSound = new Audio("Rooster-Crowing-SoundBible.com.mp3");
    let offAlarm = 0;
    let latitude = "";
    let longitude = "";
    const displayTurnOffButton = document.getElementById("turnAlarmOff").style.display;

    document.getElementById("turnAlarmOff").addEventListener("click", function(){
        alarmSound.pause();
        offAlarm = 1;
        displayTurnOffButton = "none";
    })

    function setTime(){
        const todayDate = new Date(Date.now());
        const nowTime = new Date().toLocaleTimeString('en-GB', { 
            hour: "numeric", 
            minute: "numeric"});
            
        if(typeof nearestTime === 'undefined'){
            nearestTime = currentTime = '00:00';
            sholatTime = currentSholatTime = 'Imsak';
        }            
        
        if(nearestTime < nowTime){
            const listJadwalSholat = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];

            const xhr = new XMLHttpRequest(),
            method = "GET",
            // url = `https://api.pray.zone/v2/times/day.json?city=south-tangerang&date=${todayDate.toISOString().substr(0,10)}`;
            url = `https://api.pray.zone/v2/times/day.json?latitude=${latitude}&longitude=${longitude}&date=${todayDate.toISOString().substr(0,10)}`;
            xhr.open(method, url, true);
            xhr.onreadystatechange = function () {
            // In local files, status is 0 upon success in Mozilla Firefox
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    const jadwalSholat = JSON.parse(xhr.responseText);
                    for(h=0;jadwalSholat.results.datetime[0].times.length;h++){
                        console.log(jadwalSholat.results.datetime[0].times[h]);
                    }
                    const arrJadwalSholat = [
                        jadwalSholat.results.datetime[0].times.Fajr,
                        jadwalSholat.results.datetime[0].times.Dhuhr,
                        jadwalSholat.results.datetime[0].times.Asr,
                        jadwalSholat.results.datetime[0].times.Maghrib,
                        jadwalSholat.results.datetime[0].times.Isha,];
                    for(i=0;i<arrJadwalSholat.length;i++){
                        if(nowTime < arrJadwalSholat[i]){
                            nearestTime = arrJadwalSholat[i];
                            currentTime = arrJadwalSholat[i-1];
                            sholatTime = listJadwalSholat[i];
                            currentSholatTime = listJadwalSholat[i-1];
                            offAlarm = 0;
                            return;
                        }
                    }
                } else {
                // Oh no! There has been an error with the request!
                }
            }
            };
            xhr.send();
        }
        
        if(nowTime === nearestTime && offAlarm === 0){
            alarmSound.play();
            displayTurnOffButton = "block";
        }

        if(nowTime !== nearestTime && displayTurnOffButton !== "none" ){
            displayTurnOffButton = "none";
        }

        document.getElementById("wadaw").innerHTML = `${todayDate.toISOString().substr(0,10)} ${nowTime} <br> 
        waktu solat sekarang adalah:  ${currentSholatTime} pukul ${currentTime} <br>
        waktu solat yang akan datang adalah: ${sholatTime} pukul ${nearestTime}`;

        setTimeout(setTime,1000);
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        setTime()
    }

    getLocation();

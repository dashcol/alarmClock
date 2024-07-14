// Array for days
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];



// Function for getting the current date
function getCurrentDate() {
  const date = new Date();
  return {
    day: date.getDay(),
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}



// Function to update time on the clock every second
function updateTime() {
  const { day, date, month, year, hours, minutes, seconds } = getCurrentDate();
  document.getElementsByClassName("date-number")[0].textContent = date;
  document.querySelector(".day").textContent = days[(day + 6) % 7];
  document.querySelector(".dateWithyear").textContent = `${date}/${
    month + 1
  }/${year}`;
  document.querySelector(".time-boxes").textContent = hours;
  document.querySelector(".time-boxes2").textContent = minutes;
  document.querySelector(".time-boxes3").textContent = seconds;
}



// Object for storing selected hours and interval reference
let alarmConfig = {};
let alarmAudio;
let alarmInterval;



// Function to check and ring the alarm
function checkAlarm() {
  const checkBOx = document.querySelector("#checkboxInput");
  const { hours, minutes, seconds, day } = getCurrentDate();
  const selectedDays = alarmConfig.selectedDays.map((d) => d.toLowerCase());
  const currentDay =  days[(day + 6) % 7].toLowerCase();

  if (
    alarmConfig.selectedHour === hours &&
    alarmConfig.selectedMin === minutes &&
    alarmConfig.selectedSec === seconds &&
    selectedDays.includes(currentDay) &&
    checkBOx.checked
  ) {
    playAlarm();
  } else if (!checkBOx.checked) {
    stopAlarm();
  }
}

// Function to play the alarm sound
function playAlarm() {
  if (alarmAudio) return;

  alarmAudio = new Audio("mixkit-rooster-crowing-in-the-morning-2462.wav");
  alarmAudio.play();
  alarmAudio.loop = true;

  const stopAlarmButton = document.querySelector(".stopAlarm");
  stopAlarmButton.style.display = "inline-block";
  stopAlarmButton.addEventListener("click", stopAlarm, { once: true });
}



// Function to stop the alarm
function stopAlarm() {
  alert(`Alarm Turned Off`);
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmAudio = null;
  }
  clearInterval(alarmInterval);

  const stopAlarmButton = document.querySelector(".stopAlarm");
  stopAlarmButton.style.display = "none";
  // alarmTime.style.display="none";

  const selectedDays = alarmConfig.selectedDays;
  const daysList = document.querySelectorAll("li.days");
  daysList.forEach((dayElement) => {
    if (selectedDays.includes(dayElement.textContent)) {
      dayElement.style.color = "black";
    }
  });
  const checkBOx = document.querySelector("#checkboxInput");
  checkBOx.checked = false;
}



// Function to set time options for the alarm
function setTimeOptions() {
  let hourOptions = "";
  let minAndSecOpts = "";

  for (let i = 0; i < 24; i++) {
    hourOptions += `<option>${i}</option>`;
  }

  for (let i = 0; i < 60; i++) {
    minAndSecOpts += `<option>${i}</option>`;
  }

  document.querySelector(
    ".box1"
  ).innerHTML = `<select class="select1">${hourOptions}</select>`;
  document.querySelector(
    ".box2"
  ).innerHTML = `<select class="select2">${minAndSecOpts}</select>`;
  document.querySelector(
    ".box3"
  ).innerHTML = `<select class="select3">${minAndSecOpts}</select>`;
}



// Function to set the alarm as requested by the user
function setAlarm() {
  const hourSelect = document.querySelector(".select1");
  const minSelect = document.querySelector(".select2");
  const secSelect = document.querySelector(".select3");
  const button = document.getElementsByClassName("setButton")[0];

  button.addEventListener("click", () => {
    const selectedHour = parseInt(hourSelect.value);
    const selectedMin = parseInt(minSelect.value);
    const selectedSec = parseInt(secSelect.value);

    alarmConfig.selectedHour = selectedHour;
    alarmConfig.selectedMin = selectedMin;
    alarmConfig.selectedSec = selectedSec;

    const { hours, minutes, seconds } = getCurrentDate();
    let remainingHours = selectedHour - hours;
    let remainingMinutes =
      selectedMin >= minutes
        ? selectedMin - minutes
        : 60 + (selectedMin - minutes);
    if (selectedMin < minutes) {
      remainingHours--;
    }
    if (alarmConfig.selectedDays.length === 0) {
      alert(`Please Select a Day`);
    }

    else if (remainingHours === 0 && remainingMinutes === 0) {
      alert(`Please Select Time`);
    
    }
    else if (alarmConfig.selectedDays.length !== 0) {
      alert(
        `Alarm has been set for ${remainingHours} hours and ${remainingMinutes} minutes from now.`
      );
      const alarmTime = document.querySelector(".alarmSet");
      alarmTime.style.display = "flex";
      alarmTime.innerHTML = `<h4>Alarm</h4>
       <span class="selectedHour">${selectedHour}:${selectedMin}</span>
        <input type="checkbox" name="checkbox" id="checkboxInput" checked> 
          <label for="checkboxInput" class="toggleSwitch">
          </label>`;
  
      const checkBOx = document.querySelector("#checkboxInput");
      if (checkBOx.value === "on") {
        alarmInterval = setInterval(checkAlarm, 1000);
      }
    }
    else{
      alert(`Please Select a Day`);
    }
 
  });



  // Pushing selected days in an array to user selected days
  const daysList = document.querySelectorAll("li.days");
  alarmConfig.selectedDays = [];

  daysList.forEach((day) => {
    day.addEventListener("click", function () {
      day.style.color = "white";
      if (!alarmConfig.selectedDays.includes(day.textContent)) {
        alarmConfig.selectedDays.push(day.textContent);
      }
    });
  });
}



// Initial function calls
setTimeOptions();
setAlarm();
setInterval(updateTime, 1000);

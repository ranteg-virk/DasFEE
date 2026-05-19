const calendar =
document.getElementById("calendar");

const monthYear =
document.getElementById("monthYear");

const prevMonth =
document.getElementById("prevMonth");

const nextMonth =
document.getElementById("nextMonth");

const popup =
document.getElementById("popup");

const numbers =
document.getElementById("numbers");

const closeBtn =
document.getElementById("closeBtn");

const insightBtn =
document.getElementById("insightBtn");

const chartPopup =
document.getElementById("chartPopup");

const closeChart =
document.getElementById("closeChart");

let currentDate =
new Date();

let selectedDate = "";

let ratings =
JSON.parse(localStorage.getItem("ratings")) || {};

let chart;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"];

// Render Calendar
function renderCalendar(){
  calendar.innerHTML = "";
  let year =
  currentDate.getFullYear();
  let month =
  currentDate.getMonth();
  monthYear.innerText =
  `${monthNames[month]} ${year}`;
  let firstDay =
  new Date(year, month, 1).getDay();
  let totalDays =
  new Date(year, month + 1, 0).getDate();


  // Empty Days
  for(let i = 0; i < firstDay; i++){
    let empty =
    document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);}

  // Days
  for(let day = 1; day <= totalDays; day++){
    let dayBox =
    document.createElement("div");
    dayBox.classList.add("day");
    let dateKey =
    `${year}-${month + 1}-${day}`;
    let savedRating =
    ratings[dateKey] || "";
    dayBox.innerHTML = `
      <div class="dayNumber">
        ${day}
      </div>

      <div class="rating">
        ${savedRating}
      </div>`;

    // Click Day
    dayBox.addEventListener("click",
    function(){
      selectedDate = dateKey;
      popup.style.display = "flex";
    });

    calendar.appendChild(dayBox);
  }
}

// Create Rating Buttons
for(let i = 1; i <= 10; i++){
  let btn =
  document.createElement("button");
  btn.innerText = i;
  btn.classList.add("numberBtn");
  btn.addEventListener("click",
  function(){
    ratings[selectedDate] = i;
    localStorage.setItem(
      "ratings",
      JSON.stringify(ratings)
    );
    popup.style.display = "none";
    renderCalendar();
    updateChart();
  });
  numbers.appendChild(btn);}

// to Close rating popup
closeBtn.addEventListener("click",
function(){
  popup.style.display = "none";});

// for previous Month
prevMonth.addEventListener("click",
function(){
  currentDate.setMonth(
    currentDate.getMonth() - 1);
  renderCalendar();});

// for next Month
nextMonth.addEventListener("click",
function(){
  currentDate.setMonth(
    currentDate.getMonth() + 1);
  renderCalendar();
});

// to open insight chart
insightBtn.addEventListener("click",
function(){
  chartPopup.style.display = "flex";
  updateChart();
});

// to close insight chart
closeChart.addEventListener("click",
function(){
  chartPopup.style.display = "none";
});

// to update insight chart with data 
function updateChart(){
  let labels = [];
  let values = [];
  let currentMonth =
  currentDate.getMonth() + 1;
  let currentYear =
  currentDate.getFullYear();

  for(let date in ratings){
    let parts =
    date.split("-");
    let year =
    Number(parts[0]);
    let month =
    Number(parts[1]);
    let day =
    Number(parts[2]);

    if(
      year === currentYear &&
      month === currentMonth)
      {
      labels.push(day);
      values.push(ratings[date]);}}


  // to sort month days to productivity rating
  let combined = [];
  for(let i = 0; i < labels.length; i++){
    combined.push({
      day:labels[i],
      value:values[i]
    });}

  combined.sort(function(a,b){
    return a.day - b.day;
  });

  labels = [];
  values = [];
  combined.forEach(function(item){
    labels.push(item.day);
    values.push(item.value);
  });

  // to Remove Old Chart on insights as we change on month
  if(chart){
    chart.destroy();}
  let ctx =
  document.getElementById("ratingChart");
  chart = new Chart(ctx, {
    type:"line", //bar type
    data:{
      labels:labels,
      datasets:[{
        label:"Monthly Ratings",
        data:values,
        borderWidth:3,
        tension:0.3}]},

    options:{
      responsive:true,
      scales:{
        y:{min:0,max:10}}}
  });
}

// for rendering 
renderCalendar();

const today=new Date().toISOString().split("T")[0];

let data=JSON.parse(localStorage.getItem("mygoals"))||{
workouts:{},
calories:{},
weights:[]
};

function save(){localStorage.setItem("mygoals",JSON.stringify(data));}

function showSection(id){
document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");
updateDashboard();
}

/* Dashboard */
function updateDashboard(){
let todayCalories=(data.calories[today]||[]).reduce((a,b)=>a+b.amount,0);
document.getElementById("dashCalories").innerText="Today's Calories: "+todayCalories;

let todayWorkout=(data.workouts[today]||[]).length;
document.getElementById("dashWorkout").innerText="Exercises Logged: "+todayWorkout;

let lastWeight=data.weights[data.weights.length-1]||"N/A";
document.getElementById("dashWeight").innerText="Latest Weight: "+lastWeight;
}

/* Calories */
function addCalorie(){
let date=document.getElementById("calorieDate").value||today;
if(!data.calories[date]) data.calories[date]=[];
data.calories[date].push({
food:foodName.value,
amount:parseInt(calorieAmount.value)
});
save();
renderCalories(date);
}

function renderCalories(date=today){
let list=document.getElementById("calorieList");
list.innerHTML="";
let total=0;
(data.calories[date]||[]).forEach(c=>{
total+=c.amount;
let p=document.createElement("p");
p.textContent=c.food+" - "+c.amount+" cal";
list.appendChild(p);
});
document.getElementById("calorieTotal").innerText="Total: "+total;
}

/* Weight */
function addWeight(){
data.weights.push(parseFloat(weightInput.value));
save();
renderWeight();
}

function renderWeight(){
let list=document.getElementById("weightHistory");
list.innerHTML="";
data.weights.forEach(w=>{
let li=document.createElement("li");
li.textContent=w+" kg";
list.appendChild(li);
});
new Chart(weightChart,{
type:"line",
data:{labels:data.weights.map((_,i)=>i+1),
datasets:[{data:data.weights,borderColor:"#e0e0e0"}]},
options:{plugins:{legend:{display:false}}}
});
}

/* BMI */
function calculateBMI(){
let h=height.value/100;
let w=bmiWeight.value;
let bmi=(w/(h*h)).toFixed(2);
let cat=bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
bmiResult.innerText="BMI: "+bmi+" ("+cat+")";
}

/* Export */
function exportData(){
let blob=new Blob([JSON.stringify(data)],{type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="mygoals-backup.json";
a.click();
}

updateDashboard();
renderCalories();
renderWeight();

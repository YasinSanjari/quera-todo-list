const now = moment().locale('fa').format('dddd، D MMMM YYYY');  

document.getElementById('jalali-date').textContent = now;
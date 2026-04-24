const API = "http://127.0.0.1:3000"; 


function isValid(data) {
  return Array.isArray(data) && data.length > 0;
}


function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  if (!element) return;

  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;

    const progress = currentTime - startTime;
    let value = start + (end - start) * (progress / duration);

    if (progress >= duration) value = end;

    element.innerText = `₹${value.toFixed(2)}`;

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}


fetch(`${API}/expenses`)
  .then(res => res.json())
  .then(data => {

    console.log("DATA:", data);

    if (!isValid(data)) {
      document.getElementById("insight").innerText =
        "No expenses yet 👀 Start adding data first!";
      return;
    }

    
    let total = data.reduce((sum, exp) => sum + Number(exp.amount), 0);

    animateValue("totalCard", 0, total, 1000);

    let categoryMap = {};

    data.forEach(exp => {
      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + Number(exp.amount);
    });

   
    let avg = total / data.length;
    animateValue("avgCard", 0, avg, 1000);

   
    let maxCategory = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b
    );

    document.getElementById("topCategory").innerText = maxCategory;

   
    if (window.pieChart && typeof window.pieChart.destroy === "function") {
  window.pieChart.destroy();
}


    const pieCtx = document.getElementById("pieChart");

    if (pieCtx) {
      window.pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: Object.keys(categoryMap),
          datasets: [{
            data: Object.values(categoryMap),
            backgroundColor: [
              "#ff7675",
              "#74b9ff",
              "#fd79a8",
              "#55efc4",
              "#ffeaa7"
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

   
    let dateMap = {};

    data.forEach(exp => {
      let date = new Date(exp.date).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + Number(exp.amount);
    });

    let sortedDates = Object.keys(dateMap).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    let sortedValues = sortedDates.map(d => dateMap[d]);

 
    if (window.barChart && typeof window.barChart.destroy === "function") {
  window.barChart.destroy();
}

    const barCtx = document.getElementById("barChart");

    if (barCtx) {
      window.barChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: sortedDates,
          datasets: [{
            label: "Daily Spending",
            data: sortedValues,
            backgroundColor: "#684430"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    
    let insight = `👀 You spend most on ${maxCategory}.`;

    if (total > 5000) {
      insight += " You're burning money 🔥";
    } else if (total < 1000) {
      insight += " You're super disciplined 😎";
    } else {
      insight += " Keep tracking like a pro 💪";
    }

    document.getElementById("insight").innerText = insight;

  })
  .catch(err => {
    console.error("Analytics error:", err);
    document.getElementById("insight").innerText =
      "Failed to load analytics ❌ Check backend";
  });
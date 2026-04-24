const API = "http://127.0.0.1:3000"; // ✅ FIXED

function addExpenses() {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!amount || !category) {
    alert("Fill all fields ❌");
    return;
  }

  fetch(`${API}/expenses`, {   // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: category,   // backend expects title
      amount,
      category
    })
  })
  .then(() => {
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    loadExpenses();
  });
}

function loadExpenses() {
  fetch(`${API}/expenses`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("expenseList");
      list.innerHTML = "";

      data.forEach(exp => {
        const li = document.createElement("li");

        li.innerHTML = `
          ${exp.category} - ₹${exp.amount}
          <button onclick="deleteExpense('${exp._id}')">❌</button>
          
        `;

        list.appendChild(li);
      });
    });
}

function deleteExpense(id) {
  fetch(`${API}/expenses/${id}`, {   // ✅ FIXED
    method: "DELETE"
  }).then(loadExpenses);
}

window.onload = loadExpenses;
console.log("Expenditure script loaded");

// Import required modules
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import Chart from "chart.js/auto";
import app from "./firebaseConfig";

// Get the Firebase database instance
const database = getDatabase(app);

// Retrieve savings and expenses data from Firebase
function retrieveData() {
  const dataRef = ref(database, 'financialData');
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    updateChart(data);
  });
}

// Update the pie chart with new data
function updateChart(data) {
  const savings = data?.savings || 0;
  const expenses = data?.expenses || 0;

  const ctx = document.getElementById("pieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Savings", "Expenses"],
      datasets: [
        {
          data: [savings, expenses],
          backgroundColor: ["#34D399", "#F87171"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Add savings or expenses to the Firebase database
function addData(type) {
  const dataRef = ref(database, 'financialData');
  runTransaction(dataRef, (currentData) => {
    const currentSavings = currentData ? currentData.savings || 0 : 0;
    const currentExpenses = currentData ? currentData.expenses || 0 : 0;

    if (type === "savings") {
      currentData = { savings: currentSavings + 1, expenses: currentExpenses };
    } else if (type === "expenses") {
      currentData = { savings: currentSavings, expenses: currentExpenses + 1 };
    }

    return currentData;
  });
}

// Attach event listeners to the buttons
document.getElementById("addSavingsBtn").addEventListener("click", () => {
  addData("savings");
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  addData("expenses");
});

// Retrieve initial data and update the chart
retrieveData();

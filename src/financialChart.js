import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Chart from "chart.js/auto";
import app from "./firebaseConfig";
import Hammer from "hammerjs";

// Get the Firebase database instance
const auth = getAuth(app);
const database = getDatabase(app);

// Variable to store the chart instance
let chartInstance = null;

// Retrieve savings and expenses data from Firebase
function retrieveData() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const dataRef = ref(database, `users/${uid}/financialData`);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        updateChart(data);
      });
    }
  })
}

// Update the pie chart with new data
function updateChart(data) {
  const savings = data?.savings || 0;
  const expenses = data?.expenses || 0;

  const totalMoney = document.getElementById("totalMoney");
  const totalSavings = document.getElementById("totalSavings");
  const totalExpenses = document.getElementById("totalExpenses");

  const ctx = document.getElementById("pieChart").getContext("2d");

  // Calculate percentage of savings and expenses
  const total = savings + expenses;
  const savingsPercentage = (savings / total) * 100;
  const expensesPercentage = (expenses / total) * 100;

  totalMoney.textContent = `Total: $${total}`;
  totalSavings.textContent = `Savings: $${savings}`;
  totalExpenses.textContent = `Expenses: $${expenses}`;

  // Destroy the chart if it already exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Savings", "Expenses"],
      datasets: [
        {
          data: [savingsPercentage, expensesPercentage],
          backgroundColor: ["#34D399", "#F87171"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const labelIndex = context.dataIndex;
              const dataValue = context.raw;
              return `${dataValue}%`;
            },
          },
        },
      },
    },
  });
}

// Update savings and expenses in Firebase
function updateData(savings, expenses) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      runTransaction(ref(database, `users/${uid}/financialData`), (data) => {
        if (!data) {
          data = {
            savings: 0,
            expenses: 0,
          };
        }

        data.savings += savings;
        data.expenses += expenses;

        return data;
      })
    }
  })
}

// Add event listeners to the buttons
// document.getElementById("addExpenseBtn").addEventListener("click", () => {
//   const expense = parseInt(prompt("Enter expense amount:") || 0);
//   updateData(0, expense);
// });

// document.getElementById("addSavingsBtn").addEventListener("click", () => {
//   const savings = parseInt(prompt("Enter savings amount:") || 0);
//   updateData(savings, 0);
// });

// // Retrieve initial data and update the chart
// retrieveData();

function showBottomSheet() {
  const bottomSheet = document.getElementById("bottomSheet");
  bottomSheet.classList.remove("hidden");
}

// Hide the bottom sheet
function hideBottomSheet() {
  const bottomSheet = document.getElementById("bottomSheet");
  bottomSheet.classList.add("hidden");
}

// Initialize Hammer.js for swipe gestures
const bottomSheetElement = document.getElementById("bottomSheet");
const hammer = new Hammer(bottomSheetElement);

hammer.on("swipe", (event) => {
  if (event.direction === Hammer.DIRECTION_DOWN) {
    hideBottomSheet();
  }
});

// Add event listener to the "Add" button
document.getElementById("addButton").addEventListener("click", () => {
  showBottomSheet();
});

// Add event listeners to the buttons
document.getElementById("addExpenseBtn").addEventListener("click", () => {
  const expense = parseInt(document.getElementById("amountInput").value || 0);
  updateData(0, expense);
  hideBottomSheet();
});

document.getElementById("addSavingsBtn").addEventListener("click", () => {
  const savings = parseInt(document.getElementById("amountInput").value || 0);
  updateData(savings, 0);
  hideBottomSheet();
});

// Retrieve initial data and update the chart
retrieveData();
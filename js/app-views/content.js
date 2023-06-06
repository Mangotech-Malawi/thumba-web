export const content_view = [
  //Clients
  {
    title: "Dashboard",
    state: "admin_dashboard",
    link: "views/dashboards/admin.html",
    modals: ["views/modals/user.html"]
  },
  {
    title: "Dashboard",
    state: "investor_dashboard",
    link: "views/dashboards/investor.html",
    modals: ["views/modals/user.html"]
  },
  {
    title: "Individuals",
    link: "views/clients/individuals.html",
    modals: ["views/modals/client.html", "views/modals/user.html"],
    state: "individual",
  },
  {
    title: "Organizations",
    link: "views/clients/organizations.html",
    modals: ["views/modals/user.html","views/modals/client.html"],
    state: "organization",
  },
  {
    title: "Interests",
    link: "views/interests.html",
    modals: ["views/modals/user.html",
            "views/modals/interest.html"],
    state: "interests",
  },
  {
    title: "Applications",
    link: "views/loans/applications.html",
    state: "applications",
    modals: ["views/modals/user.html","views/modals/loans.html"]
  },
  {
    title: "Loan Payments",
    link: "views/loans/loan_payments.html",
    modals: ["views/modals/user.html","views/modals/loan_payments.html"],
    state: "loan_payments",
  },
  {
    title: "Loans",
    link: "views/loans/loans.html",
    modals: ["views/modals/user.html","views/modals/loan_payments.html"],
    state: "loans",
  },
  {
    title: "Seized Collaterals",
    link: "views/loans/seized_collaterals.html",
    modals: ["views/modals/user.html",
            "views/modals/seized_collaterals.html"],
    state: "seized_collaterals",
  },
  {
    title: "Collaterals Sales",
    link: "views/loans/collateral_sales.html",
    modals: ["views/modals/user.html","views/modals/seized_collaterals.html"],
    state: "collateral_sales",
  },
  {
    title: "Investors",
    link: "views/investor.html",
    state: "investors",
    modals: ["views/modals/user.html"]
  },
  {
    title: "Income",
    link: "views/incomes.html",
    modals: ["views/modals/user.html",
            "views/modals/income.html"],
    state: "income",
  },
  {
    title: "Users",
    link: "views/users.html",
    modals: ["views/modals/user.html", 
            "views/modals/income.html" ],
    state: "users",
  },
  {
    title: "Loan Analysis Scores Settings",
    link: "views/settings/scores.html",
    modals: ["views/modals/user.html", "views/modals/settings.html"],
    state: "scores",
  },
  {
    title: "Loan Analysis Grades Settings",
    link: "views/settings/grades.html",
    modals: ["views/modals/user.html","views/modals/settings.html"],
    state: "grades",
  },
  {
    title: "Client Records",
    link: "views/clients/individualRecord.html",
    state: "client_records",
  },
  {
    title: "Completed Applications",
    link: "views/loans/new.html",
    state: "new_applications",
    modals: ["views/modals/user.html","views/modals/loans.html"]
  },
  {
    title: "Completed Applications",
    link: "views/loans/waiting.html",
    state: "waiting_applications",
    modals: ["views/modals/user.html","views/modals/loans.html"]
  },
  {
    title: "Completed Applications",
    link: "views/loans/done.html",
    state: "completed_applications",
    modals: ["views/modals/user.html","views/modals/loans.html"]
  },
  {
    title: "Dumped Applications",
    link: "views/loans/done.html",
    state: "dumped_applications",
    modals: ["views/modals/user.html","views/modals/loans.html"]
  },
  {
    title: "Client Demographics",
    link: "views/clients/demographics.html",
    state: "demographics",
    modals: ["views/modals/client.html", "views/modals/user.html"],
  },
  {
    title: "Client Jobs",
    link: "views/clients/jobs.html",
    state: "jobs",
    modals: ["views/modals/client.html", "views/modals/user.html"]
  },
  {
    title: "Client Dependants",
    link: "views/clients/dependants.html",
    state: "dependants",
    modals: ["views/modals/client.html", "views/modals/user.html"],
  },
  {
    title: "Client Businesses",
    link: "views/clients/businesses.html",
    state: "businesses",
    modals: ["views/modals/client.html", "views/modals/user.html"],
  },
  {
    title: "Client Assets",
    link: "views/clients/assets.html",
    state: "assets",
    modals: ["views/modals/assets.html", "views/modals/user.html"],
  },
  {
    title: "Client Otheloans",
    link: "views/clients/otherLoans.html",
    state: "other_loans",
    modals: ["views/modals/client.html", "views/modals/user.html"],
  },
  {
    title: "Investment Packages",
    link: "views/investments/investmentPackages.html",
    state: "investment_packages",
    modals: ["views/modals/investment_package.html"]
  },
  {
    title: "Investments",
    link: "views/investments/investments.html",
    state: "investments",
    modals: ["views/modals/investment.html"]
  },
  {
    title: "Return On Investments",
    link: "views/investments/rois.html",
    state: "return_on_investments",
    modals: ["views/modals/investment.html"]
  },
  {
    title: "My Investments",
    link: "views/investments/my-investments.html",
    state: "my_investments",
    modals: []
  },
  {
    title: "My Returns On Investments",
    link: "views/investments/my-rois.html",
    state: "my_return_on_investments",
    modals: []
  },
  {
    title: "Expenses",
    link: "views/accounts/expenses.html",
    state: "expenses",
    modals: ["views/modals/expense.html"]
  }
];

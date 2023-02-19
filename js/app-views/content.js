export const content_view = [
  //Clients
  {
    title: "Dashboard",
    state: "dashboard",
    links: [
      "views/dashboards/admin.html",
      "views/dashboards/finance.html",
      "views/dashboards/investor.html",
      "views/dashboards/loan-officer.html",
      "views/dashboards/co-owner.html",
    ],
  },
  {
    title: "Individuals",
    link: "views/clients/individuals.html",
    modals: "views/modals/client.html",
    state: "individual",
  },
  {
    title: "Organizations",
    link: "views/clients/organizations.html",
    modals: "views/modals/client.html",
    state: "organization",
  },
  {
    title: "Interests",
    link: "views/interests.html",
    modals: "views/modals/interest.html",
    state: "interests",
  },
  {
    title: "Applications",
    link: "views/loans/applications.html",
    state: "applications",
    modals: "views/modals/loans.html"
  },
  {
    title: "Loans",
    link: "views/loans/loans.html",
    modals: "views/modals/loan_payments.html",
    state: "loans",
  },
  {
    title:  "Seized Collaterals",
    link:   "views/loans/seized_collaterals.html",
    modals: "views/modals/seized_collaterals.html",
    state:  "seized_collaterals",
  },
  {
    title:  "Collaterals Sales",
    link:   "views/loans/collateral_sales.html",
    modals: "views/modals/seized_collaterals.html",
    state:  "collateral_sales",
  },
  {
    title: "Investors",
    link: "views/investor.html",
    state: "investors",
  },
  {
    title: "Income",
    link: "views/incomes.html",
    modals: "views/modals/income.html",
    state: "income",
  },
  {
    title: "Users",
    link: "views/users.html",
    modals: "views/modals/user.html",
    state: "users",
  },
  {
    title: "Loan Analysis Scores Settings",
    link: "views/settings/scores.html",
    modals: "views/modals/settings.html",
    state: "scores",
  },
  {
    title:  "Loan Analysis Grades Settings",
    link:   "views/settings/grades.html",
    modals: "views/modals/settings.html",
    state:  "grades",
  },
];

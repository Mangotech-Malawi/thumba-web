export const content_view = [
  //Clients
  {
    title: "Dashboard",
    state: "dashboard",
    links: [
      "views/dashboards/admin.html",
      "views/dashboards/finance.html",
      "views/dashboards/investor.html",
      "views/dashboards/loan-officer.html"   
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
    title: "Loans",
    link: "views/loans.html",
    state: "loans",
  },
  {
    title: "Investors",
    link: "views/investor.html",
    state: "investors",
  },
  {
    title: "Users",
    link: "views/users.html",
    modals: "views/modals/user.html",
    state: "users",
  },
];

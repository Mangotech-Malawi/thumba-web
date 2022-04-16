export const content_view = [
  //Clients
  {
    title: "Dashboard",
    state: "dashboard",
    links: [
      "views/dashboards/admin.html",
      "views/dashboards/loan-officer.html",
      "views/dashboards/investor.html",
    ],
  },
  {
    title: "Clients",
    link: "views/clients.html",
    modals: "views/modals/client.html",
    state: "clients",
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

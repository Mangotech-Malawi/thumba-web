export const sharesOptions = {
  series: [],
  labels: [],
  theme: {
    palette: "palette5", // upto palette10
  },
  chart: {
    type: "donut",
    width: 500,
    height: 500,
    align: "center",
  },
  legend: {
    position: "bottom",
    show: false

  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          fontSize: "20px"
         
        },
        options: {
          legend: {
            position: "bottom",
            show: false
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "16px",
      colors: ["#FFFFFF"],
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  dropShadow: {
    enabled: true,
    top: 0,
    left: 0,
    blur: 3,
    opacity: 0.5,
  },
};

export default sharesOptions;

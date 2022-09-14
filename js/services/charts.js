
export const  sharesOptions = {
    series: [],
    labels: ['Activated Reachable', "Activated Unreachable", 'Inactive Reachable', "Inactive Unreachable"],
    chart: {
        type: 'donut',
        width: 500,
        align: 'center'
    },
    legend: {
        position: 'bottom'
    },
    colors: ['#00695c', '#ff4444', '#0d6efd', '#ff891b'],
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                },
                options: {
                    legend: {
                        position: 'bottom'
                    }
                },

            }
        },
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '16px'
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 300
            },
            legend: {
                position: 'bottom'
            }
        },
    }]
};

export default sharesOptions;
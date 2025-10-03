import React from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = [
  '#008FFB', '#00E396', '#FEB019', '#FF4560',
  '#775DD0', '#3F51B5', '#546E7A', '#D4526E'
];

const Chart = () => {
  const series = [
    {
      data: [21, 22, 10, 28, 16, 21, 13, 30] 
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {
          console.log(e);
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: [
        ['John', 'Doe'],
        ['Joe', 'Smith'],
        ['Jake', 'Williams'],
        'Amber',
        ['Peter', 'Brown'],
        ['Mary', 'Evans'],
        ['David', 'Wilson'],
        ['Lily', 'Roberts']
      ],
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    }
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Chart;

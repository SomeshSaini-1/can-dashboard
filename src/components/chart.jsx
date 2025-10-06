import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = [
  '#008FFB', '#00E396', '#FEB019', '#FF4560',
  '#775DD0', '#3F51B5', '#546E7A', '#D4526E'
];

const Chart = ({ sensorValue = "EngineSpeed_rpm", height = 350, showChart = true }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const [Driver_data, setDriver_data] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch function
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiurl}/get_all_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sensorKey: sensorValue,
          limit: 100,
          page: 1
        })
      });

      const data = await res.json();
      setDriver_data(Array.isArray(data.query) ? data.query : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [sensorValue]);

  // ✅ Chart Config
  const series = [
    {
      name: sensorValue,
      data: Driver_data.map((ele) => Number(ele[sensorValue]) || 0),
    },
  ];

  const options = {
    chart: {
      height,
      type: 'bar',
      zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
      toolbar: { show: true },
    },
    colors,
    plotOptions: {
      bar: { columnWidth: '45%', distributed: true },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: Driver_data.map((ele) => {
        const time = ele.createdAt || ele.created_at;
        if (!time) return 'N/A';
        const [date, fullTime] = time.split('T');
        return `${date} ${fullTime?.split('.')[0]}`;
      }),
      labels: { style: { colors, fontSize: '11px' } },
    },
  };

  // ✅ Render
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading data...</div>
      ) : showChart ? (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={height}
          width="100%"
        />
      ) : (
        <div className={`overflow-auto h-[${height}px]`}>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Date/Time</th>
                <th className="border px-3 py-2 text-left">{sensorValue}</th>
              </tr>
            </thead>
            <tbody>
              {Driver_data.length > 0 ? (
                Driver_data.map((ele, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="border px-3 py-2">
                      {ele.createdAt || ele.created_at || '--'}
                    </td>
                    <td className="border px-3 py-2">
                      {ele[sensorValue] !== undefined && ele[sensorValue] !== null
                        ? ele[sensorValue]
                        : '--'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-3 py-2 text-center" colSpan="2">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Chart;

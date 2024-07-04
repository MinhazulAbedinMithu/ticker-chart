import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import 'chart.js/auto';

const ChartComponent = ({ data, ticker, filter, exchangeFilter }) => {
  const [chartData, setChartData] = useState({});

  

  useEffect(() => {
    const loadData = () => {
      const filteredData = data.filter(item => item.Ticker === ticker);

      const now = new Date();
      const filteredByTime = filteredData.filter(item => {
        const timestamp = new Date(item.TimeStamp);
        switch (filter) {
          case 'Last Day':
            return timestamp >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
          case 'Last Week':
            return timestamp >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'Last Month':
            return timestamp >= new Date(now.setMonth(now.getMonth() - 1));
          case 'Last Year':
            return timestamp >= new Date(now.setFullYear(now.getFullYear() - 1));
          default:
            return true;
        }
      });

      const filteredByExchange = filteredByTime.filter(item =>
        exchangeFilter === 'All' ? true : item.ExchangeName?.toLowerCase() === exchangeFilter?.toLowerCase()
      );

      const labels = filteredByExchange.map(item => new Date(item.TimeStamp).toLocaleString());
      const annualizedRates = filteredByExchange.map(item => item.AnnualizedRate);
      const absoluteRates = filteredByExchange.map(item => item.AbsoluteRate);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Annualized Rate',
            data: annualizedRates,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Absolute Rate',
            data: absoluteRates,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
          }
        ]
      });
    };
    loadData()

    // const timeoutId = setTimeout(loadData, 0);

    // return () => clearTimeout(timeoutId); // Clean up the timeout on unmount
  }, [data, ticker, filter, exchangeFilter]);

  return (
    <div className="mb-8 flex items-center justify-center flex-col">
      
      {chartData?.datasets ? <><h2 className="text-3xl my-6 font-bold text-center w-fit border-b pb-2 border-cyan-300">{ticker}</h2> <Line data={chartData}/></> : <div>
        <h4 className='text-center'>Data Not Found!!!</h4>
        </div>}
    </div>
  );
};

export default ChartComponent;

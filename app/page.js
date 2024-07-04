"use client"
import { useEffect, useState } from 'react';
import ChartComponent from '../components/Chart';
// import data from '@/public/fakedata.json';
import past_day from "@/public/past_day.json"
import past_month from "@/public/past_month_partial.json"
import past_week from "@/public/past_week.json"
import past_year from "@/public/past_year_partial.json"

// const TICKERS = ['XBTM24', 'XBTH25', 'XBTN24', 'XBTZ24', 'XBTU24'];
const FILTERS = ['Last Day', 'Last Week', 'Last Month', 'Last Year'];
// const EXCHANGES = ['All', 'Bitmex', 'Binance', 'Bybit'];

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('Last Year');
  const [selectedExchange, setSelectedExchange] = useState('All'); 
  const [data, setData] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [exchangeNames, setExchangeNames] = useState([]);


  useEffect(() => {
    const fetchData = async (filePath) => {
      // console.log(filePath);
      // const response = await fetch(filePath);
      // const result = await response.json();
      setData(filePath);
      const tickerArray = Array.from(new Set(filePath.map(item => item.Ticker)));
      const exchangerArray = Array.from(new Set(filePath.map(item => item.ExchangeName)));
      setTickers(tickerArray);
      setExchangeNames(["All",...exchangerArray])
      setSelectedTab("All")
      setSelectedExchange("All")
    };
    if(selectedFilter === "Last Year"){
      fetchData(past_year);
    }else if(selectedFilter === "Last Month"){
      fetchData(past_month);
    }else if(selectedFilter === "Last Week"){
      fetchData(past_week);
    }else{
      fetchData(past_day);
    }
  }, [selectedFilter]);








  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  const handleExchangeChange = (exchange) => {
    setSelectedExchange(exchange);
  };

  return (
    <div className="max-w-[1150px] container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Interest Rates Charts</h1>
      <div className='flex items-center justify-around'>
        <div className='mb-4'>
        <select
          value={selectedExchange}
          onChange={(e) => handleExchangeChange(e.target.value)}
          className="p-2 border border-gray-300 rounded text-black"
        >
          {exchangeNames.map(exchange => (
            <option key={exchange} value={exchange}>
              {exchange}
            </option>
          ))}
        </select>
        </div>
      <div className="flex mb-4 space-x-4 items-center justify-center max-w-[800px] w-full flex-wrap gap-2">
        <button
          onClick={() => handleTabClick('All')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          All
        </button>
        {tickers.map(ticker => (
          <button
            key={ticker}
            onClick={() => handleTabClick(ticker)}
            className={`px-4 py-2 rounded ${
              selectedTab === ticker ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {ticker}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <select
          value={selectedFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-2 border border-gray-300 rounded text-black"
        >
          {FILTERS.map(filter => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>
      </div>
      {selectedTab === 'All' ? (
        tickers.map(ticker => <ChartComponent key={ticker} data={data} ticker={ticker} filter={selectedFilter} exchangeFilter={selectedExchange} />)
      ) : (
        <ChartComponent key={selectedTab} data={data} ticker={selectedTab} filter={selectedFilter} exchangeFilter={selectedExchange} />
      )}
    </div>
  );
};

export default HomePage;

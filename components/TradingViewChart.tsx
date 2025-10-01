'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

interface TradingViewChartProps {
  tokenSymbol?: string
}

type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M'
type Indicator = 'MA' | 'EMA' | 'Volume' | 'RSI'

export default function TradingViewChart({ tokenSymbol = 'DEMO' }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candlestickSeriesRef = useRef<any>(null)
  const volumeSeriesRef = useRef<any>(null)
  const maSeriesRef = useRef<any>(null)
  
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1H')
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick')
  const [activeIndicators, setActiveIndicators] = useState<Indicator[]>(['Volume'])
  const [showIndicators, setShowIndicators] = useState(false)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#737373',
      },
      grid: {
        vertLines: { color: '#f5f5f5' },
        horzLines: { color: '#f5f5f5' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      rightPriceScale: {
        borderColor: '#e5e5e5',
      },
      timeScale: {
        borderColor: '#e5e5e5',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: '#9CA3AF',
          width: 1,
          style: 1,
          labelBackgroundColor: '#1a1a1a',
        },
        horzLine: {
          color: '#9CA3AF',
          width: 1,
          style: 1,
          labelBackgroundColor: '#1a1a1a',
        },
      },
    })

    chartRef.current = chart

    // Fetch candlestick data from your API
    const fetchCandlestickData = async () => {
      // In production, fetch real price data from your API/indexer
      // const response = await fetch(`/api/chart/${tokenSymbol}?timeframe=${timeFrame}`)
      // const data = await response.json()
      // return data
      
      // For now, return empty array - will be populated with real data
      return []
    }

    // Fetch volume data from your API
    const fetchVolumeData = async () => {
      // In production, fetch real volume data from your API/indexer
      // const response = await fetch(`/api/volume/${tokenSymbol}?timeframe=${timeFrame}`)
      // const data = await response.json()
      // return data
      
      // For now, return empty array - will be populated with real data
      return []
    }

    // Add candlestick series (v5 API)
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#14F195',
      downColor: '#ef4444',
      borderUpColor: '#14F195',
      borderDownColor: '#ef4444',
      wickUpColor: '#14F195',
      wickDownColor: '#ef4444',
    })

    candlestickSeriesRef.current = candlestickSeries
    
    // Fetch and set candlestick data
    fetchCandlestickData().then(data => {
      if (data.length > 0) {
        // @ts-ignore - time format compatibility
        candlestickSeries.setData(data)
      }
    })

    // Add volume series (v5 API)
    const volumeSeries = chart.addHistogramSeries({
      color: '#14F19533',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    })

    volumeSeriesRef.current = volumeSeries
    
    // Fetch and set volume data
    fetchVolumeData().then(data => {
      if (data.length > 0) {
        // @ts-ignore - time format compatibility
        volumeSeries.setData(data)
      }
    })
    
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    // Add Moving Average if selected
    if (activeIndicators.includes('MA')) {
      const maSeries = chart.addLineSeries({
        color: '#9945FF',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })
      
      // Fetch candlestick data and calculate moving average
      fetchCandlestickData().then(candleData => {
        if (candleData.length >= 20) {
          const maData = candleData.map((candle: any, i: number) => {
            if (i < 19) return { time: candle.time, value: candle.close }
            
            const sum = candleData.slice(i - 19, i + 1).reduce((acc: number, c: any) => acc + c.close, 0)
            return {
              time: candle.time,
              value: sum / 20
            }
          })
          
          maSeriesRef.current = maSeries
          // @ts-ignore - time format compatibility
          maSeries.setData(maData)
        }
      })
    }

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [timeFrame, activeIndicators])

  const timeFrames: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M']
  const indicators: { value: Indicator; label: string }[] = [
    { value: 'MA', label: 'MA(20)' },
    { value: 'EMA', label: 'EMA(50)' },
    { value: 'Volume', label: 'Volume' },
    { value: 'RSI', label: 'RSI(14)' },
  ]

  const toggleIndicator = (indicator: Indicator) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Time Frame Selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeFrame === tf
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-gray-600 hover:text-dark'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type & Indicators */}
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-1.5 rounded-md transition ${
                chartType === 'candlestick'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-gray-600 hover:text-dark'
              }`}
              title="Candlestick"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4v4M6 16v4M6 8h4M6 8H2M6 16h4M6 16H2M18 4v4M18 16v4M18 8h4M18 8h-4M18 16h4M18 16h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md transition ${
                chartType === 'line'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-gray-600 hover:text-dark'
              }`}
              title="Line Chart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
            </button>
          </div>

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Indicators
            </button>
            
            {showIndicators && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-medium z-10 p-2">
                {indicators.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleIndicator(value)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    <span className="text-gray-700">{label}</span>
                    {activeIndicators.includes(value) && (
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-xl overflow-hidden border border-gray-200"
      />

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-gray-600">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Bearish</span>
          </div>
          {activeIndicators.includes('MA') && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-gray-600">MA(20)</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span>Powered by Lightweight Charts</span>
        </div>
      </div>
    </div>
  )
}


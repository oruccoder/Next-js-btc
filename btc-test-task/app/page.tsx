"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiBitcoin } from "react-icons/si";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

type Point = {
  time: string;
  price: number;
};

const mockData: Point[] = [
  { time: "10:00", price: 67000 },
  { time: "11:00", price: 67250 },
  { time: "12:00", price: 66800 },
  { time: "13:00", price: 67500 },
  { time: "14:00", price: 68050 },
  { time: "15:00", price: 67800 },
  { time: "16:00", price: 68320 },
];

function getMinMax(data: Point[]) {
  const prices = data.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max };
}

function Chart({ data }: { data: Point[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    data.length - 1
  );

  const { min, max } = getMinMax(data);
  const paddingX = 20;
  const paddingY = 20;
  const width = 400;
  const height = 200;

  const range = max - min || 1;

  const points = data.map((p, index) => {
    const x =
      paddingX +
      (index / Math.max(1, data.length - 1)) *
        (width - paddingX * 2);
    const y =
      height -
      (paddingY +
        ((p.price - min) / range) * (height - paddingY * 2));
    return { x, y };
  });

  const pathD = points
    .map((p, i) =>
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    )
    .join(" ");

  const first = data[0].price;
  const last = data[data.length - 1].price;
  const isUp = last >= first;

  const handleMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;

    let closestIndex = 0;
    let minDist = Infinity;

    points.forEach((p, i) => {
      const screenX =
        (p.x / width) * rect.width;
      const dist = Math.abs(screenX - relX);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  };

  const handleLeave = () => {
    setActiveIndex(data.length - 1);
  };

  const activePoint =
    activeIndex != null ? points[activeIndex] : null;
  const activeData =
    activeIndex != null ? data[activeIndex] : data[data.length - 1];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="asset-info">
          <SiBitcoin size={24} />
          <div>
            <div className="asset-name">Bitcoin</div>
            <div className="asset-symbol">BTC / USDT</div>
          </div>
        </div>
        <div className={`asset-change ${isUp ? "up" : "down"}`}>
          {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
          <span>
            {(((last - first) / first) * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="price-row">
        <div className="price-main">
          ${activeData.price.toLocaleString()}
        </div>
        <div className="price-range">
          Low: ${min.toLocaleString()} • High: ${max.toLocaleString()}
        </div>
      </div>

      <svg
        className="chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            className="chart-point"
          />
        ))}

        {activePoint && (
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={6}
            className="chart-active-point"
          />
        )}
      </svg>

      <div className="chart-times">
        {data.map((p, i) => (
          <span
            key={p.time}
            className={
              i === activeIndex ? "active-time" : undefined
            }
          >
            {p.time}
          </span>
        ))}
      </div>

      <div className="chart-tooltip">
        <span>{activeData.time}</span>
        <span>${activeData.price.toLocaleString()}</span>
      </div>
    </div>
  );
}


export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // mock "fetch"
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="preloader-inner"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SiBitcoin size={42} />
            </motion.div>
            <motion.div
              className="preloader-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Loading market data…
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
        transition={{ delay: isLoading ? 0 : 0.2, duration: 0.4 }}
      >
        <header className="header">
          <div className="logo-wrap">
            <SiBitcoin size={28} />
            <span>Crypto Insight</span>
          </div>
          <div className="tag">Test Task • Next.js</div>
        </header>

        <p className="subtitle">
          Simple BTC price overview with mock data. Preloader uses
          <code> framer-motion </code> and icons from
          <code> react-icons</code>.
        </p>

        <Chart data={mockData} />
      </motion.div>
    </main>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineAxisProps {
  startDate: Date;
  endDate: Date;
  zoom: number;
  increment: 'year' | 'month' | 'day';
  width: number;
}

const TimelineAxis: React.FC<TimelineAxisProps> = ({
  startDate,
  endDate,
  zoom,
  increment,
  width
}) => {
  const generateTimeMarkers = () => {
    const markers: Array<{ date: Date; label: string; x: number; isMajor: boolean }> = [];
    const totalDuration = endDate.getTime() - startDate.getTime();
    
    let current = new Date(startDate);
    let stepSize = 0;
    
    // Calculate step size based on increment
    switch (increment) {
      case 'year':
        stepSize = 365.25 * 24 * 60 * 60 * 1000; // milliseconds in a year
        current.setMonth(0, 1); // Start at beginning of year
        break;
      case 'month':
        stepSize = 30.44 * 24 * 60 * 60 * 1000; // average milliseconds in a month
        current.setDate(1); // Start at beginning of month
        break;
      case 'day':
        stepSize = 24 * 60 * 60 * 1000; // milliseconds in a day
        break;
    }
    
    let counter = 0;
    while (current <= endDate && counter < 1000) { // Safety limit
      const progress = (current.getTime() - startDate.getTime()) / totalDuration;
      const x = progress * width;
      
      let label = '';
      let isMajor = false;
      
      switch (increment) {
        case 'year':
          label = current.getFullYear().toString();
          isMajor = true;
          break;
        case 'month':
          label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          isMajor = current.getMonth() === 0; // Major tick for January
          break;
        case 'day':
          label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          isMajor = current.getDate() === 1; // Major tick for first of month
          break;
      }
      
      markers.push({ date: new Date(current), label, x, isMajor });
      
      // Increment to next marker
      switch (increment) {
        case 'year':
          current.setFullYear(current.getFullYear() + 1);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
      }
      
      counter++;
    }
    
    return markers;
  };

  const markers = generateTimeMarkers();

  return (
    <div className="timeline-axis" style={{ width: `${width}px` }}>
      {/* Main axis line */}
      <div className="axis-line" />
      
      {/* Time markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={`${marker.date.getTime()}-${index}`}
          className={`time-marker ${marker.isMajor ? 'major' : 'minor'}`}
          style={{ left: `${marker.x}px` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.01, duration: 0.3 }}
        >
          <div className="marker-tick" />
          <div className="marker-label">{marker.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default TimelineAxis;

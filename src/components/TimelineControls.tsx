import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Calendar, Clock, Sun } from 'lucide-react';

interface TimelineControlsProps {
  zoom: number;
  increment: 'year' | 'month' | 'day';
  onZoomChange: (zoom: number) => void;
  onIncrementChange: (increment: 'year' | 'month' | 'day') => void;
  onResetView: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  zoom,
  increment,
  onZoomChange,
  onIncrementChange,
  onResetView,
}) => {
  const incrementOptions = [
    { value: 'year' as const, label: 'Years', icon: Calendar },
    { value: 'month' as const, label: 'Months', icon: Clock },
    { value: 'day' as const, label: 'Days', icon: Sun },
  ];

  return (
    <motion.div 
      className="timeline-controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Zoom Controls */}
      <div className="control-group">
        <label className="control-label">Zoom</label>
        <div className="zoom-controls">
          <button
            className="control-button"
            onClick={() => onZoomChange(Math.max(0.1, zoom * 0.8))}
            disabled={zoom <= 0.1}
          >
            <ZoomOut size={16} />
          </button>
          <span className="zoom-display">{Math.round(zoom * 100)}%</span>
          <button
            className="control-button"
            onClick={() => onZoomChange(Math.min(10, zoom * 1.25))}
            disabled={zoom >= 10}
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Time Increment Controls */}
      <div className="control-group">
        <label className="control-label">View</label>
        <div className="increment-controls">
          {incrementOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                className={`increment-button ${increment === option.value ? 'active' : ''}`}
                onClick={() => onIncrementChange(option.value)}
              >
                <IconComponent size={14} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset View */}
      <div className="control-group">
        <button className="control-button reset-button" onClick={onResetView}>
          Reset View
        </button>
      </div>
    </motion.div>
  );
};

export default TimelineControls;

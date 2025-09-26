import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText } from 'lucide-react';

interface NewTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTimeline: (title: string, startYear: number, endYear: number) => void;
}

const NewTimelineModal: React.FC<NewTimelineModalProps> = ({
  isOpen,
  onClose,
  onCreateTimeline,
}) => {
  const [title, setTitle] = useState('');
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 10);
  const [endYear, setEndYear] = useState(new Date().getFullYear() + 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a timeline title');
      return;
    }
    
    if (startYear >= endYear) {
      alert('Start year must be before end year');
      return;
    }
    
    onCreateTimeline(title.trim(), startYear, endYear);
    
    // Reset form
    setTitle('');
    setStartYear(new Date().getFullYear() - 10);
    setEndYear(new Date().getFullYear() + 10);
  };

  const handleClose = () => {
    setTitle('');
    setStartYear(new Date().getFullYear() - 10);
    setEndYear(new Date().getFullYear() + 10);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="event-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="event-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="event-modal-header">
              <h2>Create New Timeline</h2>
              <button className="modal-close-button" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="event-modal-content">
                <div className="form-group">
                  <label>
                    <FileText size={16} />
                    Timeline Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., History of World War II, Renaissance Art Movement..."
                    className="form-input"
                    autoFocus
                  />
                </div>

                <div className="year-range-group">
                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      Start Year
                    </label>
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(parseInt(e.target.value) || 0)}
                      className="form-input"
                      min="1"
                      max="9999"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      End Year
                    </label>
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(parseInt(e.target.value) || 0)}
                      className="form-input"
                      min="1"
                      max="9999"
                    />
                  </div>
                </div>

                <div className="timeline-info">
                  <p>
                    Your timeline will span <strong>{endYear - startYear} years</strong> from {startYear} to {endYear}.
                    You can zoom in to add events at specific dates.
                  </p>
                </div>
              </div>

              <div className="event-modal-footer">
                <div></div> {/* Empty div for spacing */}
                <div className="modal-actions">
                  <button type="button" className="modal-button cancel-button" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-button save-button">
                    <FileText size={16} />
                    Create Timeline
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewTimelineModal;

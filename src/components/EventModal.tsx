import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Calendar, FileText } from 'lucide-react';
import { TimelineEvent } from '../types/timeline';

interface EventModalProps {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date.toISOString().split('T')[0]);
    }
  }, [event]);

  const handleSave = () => {
    if (!event) return;
    
    const updatedEvent: TimelineEvent = {
      ...event,
      title: title.trim() || 'Untitled Event',
      description: description.trim() || 'No description',
      date: new Date(date)
    };
    
    onSave(updatedEvent);
  };

  const handleDelete = () => {
    if (!event) return;
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  if (!event) return null;

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
            onClick={onClose}
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
              <h2>Edit Event</h2>
              <button className="modal-close-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="event-modal-content">
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description..."
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="event-modal-footer">
              <button className="modal-button delete-button" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete
              </button>
              <div className="modal-actions">
                <button className="modal-button cancel-button" onClick={onClose}>
                  Cancel
                </button>
                <button className="modal-button save-button" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;

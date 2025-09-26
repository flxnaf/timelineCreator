import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit3,
  Circle
} from 'lucide-react';
import { TimelineLayer } from '../types/timeline';

interface LayersPanelProps {
  isOpen: boolean;
  layers: TimelineLayer[];
  activeLayerId: string;
  onClose: () => void;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onAddLayer: () => void;
  onDeleteLayer: (layerId: string) => void;
  onLayerRename: (layerId: string, name: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  isOpen,
  layers,
  activeLayerId,
  onClose,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerOpacityChange,
  onAddLayer,
  onDeleteLayer,
  onLayerRename,
}) => {
  const [editingLayerId, setEditingLayerId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const handleStartEdit = (layer: TimelineLayer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleFinishEdit = () => {
    if (editingLayerId && editingName.trim()) {
      onLayerRename(editingLayerId, editingName.trim());
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEdit();
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
      setEditingName('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="layers-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="layers-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="layers-header">
              <h3>Layers</h3>
              <button className="close-button" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="layers-content">
              <button className="add-layer-button" onClick={onAddLayer}>
                <Plus size={16} />
                Add New Layer
              </button>

              <div className="layers-list">
                {layers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    className={`layer-item ${layer.id === activeLayerId ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="layer-main">
                      <button
                        className="layer-visibility"
                        onClick={() => onLayerToggleVisibility(layer.id)}
                      >
                        {layer.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      <div 
                        className="layer-color"
                        style={{ backgroundColor: layer.color }}
                      >
                        <Circle size={12} />
                      </div>

                      <div className="layer-info" onClick={() => onLayerSelect(layer.id)}>
                        {editingLayerId === layer.id ? (
                          <input
                            className="layer-name-input"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={handleFinishEdit}
                            onKeyDown={handleKeyPress}
                            autoFocus
                          />
                        ) : (
                          <span className="layer-name">{layer.name}</span>
                        )}
                        <span className="layer-events-count">
                          {layer.events.length} events
                        </span>
                      </div>

                      <div className="layer-actions">
                        <button
                          className="layer-action-button"
                          onClick={() => handleStartEdit(layer)}
                        >
                          <Edit3 size={14} />
                        </button>
                        
                        {layers.length > 1 && (
                          <button
                            className="layer-action-button delete"
                            onClick={() => onDeleteLayer(layer.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="layer-opacity">
                      <label>Opacity: {Math.round(layer.opacity * 100)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layer.opacity}
                        onChange={(e) => onLayerOpacityChange(layer.id, parseFloat(e.target.value))}
                        className="opacity-slider"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LayersPanel;

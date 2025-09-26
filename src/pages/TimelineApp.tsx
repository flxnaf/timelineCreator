import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Toolbar from '../components/Toolbar';
import LayersPanel from '../components/LayersPanel';
import EventModal from '../components/EventModal';
import { 
  TimelineDocument, 
  TimelineLayer, 
  User, 
  TimelineEvent 
} from '../types/timeline';

const TimelineApp: React.FC = () => {
  // Mock user state
  const [user, setUser] = useState<User | null>({
    id: 'guest',
    name: 'Guest User',
    email: '',
    isGuest: true
  });

  // Document state - Initialize from sessionStorage if available
  const [currentDocument, setCurrentDocument] = useState<TimelineDocument>(() => {
    const newTimelineData = sessionStorage.getItem('newTimelineData');
    if (newTimelineData) {
      const data = JSON.parse(newTimelineData);
      sessionStorage.removeItem('newTimelineData'); // Clear after use
      
      return {
        id: data.created.toString(),
        name: data.title,
        activeLayerId: 'layer-1',
        zoom: 1,
        panX: 0,
        panY: 0,
        timeRange: {
          start: new Date(data.startYear, 0, 1),
          end: new Date(data.endYear, 11, 31)
        },
        layers: [
          {
            id: 'layer-1',
            name: 'Main Layer',
            color: '#b4a7d6',
            isVisible: true,
            opacity: 1,
            events: [],
            connections: []
          }
        ]
      };
    }
    
    // Default fallback
    return {
      id: '1',
      name: 'Sample Timeline',
      activeLayerId: 'layer-1',
      zoom: 1,
      panX: 0,
      panY: 0,
      timeRange: {
        start: new Date(2020, 0, 1),
        end: new Date(2030, 11, 31)
      },
      layers: [
        {
          id: 'layer-1',
          name: 'Main Layer',
          color: '#b4a7d6',
          isVisible: true,
          opacity: 1,
          events: [],
          connections: []
        }
      ]
    };
  });

  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Handlers
  const handleLogin = useCallback(() => {
    // Mock login - in real app, this would open a login modal
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isGuest: false
    });
  }, []);

  const handleNewDocument = useCallback(() => {
    const newDoc: TimelineDocument = {
      id: Date.now().toString(),
      name: 'New Timeline',
      activeLayerId: 'layer-1',
      zoom: 1,
      panX: 0,
      panY: 0,
      timeRange: {
        start: new Date(2000, 0, 1),
        end: new Date(2024, 11, 31)
      },
      layers: [
        {
          id: 'layer-1',
          name: 'Main Timeline',
          color: '#8b5cf6',
          isVisible: true,
          opacity: 1,
          events: [],
          connections: []
        }
      ]
    };
    setCurrentDocument(newDoc);
  }, []);

  const handleDocumentNameChange = useCallback((name: string) => {
    setCurrentDocument(prev => prev ? { ...prev, name } : null);
  }, []);

  const handleLayerSelect = useCallback((layerId: string) => {
    setCurrentDocument(prev => prev ? { ...prev, activeLayerId: layerId } : null);
  }, []);

  const handleLayerToggleVisibility = useCallback((layerId: string) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === layerId ? { ...layer, isVisible: !layer.isVisible } : layer
        )
      };
    });
  }, []);

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === layerId ? { ...layer, opacity } : layer
        )
      };
    });
  }, []);

  const handleAddLayer = useCallback(() => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const newLayer: TimelineLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${currentDocument?.layers.length ? currentDocument.layers.length + 1 : 1}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      isVisible: true,
      opacity: 0.3,
      events: [],
      connections: []
    };

    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: [...prev.layers, newLayer]
      };
    });
  }, [currentDocument?.layers.length]);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setCurrentDocument(prev => {
      if (!prev || prev.layers.length <= 1) return prev;
      
      const filteredLayers = prev.layers.filter(layer => layer.id !== layerId);
      const newActiveLayerId = prev.activeLayerId === layerId 
        ? filteredLayers[0]?.id 
        : prev.activeLayerId;

      return {
        ...prev,
        layers: filteredLayers,
        activeLayerId: newActiveLayerId
      };
    });
  }, []);

  const handleLayerRename = useCallback((layerId: string, name: string) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === layerId ? { ...layer, name } : layer
        )
      };
    });
  }, []);

  // Timeline canvas handlers
  const handleCanvasWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;
    let hasMoved = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      hasMoved = true;
      setPan({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // If mouse didn't move much, treat as a click to create event
      if (!hasMoved) {
        const canvasX = (upEvent.clientX - rect.left - pan.x) / zoom;
        const canvasY = (upEvent.clientY - rect.top - pan.y) / zoom;
        handleCreateEvent(canvasX, canvasY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [pan, zoom]);

  const handleCreateEvent = useCallback((x: number, y: number) => {
    if (!currentDocument) return;

    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: 'New Event',
      date: new Date(),
      description: 'Click to edit description...',
      x: x,
      y: y,
      layerId: currentDocument.activeLayerId
    };

    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === prev.activeLayerId
            ? { ...layer, events: [...layer.events, newEvent] }
            : layer
        )
      };
    });
  }, [currentDocument]);

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const handleEventClick = useCallback((event: TimelineEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsEditingEvent(true);
  }, []);

  const handleEventUpdate = useCallback((updatedEvent: TimelineEvent) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === updatedEvent.layerId
            ? {
                ...layer,
                events: layer.events.map(event =>
                  event.id === updatedEvent.id ? updatedEvent : event
                )
              }
            : layer
        )
      };
    });
    setIsEditingEvent(false);
    setSelectedEvent(null);
  }, []);

  const handleEventDelete = useCallback((eventId: string) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        layers: prev.layers.map(layer => ({
          ...layer,
          events: layer.events.filter(event => event.id !== eventId)
        }))
      };
    });
    setIsEditingEvent(false);
    setSelectedEvent(null);
  }, []);

  if (!currentDocument) {
    return <div>Loading...</div>;
  }

  return (
    <div className="timeline-app">
      <Toolbar
        user={user}
        currentDocument={currentDocument}
        onLogin={handleLogin}
        onNewDocument={handleNewDocument}
        onOpenLayers={() => setIsLayersPanelOpen(true)}
        onSaveDocument={() => console.log('Save document')}
        onDocumentNameChange={handleDocumentNameChange}
        onOpenFiles={() => console.log('Open files')}
      />

      <main className="timeline-main">
        <motion.div
          className="timeline-canvas"
          onWheel={handleCanvasWheel}
          onMouseDown={handleCanvasMouseDown}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            cursor: 'grab'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Timeline Grid */}
          <div className="timeline-grid">
            {/* Render layers */}
            {currentDocument.layers.map((layer) => (
              <motion.div
                key={layer.id}
                className={`timeline-layer ${layer.id === currentDocument.activeLayerId ? 'active' : ''}`}
                style={{
                  opacity: layer.isVisible ? layer.opacity : 0,
                  zIndex: layer.id === currentDocument.activeLayerId ? 10 : 1
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: layer.isVisible ? layer.opacity : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="layer-indicator"
                  style={{ backgroundColor: layer.color }}
                >
                  {layer.name}
                </div>
                
                {/* Events will be rendered here */}
                <div className="layer-events">
                  {layer.events.map((event) => (
                    <motion.div
                      key={event.id}
                      className="timeline-event"
                      style={{
                        left: `${event.x}px`,
                        top: `${event.y}px`,
                        borderColor: layer.color
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="event-marker" style={{ backgroundColor: layer.color }} />
                      <div className="event-content">
                        <div className="event-title">{event.title}</div>
                        <div className="event-date">
                          {event.date.toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Axis */}
          <div className="timeline-axis">
            <div className="axis-line" />
            {/* Time markers will be generated here */}
          </div>
        </motion.div>

        {/* Timeline Controls */}
        <div className="timeline-controls">
          <div className="zoom-controls">
            <button onClick={() => setZoom(prev => Math.max(0.1, prev * 0.9))}>-</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.min(5, prev * 1.1))}>+</button>
          </div>
        </div>
      </main>

      <LayersPanel
        isOpen={isLayersPanelOpen}
        layers={currentDocument.layers}
        activeLayerId={currentDocument.activeLayerId}
        onClose={() => setIsLayersPanelOpen(false)}
        onLayerSelect={handleLayerSelect}
        onLayerToggleVisibility={handleLayerToggleVisibility}
        onLayerOpacityChange={handleLayerOpacityChange}
        onAddLayer={handleAddLayer}
        onDeleteLayer={handleDeleteLayer}
        onLayerRename={handleLayerRename}
      />

      <EventModal
        event={selectedEvent}
        isOpen={isEditingEvent}
        onClose={() => {
          setIsEditingEvent(false);
          setSelectedEvent(null);
        }}
        onSave={handleEventUpdate}
        onDelete={handleEventDelete}
      />
    </div>
  );
};

export default TimelineApp;

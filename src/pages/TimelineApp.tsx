import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Toolbar from '../components/Toolbar';
import LayersPanel from '../components/LayersPanel';
import EventModal from '../components/EventModal';
import TimelineAxis from '../components/TimelineAxis';
import TimelineControls from '../components/TimelineControls';
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
  const [timeIncrement, setTimeIncrement] = useState<'year' | 'month' | 'day'>('year');

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
    
    // Handle different types of wheel events (mouse wheel vs trackpad)
    let delta = 1;
    if (e.deltaY !== 0) {
      // For mouse wheel or trackpad vertical scroll
      delta = e.deltaY > 0 ? 0.9 : 1.1;
    } else if (e.deltaX !== 0) {
      // For trackpad horizontal scroll (pinch gesture)
      delta = e.deltaX > 0 ? 0.9 : 1.1;
    }
    
    // Apply zoom with more granular control for trackpad
    const zoomFactor = Math.abs(e.deltaY) > 100 ? delta : (delta > 1 ? 1.05 : 0.95);
    setZoom(prev => Math.max(0.1, Math.min(10, prev * zoomFactor)));
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;
    let hasMoved = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      hasMoved = true;
      const newPanX = moveEvent.clientX - startX;
      const newPanY = moveEvent.clientY - startY;
      
      // Apply boundaries to prevent dragging too far from timeline
      const maxPanX = 200;
      const minPanX = -1000;
      const maxPanY = 100;
      const minPanY = -100;
      
      setPan({
        x: Math.max(minPanX, Math.min(maxPanX, newPanX)),
        y: Math.max(minPanY, Math.min(maxPanY, newPanY))
      });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Only create event if clicking on timeline area and didn't drag much
      if (!hasMoved) {
        const canvasX = (upEvent.clientX - rect.left - pan.x) / zoom;
        const canvasY = (upEvent.clientY - rect.top - pan.y) / zoom;
        
        // Check if click is within timeline bounds (near the axis)
        const timelineY = rect.height / 2; // Assuming timeline is in middle
        const distanceFromTimeline = Math.abs(canvasY - timelineY);
        
        if (distanceFromTimeline < 150) { // Within 150px of timeline
          handleCreateEvent(canvasX, canvasY, upEvent.clientX - rect.left);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [pan, zoom]);

  const handleCreateEvent = useCallback((x: number, y: number, screenX?: number) => {
    if (!currentDocument) return;

    // Calculate the date based on position on timeline
    const timelineWidth = 1200; // Base timeline width
    const totalDuration = currentDocument.timeRange.end.getTime() - currentDocument.timeRange.start.getTime();
    const progress = Math.max(0, Math.min(1, screenX ? (screenX / timelineWidth) : (x / timelineWidth)));
    const eventDate = new Date(currentDocument.timeRange.start.getTime() + (progress * totalDuration));

    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: 'New Event',
      date: eventDate,
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

  // Timeline control handlers
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleIncrementChange = useCallback((newIncrement: 'year' | 'month' | 'day') => {
    setTimeIncrement(newIncrement);
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
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

          {/* Timeline Axis with proper dates */}
          <TimelineAxis
            startDate={currentDocument.timeRange.start}
            endDate={currentDocument.timeRange.end}
            zoom={zoom}
            increment={timeIncrement}
            width={1200}
          />
        </motion.div>

        {/* Timeline Controls */}
        <TimelineControls
          zoom={zoom}
          increment={timeIncrement}
          onZoomChange={handleZoomChange}
          onIncrementChange={handleIncrementChange}
          onResetView={handleResetView}
        />
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

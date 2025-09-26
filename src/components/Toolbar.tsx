import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  LogIn, 
  File, 
  FileText, 
  Layers3, 
  Save,
  Menu
} from 'lucide-react';
import { User as UserType, TimelineDocument } from '../types/timeline';

interface ToolbarProps {
  user: UserType | null;
  currentDocument: TimelineDocument | null;
  onLogin: () => void;
  onNewDocument: () => void;
  onOpenLayers: () => void;
  onSaveDocument: () => void;
  onDocumentNameChange: (name: string) => void;
  onOpenFiles: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  user,
  currentDocument,
  onLogin,
  onNewDocument,
  onOpenLayers,
  onSaveDocument,
  onDocumentNameChange,
  onOpenFiles,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [documentName, setDocumentName] = useState(currentDocument?.name || 'Untitled Timeline');

  const handleNameSubmit = () => {
    onDocumentNameChange(documentName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setDocumentName(currentDocument?.name || 'Untitled Timeline');
      setIsEditingName(false);
    }
  };

  return (
    <motion.div 
      className="toolbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="toolbar-section toolbar-left">
        {user && !user.isGuest ? (
          <>
            <motion.button 
              className="toolbar-button files-button"
              onClick={onOpenFiles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <File size={18} />
              <span>Files</span>
            </motion.button>
          </>
        ) : (
          <>
            <motion.div className="guest-indicator">
              <span>Guest Mode</span>
            </motion.div>
            <motion.button 
              className="toolbar-button login-button"
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} />
              <span>Login / Sign Up</span>
            </motion.button>
            <motion.button 
              className="toolbar-button new-file-button"
              onClick={onNewDocument}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText size={18} />
              <span>Create New File</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Center Section - Document Name */}
      <div className="toolbar-section toolbar-center">
        {isEditingName ? (
          <motion.input
            className="document-name-input"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            autoFocus
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          />
        ) : (
          <motion.div
            className="document-name"
            onClick={() => setIsEditingName(true)}
            whileHover={{ scale: 1.02 }}
            title="Click to edit document name"
          >
            {currentDocument?.name || 'Untitled Timeline'}
          </motion.div>
        )}
      </div>

      {/* Right Section */}
      <div className="toolbar-section toolbar-right">
        <motion.button 
          className="toolbar-button"
          onClick={onSaveDocument}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Save Document"
        >
          <Save size={18} />
        </motion.button>

        <motion.button 
          className="toolbar-button"
          onClick={onNewDocument}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="New Document"
        >
          <FileText size={18} />
        </motion.button>

        <motion.button 
          className="toolbar-button"
          onClick={onOpenLayers}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Layers"
        >
          <Layers3 size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toolbar;

// components/BackendStatus.jsx
import React, { useState, useEffect } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { CloudOff, CloudDone, Warning } from '@mui/icons-material';
import api from '../utils/api';

const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const status = await api.healthCheck();
      setIsOnline(status);
      setIsChecking(false);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <Tooltip title="Checking backend status...">
        <Chip 
          icon={<Warning />} 
          label="Checking..." 
          size="small" 
          color="default"
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isOnline ? "Backend server is online" : "Backend server is offline - using mock data"}>
      <Chip 
        icon={isOnline ? <CloudDone /> : <CloudOff />} 
        label={isOnline ? "Online" : "Offline"} 
        size="small" 
        color={isOnline ? "success" : "warning"}
        variant={isOnline ? "filled" : "outlined"}
      />
    </Tooltip>
  );
};

export default BackendStatus;
import React from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { Plant } from '../types';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

interface HarvestModalProps {
  plant: Plant | null;
  open: boolean;
  onClose: () => void;
}

export default function HarvestModal({ plant, open, onClose }: HarvestModalProps) {
  if (!plant) return null;

  const traceabilityUrl = `${window.location.origin}/trace/${plant.id}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="harvest-modal-title"
    >
      <Paper sx={style}>
        <Typography id="harvest-modal-title" variant="h6" component="h2">
          Generate Traceability QR
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Share harvest details for {plant.name} with your supply chain partners.
        </Typography>
        <Box sx={{ my: 3, p: 2, bgcolor: 'grey.100', display: 'inline-block' }}>
          <QRCodeCanvas value={traceabilityUrl} size={128} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Scan the QR code to view cultivation history, quality checkpoints, and certifications.
        </Typography>
        <Button onClick={onClose} sx={{ mt: 3 }}>Close</Button>
      </Paper>
    </Modal>
  );
}

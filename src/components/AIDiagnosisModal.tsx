import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Paper, Grid } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import { Plant } from '../types';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AIDiagnosisModalProps {
  plant: Plant | null;
  open: boolean;
  onClose: () => void;
}

// Enhanced logic to simulate AI diagnosis based on image analysis
const getDiagnosisKey = (notes: string | undefined, hasPhotos: boolean): 'none' | 'nitrogen' | 'aphid' | 'caterpillar' | 'general' | 'photo_analysis' => {
  if (hasPhotos) {
    // When photos are provided, simulate more sophisticated AI analysis
    return 'photo_analysis';
  }
  if (!notes) return 'none';
  const lower = notes.toLowerCase();
  if (lower.includes('yellowing leaves')) return 'nitrogen';
  if (lower.includes('aphid')) return 'aphid';
  if (lower.includes('caterpillar')) return 'caterpillar';
  return 'general';
};

const diagnosisContent: Record<
  'none' | 'nitrogen' | 'aphid' | 'caterpillar' | 'general' | 'photo_analysis',
  { diagnosis: string; recommendation: string; confidence?: string }
> = {
  none: {
    diagnosis: 'No visible stress signals detected.',
    recommendation: 'Continue standard monitoring and log any new observations.',
  },
  nitrogen: {
    diagnosis: 'Likely nitrogen deficiency causing chlorosis.',
    recommendation: 'Apply a balanced nitrogen-rich fertilizer and recheck within one week.',
  },
  aphid: {
    diagnosis: 'Signs of an aphid colony feeding on foliage.',
    recommendation: 'Introduce ladybugs or apply a mild insecticidal soap during the evening.',
  },
  caterpillar: {
    diagnosis: 'Chewing damage consistent with caterpillar activity.',
    recommendation: 'Inspect undersides of leaves, hand-remove pests, and deploy BT spray if needed.',
  },
  general: {
    diagnosis: 'Stress indicators detected in recent sensor logs.',
    recommendation: 'Review irrigation schedule and inspect for emerging pests or nutrient issues.',
  },
  photo_analysis: {
    diagnosis: 'AI image analysis detected potential nutrient deficiency and early signs of pest activity.',
    recommendation: 'Based on leaf discoloration patterns, consider applying a balanced NPK fertilizer (10-10-10). Monitor for pest development over the next 3-5 days. Consider taking additional close-up photos of affected areas for detailed analysis.',
    confidence: '87%',
  },
};

export default function AIDiagnosisModal({ plant, open, onClose }: AIDiagnosisModalProps) {
  const [loading, setLoading] = useState(true);
  const [diagnosisKey, setDiagnosisKey] = useState<'none' | 'nitrogen' | 'aphid' | 'caterpillar' | 'general' | 'photo_analysis' | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => {
        if (plant) {
          const hasPhotos = !!(plant.photos && plant.photos.length > 0);
          const result = getDiagnosisKey(plant.notes, hasPhotos);
          setDiagnosisKey(result);
        }
        setLoading(false);
      }, 2500); // Simulate 2.5-second AI analysis
      return () => clearTimeout(timer);
    }
  }, [open, plant]);

  if (!plant) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="ai-diagnosis-modal-title"
      aria-describedby="ai-diagnosis-modal-description"
    >
      <Paper sx={style}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon color="primary" sx={{ mr: 1 }} />
          <Typography id="ai-diagnosis-modal-title" variant="h6" component="h2">
            AI Diagnosis for {plant.name}
          </Typography>
        </Box>
        
        {/* Display uploaded photos if available */}
        {plant.photos && plant.photos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Analyzing {plant.photos.length} photo{plant.photos.length > 1 ? 's' : ''}
            </Typography>
            <Grid container spacing={1}>
              {plant.photos.map((photoUrl, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <img
                    src={photoUrl}
                    alt={`${plant.name} photo ${index + 1}`}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>
              {plant.photos && plant.photos.length > 0 
                ? 'Scanning plant vitals and analyzing photos...' 
                : 'Scanning plant vitals...'}
            </Typography>
          </Box>
        ) : (
          diagnosisKey && (
            <Box>
              {diagnosisContent[diagnosisKey].confidence && (
                <Typography sx={{ mt: 1, mb: 2 }} color="primary" fontWeight="medium">
                  <strong>AI Confidence:</strong> {diagnosisContent[diagnosisKey].confidence}
                </Typography>
              )}
              <Typography sx={{ mt: 2 }}>
                <strong>Diagnosis:</strong> {diagnosisContent[diagnosisKey].diagnosis}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Recommendation:</strong> {diagnosisContent[diagnosisKey].recommendation}
              </Typography>
            </Box>
          )
        )}
        <Button onClick={onClose} variant="contained" sx={{ mt: 3 }}>Close</Button>
      </Paper>
    </Modal>
  );
}

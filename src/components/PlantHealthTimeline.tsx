import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Slider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import type { HealthSnapshot } from '../types';

interface PlantHealthTimelineProps {
  snapshots: HealthSnapshot[];
  plantName: string;
}

export default function PlantHealthTimeline({ snapshots, plantName }: PlantHealthTimelineProps) {
  const [selectedIndex, setSelectedIndex] = useState(snapshots.length - 1);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIndex, setCompareIndex] = useState(0);

  if (snapshots.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No health history available yet</Typography>
      </Paper>
    );
  }

  const currentSnapshot = snapshots[selectedIndex];
  const earliestSnapshot = snapshots[0];
  const healthImprovement = currentSnapshot.aiAnalysis.healthScore - earliestSnapshot.aiAnalysis.healthScore;
  const daysTracked = Math.floor(
    (new Date(currentSnapshot.timestamp).getTime() - new Date(earliestSnapshot.timestamp).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const compareSnapshot = snapshots[compareIndex];

  return (
    <Stack spacing={3}>
      {/* Header Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimelineIcon />
                <Typography variant="h6">{daysTracked} Days</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Tracking Period</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: healthImprovement >= 0 
              ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' 
              : 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
            color: 'white' 
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                {healthImprovement >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography variant="h6">
                  {healthImprovement > 0 ? '+' : ''}{healthImprovement.toFixed(1)}%
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Health Change</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocalFloristIcon />
                <Typography variant="h6">{snapshots.length}</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Checkpoints</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compare Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Health Journey: {plantName}</Typography>
        <Chip
          icon={<CompareArrowsIcon />}
          label={compareMode ? 'Exit Compare' : 'Compare Photos'}
          onClick={() => setCompareMode(!compareMode)}
          color={compareMode ? 'primary' : 'default'}
          clickable
        />
      </Box>

      {/* Timeline Slider */}
      <Paper sx={{ p: 3 }}>
        <Typography gutterBottom>Timeline Scrubber</Typography>
        <Slider
          value={selectedIndex}
          onChange={(_, value) => setSelectedIndex(value as number)}
          min={0}
          max={snapshots.length - 1}
          marks={snapshots.map((_, idx) => ({ value: idx, label: '' }))}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => new Date(snapshots[value].timestamp).toLocaleDateString()}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(earliestSnapshot.timestamp).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(snapshots[snapshots.length - 1].timestamp).toLocaleDateString()}
          </Typography>
        </Stack>
      </Paper>

      {/* Photo Comparison or Single View */}
      {compareMode ? (
        <Grid container spacing={3}>
          {/* Before Photo */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Before</Typography>
              <Slider
                value={compareIndex}
                onChange={(_, value) => setCompareIndex(value as number)}
                min={0}
                max={snapshots.length - 1}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => new Date(snapshots[value].timestamp).toLocaleDateString()}
                sx={{ mb: 2 }}
              />
              {compareSnapshot.photoUrl ? (
                <Box
                  component="img"
                  src={compareSnapshot.photoUrl}
                  alt={`${plantName} before`}
                  sx={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2, mb: 2 }}>
                  <Typography color="text.secondary">No photo available</Typography>
                </Box>
              )}
              <Chip 
                label={`Health: ${compareSnapshot.aiAnalysis.healthScore}%`} 
                size="small" 
                sx={{ bgcolor: getHealthColor(compareSnapshot.aiAnalysis.healthScore), color: 'white' }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {new Date(compareSnapshot.timestamp).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>

          {/* After Photo */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>After</Typography>
              <Box sx={{ height: 42, mb: 2 }} /> {/* Spacer for alignment */}
              {currentSnapshot.photoUrl ? (
                <Box
                  component="img"
                  src={currentSnapshot.photoUrl}
                  alt={`${plantName} after`}
                  sx={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2, mb: 2 }}>
                  <Typography color="text.secondary">No photo available</Typography>
                </Box>
              )}
              <Chip 
                label={`Health: ${currentSnapshot.aiAnalysis.healthScore}%`} 
                size="small"
                sx={{ bgcolor: getHealthColor(currentSnapshot.aiAnalysis.healthScore), color: 'white' }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {new Date(currentSnapshot.timestamp).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>

          {/* Comparison Summary */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
              <Typography variant="h6" gutterBottom>Comparison Analysis</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Health Score Change</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h4">
                      {currentSnapshot.aiAnalysis.healthScore - compareSnapshot.aiAnalysis.healthScore > 0 ? '+' : ''}
                      {(currentSnapshot.aiAnalysis.healthScore - compareSnapshot.aiAnalysis.healthScore).toFixed(1)}%
                    </Typography>
                    {currentSnapshot.aiAnalysis.healthScore > compareSnapshot.aiAnalysis.healthScore ? (
                      <TrendingUpIcon color="success" fontSize="large" />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="large" />
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Time Period</Typography>
                  <Typography variant="h4">
                    {Math.floor(
                      (new Date(currentSnapshot.timestamp).getTime() - new Date(compareSnapshot.timestamp).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )} days
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        /* Single Snapshot View */
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Snapshot: {new Date(currentSnapshot.timestamp).toLocaleDateString()}
              </Typography>
              {currentSnapshot.photoUrl ? (
                <Box
                  component="img"
                  src={currentSnapshot.photoUrl}
                  alt={plantName}
                  sx={{ width: '100%', height: 350, objectFit: 'cover', borderRadius: 2 }}
                />
              ) : (
                <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                  <Typography color="text.secondary">No photo available</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Overall Health</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress 
                      variant="determinate" 
                      value={currentSnapshot.aiAnalysis.healthScore} 
                      sx={{ 
                        flex: 1, 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getHealthColor(currentSnapshot.aiAnalysis.healthScore)
                        }
                      }} 
                    />
                    <Typography variant="h6">{currentSnapshot.aiAnalysis.healthScore}%</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Status: {getHealthLabel(currentSnapshot.aiAnalysis.healthScore)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>AI Confidence</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentSnapshot.aiAnalysis.confidence} 
                    sx={{ height: 8, borderRadius: 4 }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {currentSnapshot.aiAnalysis.confidence}% confidence
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Leaf Color Analysis</Typography>
                  <Chip label={currentSnapshot.aiAnalysis.leafColor} size="small" sx={{ mr: 1 }} />
                </Box>

                {currentSnapshot.aiAnalysis.diseaseIndicators.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Detected Issues</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {currentSnapshot.aiAnalysis.diseaseIndicators.map((indicator, idx) => (
                        <Chip key={idx} label={indicator} size="small" color="warning" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {currentSnapshot.treatment && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Treatment Applied</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                      <Typography variant="body2">{currentSnapshot.treatment}</Typography>
                    </Paper>
                  </Box>
                )}

                {currentSnapshot.sensorData && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Sensor Data</Typography>
                    <Grid container spacing={1}>
                      {currentSnapshot.sensorData.temperature && (
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Temp</Typography>
                            <Typography variant="body2">{currentSnapshot.sensorData.temperature}°C</Typography>
                          </Paper>
                        </Grid>
                      )}
                      {currentSnapshot.sensorData.humidity && (
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Humidity</Typography>
                            <Typography variant="body2">{currentSnapshot.sensorData.humidity}%</Typography>
                          </Paper>
                        </Grid>
                      )}
                      {currentSnapshot.sensorData.soilMoisture && (
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Soil</Typography>
                            <Typography variant="body2">{currentSnapshot.sensorData.soilMoisture}%</Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {currentSnapshot.notes && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">{currentSnapshot.notes}</Typography>
                    </Paper>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Stack>
  );
}

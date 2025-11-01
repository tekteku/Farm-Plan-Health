import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import type { FarmPerformanceMetrics, Badge } from '../types';

interface FarmPerformanceDashboardProps {
  metrics: FarmPerformanceMetrics;
}

export default function FarmPerformanceDashboard({ metrics }: FarmPerformanceDashboardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success.main';
    if (grade === 'B') return 'info.main';
    if (grade === 'C') return 'warning.main';
    return 'error.main';
  };

  const getBadgeColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'epic': return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
      case 'rare': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      default: return 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)';
    }
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <StarIcon />;
      case 'camera': return <CameraAltIcon />;
      case 'speed': return <SpeedIcon />;
      case 'shield': return <ShieldIcon />;
      case 'fire': return <LocalFireDepartmentIcon />;
      default: return <EmojiEventsIcon />;
    }
  };

  return (
    <Stack spacing={3}>
      {/* Overall Score Card */}
      <Paper 
        sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h4">Farm Health Score</Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
                  {metrics.overallScore}
                </Typography>
                <Typography variant="h4" sx={{ opacity: 0.8 }}>/100</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={`Grade: ${metrics.weeklyGrade}`} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }} 
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocalFireDepartmentIcon />
                  <Typography variant="body1">
                    {metrics.streak} day streak
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Weekly Performance Breakdown
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption">Health Improvement</Typography>
                    <Typography variant="caption">{metrics.trends.healthImprovement}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, metrics.trends.healthImprovement)} 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption">Prevention Rate</Typography>
                    <Typography variant="caption">{metrics.trends.preventionRate}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.trends.preventionRate} 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ROI Metrics */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <AttachMoneyIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">${metrics.roi.costSaved}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Cost Saved</Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Early detection prevented crop losses and reduced treatment costs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">+{metrics.roi.yieldIncrease}%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Yield Increase</Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Estimated improvement from optimized plant health management
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <TimerIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">{metrics.roi.timeEfficiency}h</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Time Saved</Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Average hours saved per week with automated monitoring
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Badges & Achievements */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: 'warning.main' }}>
            <EmojiEventsIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Achievements & Badges</Typography>
            <Typography variant="body2" color="text.secondary">
              {metrics.badges.filter(b => b.earnedDate).length} of {metrics.badges.length} earned
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {metrics.badges.map((badge) => (
            <Grid item xs={6} sm={4} md={3} key={badge.id}>
              <Tooltip title={badge.description} arrow>
                <Card 
                  sx={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    opacity: badge.earnedDate ? 1 : 0.4,
                    background: badge.earnedDate ? getBadgeColor(badge.rarity) : 'grey.100',
                    color: badge.earnedDate ? 'white' : 'text.secondary',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: badge.earnedDate ? 'scale(1.05)' : 'none'
                    }
                  }}
                >
                  <CardContent>
                    <Avatar 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        margin: '0 auto',
                        mb: 1,
                        bgcolor: badge.earnedDate ? 'rgba(255, 255, 255, 0.2)' : 'grey.300'
                      }}
                    >
                      {getBadgeIcon(badge.icon)}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {badge.name}
                    </Typography>
                    {badge.earnedDate ? (
                      <Typography variant="caption">
                        {new Date(badge.earnedDate).toLocaleDateString()}
                      </Typography>
                    ) : badge.progress !== undefined ? (
                      <Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={badge.progress} 
                          sx={{ 
                            mt: 1, 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: 'rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Typography variant="caption">{badge.progress}%</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption">Locked</Typography>
                    )}
                    {badge.rarity !== 'common' && (
                      <Chip 
                        label={badge.rarity} 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          fontSize: '0.65rem',
                          height: 20,
                          bgcolor: 'rgba(255, 255, 255, 0.2)'
                        }} 
                      />
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recent Achievements */}
      {metrics.achievements.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Achievements</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {metrics.achievements.slice(0, 3).map((achievement) => (
              <Card key={achievement.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <StarIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={new Date(achievement.unlockedDate).toLocaleDateString()} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Performance Insights */}
      <Paper sx={{ p: 3, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
        <Typography variant="h6" gutterBottom>Performance Insights</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">Average Response Time</Typography>
              <Typography variant="h5">{metrics.trends.responseTime} hours</Typography>
              <Typography variant="caption" color="success.main">
                ✓ 23% faster than last week
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">Prevention Success Rate</Typography>
              <Typography variant="h5">{metrics.trends.preventionRate}%</Typography>
              <Typography variant="caption" color="success.main">
                ✓ Caught {Math.round((metrics.trends.preventionRate / 100) * 10)} issues early
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">Health Improvement</Typography>
              <Typography variant="h5">+{metrics.trends.healthImprovement}%</Typography>
              <Typography variant="caption" color="success.main">
                ✓ Consistent upward trend
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}

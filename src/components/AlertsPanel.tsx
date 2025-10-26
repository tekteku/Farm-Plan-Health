import React from 'react'
import { List, ListItem, ListItemText, Typography, Divider, ListItemIcon, Chip } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import type { Plant } from '../types'

export default function AlertsPanel({ plants }: { plants: Plant[] }) {
  const needsAttention = plants.filter((p) => p.health === 'unhealthy' || p.health === 'needs-check');
  const healthStatusLabel: Record<Plant['health'], string> = {
    healthy: 'Healthy',
    'needs-check': 'Needs Check',
    unhealthy: 'Unhealthy',
  };

  return (
    <div>
      <Typography variant="h6">Alerts & Warnings</Typography>
      <Divider sx={{ mb: 1 }} />
      {needsAttention.length === 0 ? (
        <Typography color="text.secondary">No alerts at this time.</Typography>
      ) : (
        <List dense>
          {needsAttention.map((p) => (
            <ListItem key={p.id} secondaryAction={
              <Chip 
                label={healthStatusLabel[p.health]} 
                size="small" 
                color={p.health === 'unhealthy' ? 'error' : 'warning'}
              />
            }>
              <ListItemIcon sx={{minWidth: 32}}>
                {p.health === 'unhealthy' ? <ReportProblemOutlinedIcon color="error" /> : <WarningAmberIcon color="warning" />}
              </ListItemIcon>
              <ListItemText primary={p.name} secondary={`Last checked on ${new Date(p.lastChecked).toLocaleDateString()}`} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}

import React, { useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import { Box, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import type { Plant } from '../types'

type StatusMeta = {
  label: string
  chipColor: 'error' | 'warning' | 'default' | 'info'
  Icon: typeof ReportProblemOutlinedIcon
  severity: number
}

const STATUS_META: Record<Plant['health'], StatusMeta> = {
  healthy: {
    label: 'Healthy',
    chipColor: 'info',
    Icon: CheckCircleOutlineIcon,
    severity: 5,
  },
  'needs-check': {
    label: 'Needs Check',
    chipColor: 'warning',
    Icon: WarningAmberIcon,
    severity: 55,
  },
  unhealthy: {
    label: 'Critical',
    chipColor: 'error',
    Icon: ReportProblemOutlinedIcon,
    severity: 85,
  },
  unknown: {
    label: 'Unknown',
    chipColor: 'default',
    Icon: HelpOutlineIcon,
    severity: 35,
  },
}

function getTimeSince(lastChecked: string) {
  const ts = Date.parse(lastChecked)
  if (Number.isNaN(ts)) return 'N/A'
  const diffMs = Date.now() - ts
  const diffHours = Math.floor(diffMs / 36e5)
  if (diffHours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / 6e4))
    return `${mins}m ago`
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  const days = Math.floor(diffHours / 24)
  return `${days}d ago`
}

export default function AlertsPanel({ plants }: { plants: Plant[] }) {
  const prioritizedAlerts = useMemo(() => {
    return plants
      .filter((plant) => plant.health === 'unhealthy' || plant.health === 'needs-check' || plant.health === 'unknown')
      .map((plant) => {
        const meta = STATUS_META[plant.health]
        const hoursSinceCheck = Math.max(1, (Date.now() - Date.parse(plant.lastChecked)) / 36e5 || 1)
        const urgency = Math.min(100, meta.severity + Math.min(40, hoursSinceCheck * 2))
        return { plant, meta, urgency }
      })
      .sort((a, b) => b.urgency - a.urgency)
  }, [plants])

  if (prioritizedAlerts.length === 0) {
    return (
      <Box>
        <Typography variant="h6">Alerts & Warnings</Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack
          spacing={1.5}
          alignItems="center"
          sx={{
            px: 3,
            py: 4,
            borderRadius: 3,
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
            border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <TaskAltIcon color="success" fontSize="large" />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            All clear — nothing needs your attention.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Keep monitoring sensors and uploading plant photos so we can warn you before issues emerge.
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">Alerts & Warnings</Typography>
        <Chip label={`${prioritizedAlerts.length} active`} color="error" size="small" />
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {prioritizedAlerts.map(({ plant, meta, urgency }) => {
          const Icon = meta.Icon
          const iconColor = meta.chipColor === 'error' ? 'error' : meta.chipColor === 'warning' ? 'warning' : 'action'

          return (
            <Box
              key={plant.id}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                bgcolor: (theme) => alpha(theme.palette.error.main, meta.chipColor === 'warning' ? 0.04 : 0.08),
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Icon color={iconColor} />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {plant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last checked {getTimeSince(plant.lastChecked)}
                    </Typography>
                  </div>
                </Stack>
              <Chip label={meta.label} color={meta.chipColor} size="small" />
            </Stack>
            {plant.notes && (
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                {plant.notes}
              </Typography>
            )}
            <Stack spacing={0.5} sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Urgency
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {Math.round(urgency)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={urgency}
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.4)' }}
              />
            </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

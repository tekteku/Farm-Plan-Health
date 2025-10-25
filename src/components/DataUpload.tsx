import React from 'react'
import { Button, Typography } from '@mui/material'

export default function DataUpload() {
  return (
    <div>
      <Typography variant="h6">Data Upload / Entry</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Upload CSV to batch import plants or use the form to add a single plant.</Typography>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outlined">Upload CSV</Button>
        <Button variant="contained">Add Plant</Button>
      </div>
    </div>
  )
}

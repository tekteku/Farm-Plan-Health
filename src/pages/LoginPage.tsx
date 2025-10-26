import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button, TextField, Paper, Typography, Container, Link, Box } from '@mui/material'

export default function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string

    auth.signin(username, () => {
      navigate('/', { replace: true })
    })
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in to Farm Health
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>
        <Box>
          <Link component={RouterLink} to="/signup" variant="body2">
            Need an account? Create one
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}

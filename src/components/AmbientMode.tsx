import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Typography, IconButton, Paper, Chip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Plant } from '../types';

interface AmbientModeProps {
  plants: Plant[];
  onExit: () => void;
}

const AmbientMode: React.FC<AmbientModeProps> = ({ plants, onExit }) => {
  const commands = [
    {
      command: 'show unhealthy plants',
      callback: () => {
        const unhealthyPlants = plants.filter(p => p.health === 'unhealthy').map(p => p.name).join(', ');
        setResponse(`The following plants are unhealthy: ${unhealthyPlants || 'None'}.`);
      },
    },
    {
      command: 'how many plants are healthy',
      callback: () => {
        const healthyCount = plants.filter(p => p.health === 'healthy').length;
        setResponse(`There are ${healthyCount} healthy plants.`);
      },
    },
    {
      command: 'read notes for *',
      callback: (plantName: string) => {
        const plant = plants.find(p => p.name.toLowerCase() === plantName.toLowerCase());
        setResponse(plant ? `Notes for ${plant.name}: ${plant.notes || 'No notes available.'}` : `I couldn't find a plant named ${plantName}.`);
      },
    },
    {
      command: 'exit ambient mode',
      callback: () => onExit(),
    }
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });

  const [response, setResponse] = React.useState('Hello! How can I help you today? Try saying "show unhealthy plants".');

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <Typography color="error">Browser doesn't support speech recognition.</Typography>;
  }

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4">Ambient Mode</Typography>
        <Typography color="text.secondary">I'm listening. Try one of the available commands.</Typography>
        <Box sx={{ my: 2 }}>
            <Chip label="show unhealthy plants" variant="outlined" sx={{mr: 1}}/>
            <Chip label="how many plants are healthy" variant="outlined" sx={{mr: 1}}/>
            <Chip label="read notes for [plant name]" variant="outlined" sx={{mr: 1}}/>
            <Chip label="exit ambient mode" variant="outlined" />
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Conversation Log</Typography>
        <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          Your command: "{transcript}"
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Farm Hand: {response}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <IconButton
          color={listening ? 'primary' : 'default'}
          onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true })}
          sx={{ border: '1px solid', p: 2 }}
        >
          {listening ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default AmbientMode;

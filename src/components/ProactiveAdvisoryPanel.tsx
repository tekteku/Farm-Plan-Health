import React from 'react';
import { Paper, Typography, Stack, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PestControlIcon from '@mui/icons-material/PestControl';
import GrassIcon from '@mui/icons-material/Grass';
import type { Plant } from '../types';

interface Advisory {
  id: string;
  icon: React.ReactElement;
  title: string;
  description: string;
  type: 'opportunity' | 'efficiency' | 'risk';
}

// This is a mock analysis engine. In the future, this would be a complex AI model.
const generateAdvisories = (plants: Plant[]): Advisory[] => {
  const advisories: Advisory[] = [];
  const plantTypes = new Set(plants.map((p) => p.type));
  const plantNames = new Set(plants.map((p) => p.name));

  if (plantNames.has('Tomato') && !plantNames.has('Basil')) {
    advisories.push({
      id: 'adv001',
      icon: <PestControlIcon color="success" />,
      title: 'Companion planting opportunity',
      description: 'Add basil near tomatoes to deter pests naturally and enhance flavor.',
      type: 'opportunity',
    });
  }

  if (plantTypes.size === 1 && plantTypes.has('Vegetable')) {
    advisories.push({
      id: 'adv002',
      icon: <GrassIcon color="info" />,
      title: 'Diversify your beds',
      description: 'Consider rotating in legumes or herbs to balance soil nutrients and reduce disease risk.',
      type: 'efficiency',
    });
  }

  advisories.push({
    id: 'adv003',
    icon: <AutoAwesomeIcon color="primary" />,
    title: 'Predictive irrigation update',
    description: 'AI models expect a dry spell next week. Prepare spot irrigation for moisture-sensitive crops.',
    type: 'risk',
  });

  return advisories;
};

export default function ProactiveAdvisoryPanel({ plants }: { plants: Plant[] }) {
  const advisories = generateAdvisories(plants);

  return (
    <Paper sx={{ p: 3, height: '100%', background: 'linear-gradient(160deg, rgba(64,145,108,0.05), rgba(45,106,79,0.15))' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AutoAwesomeIcon />
        </Avatar>
        <Typography variant="h6">Proactive Advisories</Typography>
      </Stack>
      <List dense>
        {advisories.map((advisory, index) => (
          <React.Fragment key={advisory.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent' }}>
                  {advisory.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={advisory.title}
                secondary={advisory.description}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            {index < advisories.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

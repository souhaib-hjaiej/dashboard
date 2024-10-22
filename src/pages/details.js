import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Avatar, Select, MenuItem, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ImageCarousel from '../components/images';
import axios from 'axios';

const CollaboratorDetails = () => {
  const location = useLocation();
  const collaboratorData = location.state?.data || {};
  const images = [
    'logo192.png',
    'logo512.png',
  ];
 

  // Initialize state variables with default values
  
  const [selectedAccountStatus, setSelectedAccountStatus] = useState('');
  const [selectedTechnicalBadge, setSelectedTechnicalBadge] = useState('');
  const [selectedCommunicationBadge, setSelectedCommunicationBadge] = useState('');
  const [selectedEngagementBadge, setSelectedEngagementBadge] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(''); // To store selected specialty
  const [selectedExperienceYears, setSelectedExperienceYears] = useState(''); // To store years of experience

  const specialisteBadge = async () => {
    // Prepare the data to send in the request
    const data = {
        userId: collaboratorData._id, // Replace with the actual user ID
        specialtyName: selectedSpecialty, // The selected specialty
        newBadges: [
            selectedTechnicalBadge, // Technical Badge
            selectedExperienceYears, // Experience Years
            selectedCertificate, // Certificate
        ].filter(badge => badge), // Filter out any empty values
    };

    try {
        // Make the request to your API endpoint
        const response = await axios.post('http://localhost:3000/badge/specialite', data); // Replace with your actual endpoint
        console.log('Success:', response.data);

        // Clear the form by resetting the state variables
        setSelectedTechnicalBadge('');
        setSelectedSpecialty('');
        setSelectedExperienceYears('');
        setSelectedCertificate('');
        
        // Optionally, show a success message or redirect
    } catch (error) {
        console.error('Error saving data:', error);
        // Handle error (e.g., show an error message)
    }
};

const handleSave = async () => {
  // Prepare the data to send in the request
  const data = {
      userId: collaboratorData._id, // Replace with the actual user ID
      newBadges: [
          selectedCommunicationBadge, // Only include if a badge is selected
          selectedEngagementBadge // Only include if a badge is selected
      ].filter(badge => badge), // Filter out any empty values
      active: selectedAccountStatus // Set to the value selected in the dropdown
  };

  try {
      // Replace 'your-api-url' with your actual API endpoint
      const response = await axios.post('http://localhost:3000/badge/add', data);

      // Handle the response as needed
      console.log('Data saved successfully:', response.data);

      // Clear the form by resetting the state variables
      setSelectedAccountStatus('');
      setSelectedTechnicalBadge('');
      setSelectedCommunicationBadge('');
      setSelectedEngagementBadge('');
      setSelectedCertificate('');
      setSelectedSpecialty('');
      setSelectedExperienceYears('');
      
      // Optionally, show a success message
  } catch (error) {
      console.error('Error saving data:', error);
      // Handle the error as needed, such as displaying an error message
  }
};



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, p: 2 }}>
      <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={collaboratorData.file} 
            alt={`${collaboratorData.prenom} ${collaboratorData.nom}`} 
            sx={{ width: 100, height: 100, mr: 3, boxShadow: 2 }}
          />

            <Box>
              <Typography variant="h5" component="div">
                {collaboratorData.prenom} {collaboratorData.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {collaboratorData.role}
              </Typography>
            </Box>
          </Box>

          {/* Rest of the card content remains the same */}
          {/* ... */}
          <Grid container spacing={2}>
  <Grid item xs={6}>
    <Typography variant="subtitle1" color="text.secondary">
      Email:
    </Typography>
    <Typography variant="body1">{collaboratorData.email}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="subtitle1" color="text.secondary">
      Number:
    </Typography>
    <Typography variant="body1">{collaboratorData.num}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="subtitle1" color="text.secondary">
      Description:
    </Typography>
    <Typography variant="body1">{collaboratorData.description}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="subtitle1" color="text.secondary">
        Specialité:
    </Typography>
    <Typography variant="body1">
        {collaboratorData.specialites.map(specialty => specialty.name).join(', ')}
    </Typography>
</Grid>

</Grid>

        </CardContent>
      </Card>

      {/* Display images  below the card */}

      <Box  sx={{ width: 600, margin: 'auto', mt: 4 }}>
      <ImageCarousel imageUrls={images} />
      </Box>





{/* Selection Options Card */}
<Box sx={{ mt: 4, width: '100%', maxWidth: 800, boxShadow: 0, border: 'none' }}>
    <Card sx={{ boxShadow: 2 }}>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Activation et Badge Personnel
            </Typography>

            {/* Account Status Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Accepter le compte</Typography>
                <Select
                    value={selectedAccountStatus}
                    onChange={(e) => setSelectedAccountStatus(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="non active">Non Active</MenuItem>
                </Select>
            </Box>

            {/* Communication Badge Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Ajouter un badge de Communication</Typography>
                <Select
                    value={selectedCommunicationBadge}
                    onChange={(e) => setSelectedCommunicationBadge(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="communicateur_exemplar">Communicateur Exemplar (Or)</MenuItem>
                    <MenuItem value="facilitateur">Facilitateur (Argent)</MenuItem>
                    <MenuItem value="ecoute_active">Écoute Active (Bronze)</MenuItem>
                </Select>
            </Box>

            {/* Engagement Badge Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Ajouter un badge d'Engagement</Typography>
                <Select
                    value={selectedEngagementBadge}
                    onChange={(e) => setSelectedEngagementBadge(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="ambassadeur_entreprise">Ambassadeur de l'Entreprise (Or)</MenuItem>
                    <MenuItem value="engage_communautaire">Engagé Communautaire (Argent)</MenuItem>
                    <MenuItem value="participation_active">Participation Active (Bronze)</MenuItem>
                </Select>
            </Box>

            <Button variant="contained" color="primary" onClick={handleSave}>
                Enregistrer
            </Button>
        </CardContent>
    </Card>

    {/* Competence Form */}
    <Card sx={{ mb: 3, mt: 4, boxShadow: 2 }}>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Compétence Technique
            </Typography>

            {/* Specialty Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Spécialité</Typography>
                <Select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {collaboratorData.specialites.map((specialty) => (
                        <MenuItem key={specialty.id} value={specialty.name}>
                            {specialty.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Technical Badge Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Ajouter un badge de Compétence Technique</Typography>
                <Select
                    value={selectedTechnicalBadge}
                    onChange={(e) => setSelectedTechnicalBadge(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="expert_technique">Expert Technique (Or)</MenuItem>
                    <MenuItem value="specialiste">Spécialiste (Argent)</MenuItem>
                    <MenuItem value="technicien_competent">Technicien Compétent (Bronze)</MenuItem>
                </Select>
            </Box>

            {/* Experience Years Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Années d'expérience</Typography>
                <Select
                    value={selectedExperienceYears}
                    onChange={(e) => setSelectedExperienceYears(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="1">1 an</MenuItem>
                    <MenuItem value="2">2 ans</MenuItem>
                    <MenuItem value="3">3 ans</MenuItem>
                    <MenuItem value="4">4 ans</MenuItem>
                    <MenuItem value="5">5 ans ou plus</MenuItem>
                </Select>
            </Box>

            {/* Certificate Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Avoir un certificat</Typography>
                <Select
                    value={selectedCertificate}
                    onChange={(e) => setSelectedCertificate(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="academique_certificate">Certificat Académique</MenuItem>
                    <MenuItem value="certificat_professionnel">Certificat Professionnel</MenuItem>
                    <MenuItem value="certificat_technique">Certificat Technique</MenuItem>
                </Select>
            </Box>

            <Button variant="contained" color="primary" onClick={specialisteBadge}>
                Enregistrer
            </Button>
        </CardContent>
    </Card>
</Box>


    </Box>
  );
};

export default CollaboratorDetails;

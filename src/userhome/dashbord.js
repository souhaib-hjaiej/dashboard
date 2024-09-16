import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const Dashboard = () => {
  // Données pour les cards
  const cardData = [
    { title: 'pus', number: 700 },
    { title: 'employés', number: 1000 },
    { title: 'pus affecté', number: 650 },
    { title: 'pus non affecté', number: 50 },
  ];

  // Données pour les graphiques
  const pieChartData = [
    { title: 'AFI', number: 120 },
    { title: 'AFX', number: 90 },
    { title: 'BOX', number: 80 },
    { title: 'CLE', number: 150 },
    { title: 'AZIZA', number: 60 },
    { title: 'ALARME', number: 50 },
    { title: 'ASTREINTE', number: 70 },
    { title: 'TRANSPORT', number: 110 },
    { title: 'LOGISTIQUE', number: 140 },
    { title: 'DAHLIA ICE', number: 40 },
    { title: 'UNIVERS TRANSPORT', number: 130 },
    { title: 'UNIVERS LOGISTIQUE', number: 100 },
    { title: 'PRESTAIRE DE SERVICE', number: 75 },
  ];

  // Données pour le Pie Chart 2
  const employeeData = [
    { title: 'AZIZA', number: 60 },
    { title: 'LOGISTIQUE', number: 140 },
    { title: 'TRANSPORT', number: 110 },
    { title: 'UNIVERS TRANSPORT', number: 130 },
    { title: 'UNIVERS LOGISTIQUE', number: 100 },
  ];

  // Données pour le Bar Chart
  const siteData = [
    { title: 'GT', number: 120 },
    { title: 'SUD', number: 90 },
    { title: 'SFAX', number: 80 },
    { title: 'SAHLIN', number: 150 },
    { title: 'BOUARGOUB', number: 60 },
  ];

  // Préparer les données pour les graphiques
  const pieData1 = {
    labels: pieChartData.map(item => item.title),
    datasets: [
      {
        label: 'Quantités par Type de SIM',
        data: pieChartData.map(item => item.number),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(199, 199, 199, 0.2)',
          'rgba(83, 102, 255, 0.2)',
          'rgba(255, 99, 71, 0.2)',
          'rgba(128, 0, 128, 0.2)',
          'rgba(0, 255, 255, 0.2)',
          'rgba(255, 215, 0, 0.2)',
          'rgba(139, 69, 19, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 71, 1)',
          'rgba(128, 0, 128, 1)',
          'rgba(0, 255, 255, 1)',
          'rgba(255, 215, 0, 1)',
          'rgba(139, 69, 19, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData2 = {
    labels: employeeData.map(item => item.title),
    datasets: [
      {
        label: 'Nombre d\'Employés par Société',
        data: employeeData.map(item => item.number),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: siteData.map(item => item.title),
    datasets: [
      {
        label: 'Nombre d\'Employés par Site',
        data: siteData.map(item => item.number),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Répartition des SIM',
        font: {
          size: 18,
        },
        padding: {
          bottom: 10,
        },
      },
      datalabels: {
        color: '#fff',
        display: true,
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
      },
    },
  };

  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Nombre d\'Employés par Site',
        font: {
          size: 18,
        },
        padding: {
          bottom: 10,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Affichage des cartes */}
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="h6" component="div">
                  {card.number}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div>
      <Typography
      variant="h6"
      component="div"
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
      }}
    >
      titre
    </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      
      <div style={{ width: '30%' }}>
          {/* Affichage du Pie Chart 2 */}
          <Pie data={pieData2} options={pieOptions} />
        </div>
        <div style={{ width: '65%' }}>
          {/* Affichage du Pie Chart 1 */}
          <Bar data={barData} options={barOptions} />

        </div>
       
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70%' }}>
  <div style={{ width: '35%', display: 'flex', flexDirection: 'column' }}>
    <Typography
      variant="h6"
      component="div"
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
      }}
    >
      titre
    </Typography>
    <Pie data={pieData1} options={{ ...pieOptions, plugins: { ...pieOptions.plugins, title: { ...pieOptions.plugins.title, text: 'Quantités par Type de SIM' } } }} />
  </div>
</div>

    </div>
  );
};

export default Dashboard;
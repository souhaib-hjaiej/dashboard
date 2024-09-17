import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_employees: 0,
        employees_by_site: [],
        employees_by_societe: [],
    });
    const [totalpus, setTotalpus] = useState(0);
    const [affectpus, setAffectpus] = useState(0);
    const [nonaffectpus, setNonAffectpus] = useState(0);
    const [societeData, setSocieteData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [totalResponse, totalpuce, affectuerpus, pussociete] = await Promise.all([
                    axios.get('http://localhost:3000/dashboard/count/employee'),
                    axios.get('http://localhost:3000/dashboard/count'),
                    axios.get('http://localhost:3000/dashboard/count/affectation'),
                    axios.get('http://localhost:3000/dashboard/count/societe') // Replace with actual endpoint
                ]);
                setSocieteData(pussociete.data);
                setStats(totalResponse.data);
                setTotalpus(totalpuce.data.total);
                setAffectpus(affectuerpus.data.pus_affecter);
                setNonAffectpus(affectuerpus.data.pus_non_affecter);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    const cardData = [
        { title: 'pus', number: totalpus},
        { title: 'employés', number: stats.total_employees },
        { title: 'pus affecté', number: affectpus },
        { title: 'pus non affecté', number: nonaffectpus },
      ];
    // Données pour les cards
   

    // Données pour les graphiques
    const pieChartData = societeData.map(item => ({
        title: item.societe,
        number: item.total
    }));

    const employeeData = stats.employees_by_societe.map(item => ({
        title: item.societe,
        number: item.total
    }));

    const siteData = stats.employees_by_site.map(item => ({
        title: item.site,
        number: item.total
    }));

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
                color: '#888',
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
                    size: 20,
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

    // Determine the size of the pie charts
    const getPieChartSize = (dataLength) => {
        return dataLength > 10 ? { width: '400px', height: '400px' } : { width: '300px', height: '300px' };
    };

    return (
        <div>
            <Grid container spacing={2}>
                {/* Top Row: Bar chart and
                 Pie chart for Nombre d'Employés par Société */}
                   <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {cardData.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="h5" component="div" style={{ textAlign: 'center' }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>
                        {card.number}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>   
                ))}
            </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Nombre d'Employés par Société
                            </Typography>
                            <div style={{ width: '100%', height: '300px' }}>
                                <Pie data={pieData2} options={pieOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Nombre d'Employés par Site
                            </Typography>
                            <div style={{ width: '100%', height: '300px' }}>
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Bottom Row: Pie chart for Répartition des SIM */}
                <Grid item xs={12}>
    <Card>
        <CardContent>
            <Typography variant="h6" component="div">
                Répartition des SIM
            </Typography>
            <div style={{ width: '100%', height: '600px' }}>
                <Bar data={pieData1} options={barOptions} />
            </div>
        </CardContent>
    </Card>
</Grid>

            </Grid>
          
        </div>
    );
};

export default Dashboard;

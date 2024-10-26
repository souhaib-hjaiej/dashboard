import {useEffect, useState} from 'react';
import React from 'react';
import {Grid, Card, CardContent, Typography} from '@mui/material';
import {Pie, Bar} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCollaborators, setTotalCollaborators] = useState(0);
    const [totalcolabActive, setTotalcolabActive] = useState(0);
    const [totalcolabNonActive, setTotalcolabNonActive] = useState(0);
    const [specialtyData, setSpecialtyData] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        // Première requête : Récupérer le nombre total d'utilisateurs et de collaborateurs
        axios.get('http://localhost:3000/total').then(response => {
            setTotalUsers(response.data.totalUsers);
            setTotalCollaborators(response.data.totalCollaborators);
        });

        // Deuxième requête : Récupérer les collaborateurs actifs et inactifs
        axios.get('http://localhost:3000/statactive')
            .then(response => {
                const { activeCount, nonActiveCount } = response.data.data;
                setTotalcolabActive(activeCount);
                setTotalcolabNonActive(nonActiveCount);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données", error);
            });

        // Troisième requête : Récupérer les données de spécialité
        axios.get('http://localhost:3000/colaborateurspecialte').then(response => {
            setSpecialtyData(response.data.data);
        });

        // Quatrième requête : Récupérer les données de service
        axios.get('http://localhost:3000/applicationspecialte').then(response => {
            setServiceData(response.data.data);
        });
    }, []);

    const cardData = [
        { title: 'Utilisateurs Totals', number: totalUsers },
        { title: 'Collaborateurs Totals', number: totalCollaborators },
        { title: 'Collaborateurs Actifs', number: totalcolabActive },
        { title: 'Collaborateurs Inactifs', number: totalcolabNonActive },
    ];

    // Données pour les graphiques
    const pieChartData = serviceData.map(item => ({
        title: item.service ,
        number: item.count,
    }));

    const employeeData = serviceData.map(item => ({
        title: item.service ,
        number: item.count,
    }));

    const barData = {
        labels: specialtyData.map(item => item.specialty),
        datasets: [
            {
                label: "Nombre de collaborateur  par Specialite",
                data: specialtyData.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData1 = {
        labels: pieChartData.map(item => item.title),
        datasets: [
            {
                label: 'Répartition des services par spécialité',
                data: pieChartData.map(item => item.number),
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

    const pieData2 = {
        labels: employeeData.map(item => item.title),
        datasets: [
            {
                label: "Nombre de collaborateur  par Specialite",
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
                text: "Nombre de collaborateur  par Specialite",
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

    return (
        <div>
            <Grid container spacing={2}>
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
                                Collaborateurs par Spécialité
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
            </Grid>
        </div>
    );
};

export default Dashboard;

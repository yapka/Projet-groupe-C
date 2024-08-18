
 // Fonction pour générer une couleur unique
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Fonction pour charger et parser les données CSV
    function loadDataAndCreateCharts() {
        fetch('../dataset/des_forets.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors du chargement du fichier CSV');
                }
                return response.text();
            })
            .then(csvText => {
                // Parser les données CSV
                const parsedData = Papa.parse(csvText, {
                    header: true,
                    delimiter: ',',
                    skipEmptyLines: true
                });

                console.log(parsedData.data); // Ajouté pour le débogage

                // Agréger les données par région
                const regionMap = new Map();
                parsedData.data.forEach(row => {
                    const region = row.REGION?.trim();
                    let superficie = row.SUPERFICIE?.replace(/\s+/g, '').trim();
                    
                    if (region && superficie) {
                        superficie = parseFloat(superficie.replace(',', '.'));
                        
                        if (!isNaN(superficie)) {
                            if (regionMap.has(region)) {
                                regionMap.set(region, regionMap.get(region) + superficie);
                            } else {
                                regionMap.set(region, superficie);
                            }
                        } else {
                            console.warn(`Superficie non valide pour la région ${region}: ${superficie}`);
                        }
                    } else {
                        console.warn(`Données manquantes pour une ligne: ${JSON.stringify(row)}`);
                    }
                });

                // Extraire les données pour le graphique à barres
                const regions = Array.from(regionMap.keys());
                const superficies = Array.from(regionMap.values());

                // Créer le graphique à barres
                const ctxRegion = document.getElementById('regionChart').getContext('2d');
                new Chart(ctxRegion, {
                    type: 'bar',
                    data: {
                        labels: regions,
                        datasets: [{
                            label: 'Superficie des Forêts par Région (ha)',
                            data: superficies,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    autoSkip: false,
                                    maxRotation: 90,
                                    minRotation: 45
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                // Agréger les données par catégorie
                const categoryMap = new Map();
                parsedData.data.forEach(row => {
                    const category = row.CATEGORIE?.trim();
                    let superficie = row.SUPERFICIE?.replace(/\s+/g, '').trim();
                    
                    if (category && superficie) {
                        superficie = parseFloat(superficie.replace(',', '.'));
                        
                        if (!isNaN(superficie)) {
                            if (categoryMap.has(category)) {
                                categoryMap.set(category, categoryMap.get(category) + superficie);
                            } else {
                                categoryMap.set(category, superficie);
                            }
                        } else {
                            console.warn(`Superficie non valide pour la catégorie ${category}: ${superficie}`);
                        }
                    } else {
                        console.warn(`Données manquantes pour une ligne: ${JSON.stringify(row)}`);
                    }
                });

                // Extraire les données pour le graphique en secteurs
                const categories = Array.from(categoryMap.keys());
                const superficiesCategory = Array.from(categoryMap.values());

                // Créer un tableau de couleurs uniques pour chaque catégorie
                const colors = categories.map(() => getRandomColor());

                // Créer le graphique en secteurs
                const ctxCategory = document.getElementById('categoryChart').getContext('2d');
                new Chart(ctxCategory, {
                    type: 'pie',
                    data: {
                        labels: categories,
                        datasets: [{
                            label: 'Répartition des Superficies par Catégorie',
                            data: superficiesCategory,
                            backgroundColor: colors,
                            borderColor: '#fff',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const label = tooltipItem.label || '';
                                        const value = tooltipItem.raw || 0;
                                        return `${label}: ${value.toFixed(2)} ha`;
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Erreur lors du chargement du fichier CSV:', error));
    }

    // Appeler la fonction pour créer les graphiques
    loadDataAndCreateCharts();


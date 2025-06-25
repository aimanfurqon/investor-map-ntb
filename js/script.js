// Enhanced JavaScript dengan data investasi real dari DPMPTSP NTB

let map;
let markersLayer;
let citiesData = [];
let currentFilter = 'all';

// Inisialisasi peta dengan fokus ke NTB
function initializeMap() {
    map = L.map('map', {
        zoomControl: false,
        minZoom: 6,
        maxZoom: 18
    }).setView([-8.6500, 117.3616], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data: DPMPTSP NTB'
    }).addTo(map);

    map.on('click', function(e) {
        map.closePopup();
    });

    addNTBBoundary();

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

function addNTBBoundary() {
    const ntbBounds = [
        [-8.95, 115.35],
        [-8.05, 119.40]
    ];
    map.fitBounds(ntbBounds, { padding: [40, 40] });
}

function getMarkerStyle(type, investmentValue) {
    // Skala marker berdasarkan nilai investasi real
    let radius = 8;
    if (investmentValue > 100000000000000) { // > 100T
        radius = 20;
    } else if (investmentValue > 10000000000000) { // > 10T
        radius = 18;
    } else if (investmentValue > 1000000000000) { // > 1T
        radius = 16;
    } else if (investmentValue > 100000000000) { // > 100M
        radius = 14;
    } else if (investmentValue > 10000000000) { // > 10M
        radius = 12;
    } else if (investmentValue > 1000000000) { // > 1M
        radius = 10;
    }

    const styles = {
        'Ibu Kota': {
            color: '#f093fb',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            radius: Math.max(radius, 12), // Minimal 12 untuk ibu kota
            icon: 'fas fa-star'
        },
        'Kota': {
            color: '#4facfe',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            radius: Math.max(radius, 10),
            icon: 'fas fa-building'
        },
        'Kabupaten': {
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            radius: radius,
            icon: 'fas fa-mountain'
        }
    };
    
    return styles[type] || styles['Kabupaten'];
}

function formatCurrency(value) {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return 'Rp 0';
    
    if (numValue >= 1000000000000000) { // Kuadriliun
        return `Rp ${(numValue / 1000000000000000).toFixed(1)} Kuadriliun`;
    } else if (numValue >= 1000000000000) { // Triliun
        return `Rp ${(numValue / 1000000000000).toFixed(1)} Triliun`;
    } else if (numValue >= 1000000000) { // Miliar
        return `Rp ${(numValue / 1000000000).toFixed(1)} Miliar`;
    } else if (numValue >= 1000000) { // Juta
        return `Rp ${(numValue / 1000000).toFixed(1)} Juta`;
    }
    return `Rp ${numValue.toLocaleString('id-ID')}`;
}

function createAnimatedMarker(feature) {
    const investmentValue = parseInt(feature.properties.total_investment);
    const style = getMarkerStyle(feature.properties.type, investmentValue);
    const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    
    const customIcon = L.divIcon({
        html: `
            <div class="custom-marker" style="
                width: ${style.radius * 2}px;
                height: ${style.radius * 2}px;
                background: ${style.gradient};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${style.radius * 0.6}px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: markerPulse 2s infinite;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                z-index: 100;
            ">
                <i class="${style.icon}"></i>
            </div>
        `,
        className: 'custom-marker-container',
        iconSize: [style.radius * 2, style.radius * 2],
        iconAnchor: [style.radius, style.radius]
    });

    const marker = L.marker(coords, { icon: customIcon });
    
    const tooltipContent = `
        <div style="text-align: center; font-weight: 600;">
            <div style="font-size: 14px;">${feature.properties.name}</div>
            <div style="font-size: 11px; opacity: 0.8;">${feature.properties.type}</div>
            <div style="font-size: 10px; color: #4CAF50; margin-top: 2px;">
                ${formatCurrency(feature.properties.total_investment)}
            </div>
            <div style="font-size: 9px; color: #666; margin-top: 1px;">
                ${feature.properties.total_companies} Perusahaan
            </div>
        </div>
    `;
    
    marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip',
        offset: [0, -10]
    });
    
    const popupContent = createEnhancedPopupContent(feature.properties);
    marker.bindPopup(popupContent, {
        maxWidth: 450,
        className: 'custom-popup',
        closeButton: true,
        autoClose: false,
        closeOnClick: false
    });
    
    marker.on('mouseover', function(e) {
        L.DomEvent.stopPropagation(e);
        const markerElement = this._icon.querySelector('.custom-marker');
        if (markerElement) {
            markerElement.style.transform = 'scale(1.2)';
            markerElement.style.transition = 'transform 0.2s ease';
        }
        this.openTooltip();
    });
    
    marker.on('mouseout', function(e) {
        L.DomEvent.stopPropagation(e);
        const markerElement = this._icon.querySelector('.custom-marker');
        if (markerElement) {
            markerElement.style.transform = 'scale(1)';
        }
        this.closeTooltip();
    });
    
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        markersLayer.eachLayer(layer => {
            if (layer !== this && layer.isPopupOpen()) {
                layer.closePopup();
            }
        });
        this.openPopup();
    });
    
    return marker;
}

function createEnhancedPopupContent(properties) {
    const sectorIcons = {
        'ESDM': 'fas fa-bolt',
        'Pariwisata dan Ekonomi Kreatif': 'fas fa-camera',
        'Perdagangan': 'fas fa-store',
        'Perindustrian': 'fas fa-industry',
        'Kelautan dan Perikanan': 'fas fa-fish',
        'Telekomunikasi': 'fas fa-tower-cell',
        'Transportasi': 'fas fa-truck',
        'Kesehatan': 'fas fa-hospital',
        'Pertanian': 'fas fa-seedling',
        'Peternakan': 'fas fa-cow'
    };
    
    function getSectorIcon(sector) {
        return sectorIcons[sector] || 'fas fa-chart-line';
    }

    let topCompaniesList = properties.top_companies
        .map((company, index) => `
            <div class="company-item">
                <div class="company-rank">#${index + 1}</div>
                <div class="company-details">
                    <div class="company-name">${company.name}</div>
                    <div class="company-info">
                        <span class="company-sector">
                            <i class="${getSectorIcon(company.sector)}"></i>
                            ${company.sector}
                        </span>
                        <span class="company-type ${company.type}">${company.type}</span>
                    </div>
                    <div class="company-investment">${formatCurrency(company.investment)}</div>
                    ${company.district ? `<div class="company-district">📍 ${company.district}</div>` : ''}
                </div>
            </div>
        `).join('');

    let sectorsList = properties.main_sectors
        .map(sector => `
            <div class="sector-item">
                <i class="${getSectorIcon(sector)}"></i>
                ${sector}
            </div>
        `).join('');
    
    const pmaCount = properties.pma_count || 0;
    const pmdnCount = properties.pmdn_count || 0;
    const totalCompanies = pmaCount + pmdnCount;
    
    return `
        <div class="popup-content">
            <div class="popup-header">
                <h4>${properties.name}</h4>
                <div class="city-type">${properties.type}</div>
            </div>
            <div class="popup-body">
                <div class="popup-stats">
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Populasi</div>
                            <div class="stat-value">${properties.population} jiwa</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Realisasi Investasi</div>
                            <div class="stat-value">${formatCurrency(properties.total_investment)}</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-building"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Total Perusahaan</div>
                            <div class="stat-value">${totalCompanies} Perusahaan</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-globe"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">PMA : PMDN</div>
                            <div class="stat-value">${pmaCount} : ${pmdnCount}</div>
                        </div>
                    </div>
                </div>
                
                <div class="investment-section">
                    <h5><i class="fas fa-trophy"></i> Top Investor</h5>
                    <div class="companies-list">
                        ${topCompaniesList}
                    </div>
                </div>
                
                <div class="sectors-section">
                    <h5><i class="fas fa-chart-pie"></i> Sektor Utama</h5>
                    <div class="sectors-grid">
                        ${sectorsList}
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadNTBData() {
    try {
        if (!investmentDataProcessor) {
            throw new Error('Data processor belum siap');
        }

        const geojsonData = investmentDataProcessor.generateGeoJSONData();
        citiesData = geojsonData.features;
        
        markersLayer.clearLayers();
        
        geojsonData.features.forEach((feature, index) => {
            setTimeout(() => {
                const marker = createAnimatedMarker(feature);
                markersLayer.addLayer(marker);
                
                if (index === geojsonData.features.length - 1) {
                    updateStats();
                    updateSectorTags();
                    hideLoadingScreen();
                }
            }, index * 150);
        });
        
    } catch (error) {
        console.error('Error loading NTB data:', error);
        hideLoadingScreen();
        showErrorMessage('Gagal memuat data peta. ' + error.message);
    }
}

function updateStats() {
    if (!investmentDataProcessor) return;
    
    const stats = investmentDataProcessor.getTotalStatistics();
    
    // Update header stats
    document.getElementById('total-regions').textContent = Object.keys(investmentDataProcessor.processedData).length;
    document.getElementById('header-total-companies').textContent = stats.totalCompanies;
    document.getElementById('header-total-investment').textContent = formatCurrency(stats.totalInvestment.toString());
    
    // Update dashboard stats
    updateDashboardStats(stats);
}

function updateDashboardStats(stats) {
    document.getElementById('total-investment-display').textContent = formatCurrency(stats.totalInvestment.toString());
    document.getElementById('total-companies-display').textContent = stats.totalCompanies + ' Perusahaan';
    document.getElementById('pma-stats').textContent = stats.totalPMA + ' Perusahaan';
    document.getElementById('pmdn-stats').textContent = stats.totalPMDN + ' Perusahaan';
    document.getElementById('pma-percentage').textContent = stats.pmaPercentage + '% dari total';
    document.getElementById('pmdn-percentage').textContent = stats.pmdnPercentage + '% dari total';
    
    // Update additional info
    const additionalCapitalTotal = Object.values(investmentDataProcessor.processedData)
        .reduce((sum, region) => sum + region.totalAdditionalCapital, 0);
    
    if (document.getElementById('additional-capital-display')) {
        document.getElementById('additional-capital-display').textContent = 
            'Tambahan Modal: ' + formatCurrency(additionalCapitalTotal.toString());
    }
}

function updateSectorTags() {
    if (!investmentDataProcessor) return;
    
    const sectorAnalysis = investmentDataProcessor.getSectorAnalysis();
    const sectorTagsContainer = document.getElementById('sector-tags');
    
    const sectorColors = {
        'ESDM': 'tag-esdm',
        'Pariwisata dan Ekonomi Kreatif': 'tag-pariwisata', 
        'Perdagangan': 'tag-perdagangan',
        'Perindustrian': 'tag-perindustrian',
        'Kelautan dan Perikanan': 'tag-kelautan',
        'Telekomunikasi': 'tag-telekomunikasi'
    };
    
    const sectorIcons = {
        'ESDM': 'fa-bolt',
        'Pariwisata dan Ekonomi Kreatif': 'fa-camera',
        'Perdagangan': 'fa-store', 
        'Perindustrian': 'fa-industry',
        'Kelautan dan Perikanan': 'fa-fish',
        'Telekomunikasi': 'fa-tower-cell'
    };
    
    const topSectors = sectorAnalysis.slice(0, 8);
    
    sectorTagsContainer.innerHTML = topSectors.map(sector => `
        <span class="tag ${sectorColors[sector.name] || 'tag-other'}" data-sector="${sector.name}">
            <i class="fas ${sectorIcons[sector.name] || 'fa-chart-line'}"></i> 
            ${sector.name}
            <small>(${sector.companies.length})</small>
        </span>
    `).join('');
}

function setupDashboard() {
    const dashboardBtns = document.querySelectorAll('.dashboard-btn');
    const dashboardContents = document.querySelectorAll('.dashboard-content');
    
    dashboardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.dataset.view;
            
            dashboardBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            dashboardContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${targetView}-dashboard`).classList.add('active');
            
            loadDashboardContent(targetView);
        });
    });
    
    loadDashboardContent('overview');
}

function loadDashboardContent(view) {
    if (!investmentDataProcessor) return;
    
    switch(view) {
        case 'overview':
            loadOverviewDashboard();
            break;
        case 'ranking':
            loadRankingDashboard();
            break;
        case 'sectors':
            loadSectorsDashboard();
            break;
        case 'companies':
            loadCompaniesDashboard();
            break;
        case 'trends':
            loadTrendsDashboard();
            break;
    }
}

function loadOverviewDashboard() {
    createInvestmentChart();
    createSectorChart();
}

function createInvestmentChart() {
    const chartContainer = document.getElementById('investment-chart');
    const rankingData = investmentDataProcessor.getRankingData();
    const topRegions = rankingData.regions.slice(0, 10);
    
    const chartHtml = `
        <div class="custom-chart">
            <div class="chart-bars">
                ${topRegions.map((region, index) => {
                    const percentage = (region.investment / topRegions[0].investment) * 100;
                    return `
                        <div class="chart-bar-item">
                            <div class="bar-label">${region.name}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${percentage}%; background: linear-gradient(135deg, #667eea ${index * 10}%, #764ba2 100%)"></div>
                                <div class="bar-value">${formatCurrency(region.investment.toString())}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = chartHtml;
}

function createSectorChart() {
    const chartContainer = document.getElementById('sector-chart');
    const sectorAnalysis = investmentDataProcessor.getSectorAnalysis();
    const topSectors = sectorAnalysis.slice(0, 8);
    
    const sectorColors = {
        'ESDM': '#ffd43b',
        'Pariwisata dan Ekonomi Kreatif': '#ff6b6b',
        'Perdagangan': '#9775fa',
        'Perindustrian': '#51cf66',
        'Kelautan dan Perikanan': '#339af0',
        'Telekomunikasi': '#667eea',
        'Transportasi': '#ff8787',
        'Kesehatan': '#69db7c'
    };
    
    const chartHtml = `
        <div class="custom-chart">
            <div class="sector-chart-grid">
                ${topSectors.map(sector => `
                    <div class="sector-chart-item">
                        <div class="sector-icon" style="background: ${sectorColors[sector.name] || '#667eea'}">
                            <i class="fas ${getSectorIcon(sector.name)}"></i>
                        </div>
                        <div class="sector-info">
                            <div class="sector-name">${sector.name}</div>
                            <div class="sector-value">${formatCurrency(sector.totalInvestment.toString())}</div>
                            <div class="sector-count">${sector.companies.length} Perusahaan</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = chartHtml;
}

function getSectorIcon(sector) {
    const icons = {
        'ESDM': 'fa-bolt',
        'Pariwisata dan Ekonomi Kreatif': 'fa-camera',
        'Perdagangan': 'fa-store',
        'Perindustrian': 'fa-industry',
        'Kelautan dan Perikanan': 'fa-fish',
        'Telekomunikasi': 'fa-tower-cell',
        'Transportasi': 'fa-truck',
        'Kesehatan': 'fa-hospital',
        'Pertanian': 'fa-seedling',
        'Peternakan': 'fa-cow'
    };
    return icons[sector] || 'fa-chart-line';
}

function loadRankingDashboard() {
    loadRegionRanking();
    loadCompanyRanking();
}

function loadRegionRanking() {
    const container = document.getElementById('region-ranking');
    const rankingData = investmentDataProcessor.getRankingData();
    
    const rankingHtml = rankingData.regions.map((region, index) => `
        <div class="ranking-item">
            <div class="ranking-number rank-${index < 3 ? index + 1 : 'other'}">${index + 1}</div>
            <div class="ranking-details">
                <div class="ranking-name">${region.name}</div>
                <div class="ranking-meta">${region.type} • ${region.companies} Perusahaan</div>
                <div class="ranking-value">${formatCurrency(region.investment.toString())}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = rankingHtml;
}

function loadCompanyRanking() {
    const container = document.getElementById('company-ranking');
    const rankingData = investmentDataProcessor.getRankingData();
    
    const rankingHtml = rankingData.companies.slice(0, 15).map((company, index) => `
        <div class="ranking-item">
            <div class="ranking-number rank-${index < 3 ? index + 1 : 'other'}">${index + 1}</div>
            <div class="ranking-details">
                <div class="ranking-name">${company.name}</div>
                <div class="ranking-meta">${company.region} • ${company.sector} • ${company.type}</div>
                <div class="ranking-value">${formatCurrency(company.investment.toString())}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = rankingHtml;
}

function loadSectorsDashboard() {
    const container = document.getElementById('sectors-breakdown');
    const sectorAnalysis = investmentDataProcessor.getSectorAnalysis();
    
    const sectorColors = {
        'ESDM': 'linear-gradient(135deg, #ffd43b, #fab005)',
        'Pariwisata dan Ekonomi Kreatif': 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
        'Perdagangan': 'linear-gradient(135deg, #9775fa, #845ef7)',
        'Perindustrian': 'linear-gradient(135deg, #51cf66, #40c057)',
        'Kelautan dan Perikanan': 'linear-gradient(135deg, #339af0, #228be6)',
        'Telekomunikasi': 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    
    const sectorsHtml = sectorAnalysis.map(sector => `
        <div class="sector-card">
            <div class="sector-header">
                <div class="sector-icon" style="background: ${sectorColors[sector.name] || 'linear-gradient(135deg, #667eea, #764ba2)'}">
                    <i class="fas ${getSectorIcon(sector.name)}"></i>
                </div>
                <div class="sector-title">${sector.name}</div>
            </div>
            <div class="sector-stats">
                <div class="sector-stat">
                    <div class="sector-stat-value">${formatCurrency(sector.totalInvestment.toString())}</div>
                    <div class="sector-stat-label">Total Investasi</div>
                </div>
                <div class="sector-stat">
                    <div class="sector-stat-value">${sector.companies.length}</div>
                    <div class="sector-stat-label">Perusahaan</div>
                </div>
                <div class="sector-stat">
                    <div class="sector-stat-value">${sector.regions.length}</div>
                    <div class="sector-stat-label">Wilayah</div>
                </div>
                <div class="sector-stat">
                    <div class="sector-stat-value">${sector.pmaCount}/${sector.pmdnCount}</div>
                    <div class="sector-stat-label">PMA/PMDN</div>
                </div>
            </div>
            <div class="sector-details">
                <h6>Wilayah Aktif:</h6>
                <div class="region-tags">
                    ${sector.regions.slice(0, 4).map(region => `
                        <span class="region-tag">${region}</span>
                    `).join('')}
                </div>
                <div style="margin-top: 10px;">
                    <small><strong>Rata-rata investasi:</strong> ${formatCurrency(sector.averageInvestment.toString())}</small>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = sectorsHtml;
}

function loadCompaniesDashboard() {
    const container = document.getElementById('companies-breakdown');
    const rankingData = investmentDataProcessor.getRankingData();
    
    // Populate filter options
    populateFilterOptions();
    
    const companiesHtml = rankingData.companies.slice(0, 24).map(company => `
        <div class="company-card" data-sector="${company.sector}" data-region="${company.region}" data-type="${company.type}">
            <div class="company-header">
                <div class="company-info">
                    <div class="company-name">${company.name}</div>
                    <div class="company-investment">${formatCurrency(company.investment.toString())}</div>
                </div>
                <div class="company-type-badge ${company.type}">${company.type}</div>
            </div>
            <div class="company-location">
                <i class="fas fa-map-marker-alt"></i>
                ${company.region}${company.district ? `, ${company.district}` : ''}
            </div>
            <div class="company-sector">
                <i class="fas ${getSectorIcon(company.sector)}"></i>
                ${company.sector}
            </div>
            ${company.description ? `<div class="company-description">${company.description}</div>` : ''}
        </div>
    `).join('');
    
    container.innerHTML = companiesHtml;
}

function populateFilterOptions() {
    if (!investmentDataProcessor) return;
    
    const sectorAnalysis = investmentDataProcessor.getSectorAnalysis();
    const regions = Object.keys(investmentDataProcessor.processedData);
    
    // Populate sector filter
    const sectorFilter = document.getElementById('sector-filter');
    if (sectorFilter) {
        sectorFilter.innerHTML = '<option value="">Semua Sektor</option>' +
            sectorAnalysis.map(sector => `<option value="${sector.name}">${sector.name}</option>`).join('');
    }
    
    // Populate region filter
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
        regionFilter.innerHTML = '<option value="">Semua Wilayah</option>' +
            regions.map(region => `<option value="${region}">${region}</option>`).join('');
    }
}

function loadTrendsDashboard() {
    const container = document.getElementById('trend-insights');
    const stats = investmentDataProcessor.getTotalStatistics();
    const sectorAnalysis = investmentDataProcessor.getSectorAnalysis();
    const rankingData = investmentDataProcessor.getRankingData();
    
    const topSector = sectorAnalysis[0];
    const topRegion = rankingData.regions[0];
    
    const trendsHtml = `
        <div class="trends-grid">
            <div class="trend-card">
                <h5><i class="fas fa-arrow-trend-up"></i> Sektor Paling Menarik</h5>
                <div class="trend-content">
                    <div class="trend-highlight">${topSector.name}</div>
                    <div class="trend-details">
                        <p>💰 Total investasi: ${formatCurrency(topSector.totalInvestment.toString())}</p>
                        <p>🏢 ${topSector.companies.length} perusahaan aktif</p>
                        <p>📍 Tersebar di ${topSector.regions.length} wilayah</p>
                    </div>
                </div>
            </div>
            
            <div class="trend-card">
                <h5><i class="fas fa-crown"></i> Wilayah Terdepan</h5>
                <div class="trend-content">
                    <div class="trend-highlight">${topRegion.name}</div>
                    <div class="trend-details">
                        <p>💰 ${formatCurrency(topRegion.investment.toString())}</p>
                        <p>🏢 ${topRegion.companies} perusahaan</p>
                        <p>📊 ${((topRegion.investment / stats.totalInvestment) * 100).toFixed(1)}% dari total NTB</p>
                    </div>
                </div>
            </div>
            
            <div class="trend-card">
                <h5><i class="fas fa-balance-scale"></i> Komposisi Investasi</h5>
                <div class="trend-content">
                    <div class="investment-composition">
                        <div class="composition-item">
                            <span class="composition-label">PMA</span>
                            <div class="composition-bar">
                                <div class="composition-fill pma" style="width: ${stats.pmaPercentage}%"></div>
                            </div>
                            <span class="composition-value">${stats.pmaPercentage}%</span>
                        </div>
                        <div class="composition-item">
                            <span class="composition-label">PMDN</span>
                            <div class="composition-bar">
                                <div class="composition-fill pmdn" style="width: ${stats.pmdnPercentage}%"></div>
                            </div>
                            <span class="composition-value">${stats.pmdnPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="trend-card">
                <h5><i class="fas fa-chart-line"></i> Proyeksi & Rekomendasi</h5>
                <div class="trend-content">
                    <div class="recommendations">
                        <div class="recommendation-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>Fokus pengembangan sektor ${topSector.name} yang menunjukkan tren positif</span>
                        </div>
                        <div class="recommendation-item">
                            <i class="fas fa-target"></i>
                            <span>Replikasi model sukses ${topRegion.name} ke wilayah lain</span>
                        </div>
                        <div class="recommendation-item">
                            <i class="fas fa-handshake"></i>
                            <span>Tingkatkan rasio PMA melalui promosi investasi internasional</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = trendsHtml;
}

function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
            ${message}
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    function searchCity() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;
        
        const found = citiesData.find(city => 
            city.properties.name.toLowerCase().includes(query)
        );
        
        if (found) {
            const coords = [found.geometry.coordinates[1], found.geometry.coordinates[0]];
            map.setView(coords, 12);
            
            markersLayer.eachLayer(layer => {
                if (Math.abs(layer.getLatLng().lat - coords[0]) < 0.01 && 
                    Math.abs(layer.getLatLng().lng - coords[1]) < 0.01) {
                    layer.openPopup();
                }
            });
            
            searchInput.value = '';
            searchInput.style.borderColor = '#51cf66';
            setTimeout(() => {
                searchInput.style.borderColor = '#e2e8f0';
            }, 1000);
        } else {
            searchInput.style.borderColor = '#f093fb';
            searchInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                searchInput.style.borderColor = '#e2e8f0';
                searchInput.style.animation = '';
            }, 1000);
        }
        
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    // Auto-suggest functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            if (suggestionsContainer) suggestionsContainer.style.display = 'none';
            return;
        }
        
        const matches = citiesData.filter(city =>
            city.properties.name.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (matches.length > 0 && suggestionsContainer) {
            const suggestionsHtml = matches.map(city => `
                <div class="suggestion-item" data-name="${city.properties.name}">
                    <i class="fas fa-map-marker-alt"></i>
                    ${city.properties.name} (${city.properties.type})
                </div>
            `).join('');
            
            suggestionsContainer.innerHTML = suggestionsHtml;
            suggestionsContainer.style.display = 'block';
            
            // Add click handlers for suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    searchInput.value = this.dataset.name;
                    searchCity();
                });
            });
        } else if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    searchBtn.addEventListener('click', searchCity);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCity();
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && suggestionsContainer && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function setupMapControls() {
    const resetBtn = document.getElementById('reset-view');
    const fullscreenBtn = document.getElementById('fullscreen');
    const refreshBtn = document.getElementById('refresh-data');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            map.setView([-8.6500, 117.3616], 9);
            markersLayer.eachLayer(layer => layer.closePopup());
        });
    }
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const mapContainer = document.getElementById('map');
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

function setupInvestmentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            currentFilter = filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter markers
            markersLayer.eachLayer(layer => {
                const cityData = citiesData.find(city => {
                    const coords = [city.geometry.coordinates[1], city.geometry.coordinates[0]];
                    return Math.abs(layer.getLatLng().lat - coords[0]) < 0.01 && 
                           Math.abs(layer.getLatLng().lng - coords[1]) < 0.01;
                });
                
                if (cityData) {
                    let shouldShow = true;
                    
                    if (filter !== 'all') {
                        const hasFilterType = cityData.properties.top_companies.some(company => 
                            company.type === filter
                        );
                        shouldShow = hasFilterType;
                    }
                    
                    layer.setOpacity(shouldShow ? 1 : 0.3);
                }
            });
        });
    });
}

function setupSectorFilters() {
    // This will be called after sector tags are populated
    setTimeout(() => {
        const tags = document.querySelectorAll('.tag[data-sector]');
        
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                const sector = tag.dataset.sector;
                
                tag.classList.toggle('active');
                
                // Get all active sectors
                const activeSectors = Array.from(document.querySelectorAll('.tag.active[data-sector]'))
                    .map(t => t.dataset.sector);
                
                markersLayer.eachLayer(layer => {
                    const cityData = citiesData.find(city => {
                        const coords = [city.geometry.coordinates[1], city.geometry.coordinates[0]];
                        return Math.abs(layer.getLatLng().lat - coords[0]) < 0.01 && 
                               Math.abs(layer.getLatLng().lng - coords[1]) < 0.01;
                    });
                    
                    if (cityData) {
                        let shouldShow = true;
                        
                        if (activeSectors.length > 0) {
                            const hasSector = cityData.properties.main_sectors.some(s => 
                                activeSectors.includes(s)
                            );
                            shouldShow = hasSector;
                        }
                        
                        layer.setOpacity(shouldShow ? 1 : 0.3);
                    }
                });
            });
        });
    }, 1000);
}

function setupCompanyFilters() {
    const sectorFilter = document.getElementById('sector-filter');
    const regionFilter = document.getElementById('region-filter');
    const typeFilter = document.getElementById('type-filter');
    
    function filterCompanies() {
        const selectedSector = sectorFilter?.value || '';
        const selectedRegion = regionFilter?.value || '';
        const selectedType = typeFilter?.value || '';
        
        const companyCards = document.querySelectorAll('.company-card');
        
        companyCards.forEach(card => {
            const cardSector = card.dataset.sector;
            const cardRegion = card.dataset.region;
            const cardType = card.dataset.type;
            
            const matchesSector = !selectedSector || cardSector === selectedSector;
            const matchesRegion = !selectedRegion || cardRegion === selectedRegion;
            const matchesType = !selectedType || cardType === selectedType;
            
            if (matchesSector && matchesRegion && matchesType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (sectorFilter) sectorFilter.addEventListener('change', filterCompanies);
    if (regionFilter) regionFilter.addEventListener('change', filterCompanies);
    if (typeFilter) typeFilter.addEventListener('change', filterCompanies);
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes markerPulse {
            0% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(102, 126, 234, 0.7); }
            70% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 10px rgba(102, 126, 234, 0); }
            100% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(102, 126, 234, 0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .custom-tooltip {
            background: rgba(255, 255, 255, 0.95) !important;
            border: none !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            padding: 8px 12px !important;
        }
        
        .custom-marker-container {
            pointer-events: auto !important;
        }
        
        .leaflet-div-icon {
            background: transparent !important;
            border: none !important;
        }
        
        .tag.active {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        }
        
        .suggestion-item {
            padding: 10px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s;
        }
        
        .suggestion-item:hover {
            background-color: #f8fafc;
        }
        
        .suggestion-item i {
            color: var(--primary-color);
        }
        
        .filter-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            color: #718096;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .filter-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
        
        .filter-btn.active {
            background: var(--gradient-main);
            border-color: var(--primary-color);
            color: white;
        }
        
        .investment-filter {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: var(--border-radius);
            padding: 25px;
            box-shadow: var(--shadow-soft);
        }
        
        .investment-filter h3 {
            color: var(--dark-color);
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .trends-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .trend-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: var(--shadow-soft);
            border: 1px solid #e2e8f0;
        }
        
        .trend-card h5 {
            color: var(--dark-color);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .trend-highlight {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 10px;
        }
        
        .trend-details p {
            margin: 8px 0;
            color: #718096;
        }
        
        .investment-composition {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .composition-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .composition-label {
            min-width: 50px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .composition-bar {
            flex: 1;
            height: 20px;
            background: #f1f5f9;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .composition-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 1s ease;
        }
        
        .composition-fill.pma {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
        }
        
        .composition-fill.pmdn {
            background: linear-gradient(135deg, #51cf66, #40c057);
        }
        
        .composition-value {
            min-width: 40px;
            font-weight: 600;
            text-align: right;
        }
        
        .recommendations {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }
        
        .recommendation-item i {
            color: var(--primary-color);
            margin-top: 2px;
        }
        
        .companies-filter {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
        }
        
        .companies-filter h4 {
            margin-bottom: 15px;
            color: var(--dark-color);
        }
        
        .filter-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .filter-options select {
            padding: 10px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            color: var(--dark-color);
            font-size: 0.9rem;
        }
        
        .filter-options select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .company-district {
            font-size: 0.8rem;
            color: #a0aec0;
            margin-top: 5px;
        }
        
        .company-description {
            font-size: 0.85rem;
            color: #718096;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e2e8f0;
        }
    `;
    document.head.appendChild(style);
}

// Inisialisasi semua fungsi ketika halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    addCustomStyles();
    setupSearch();
    setupMapControls();
    setupDashboard();
    
    // Wait for investment data to load
    const checkDataInterval = setInterval(() => {
        if (investmentDataProcessor) {
            loadNTBData();
            setupInvestmentFilters();
            setupSectorFilters();
            setupCompanyFilters();
            clearInterval(checkDataInterval);
        }
    }, 100);
    
    // Smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.sidebar > *').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
        document.getElementById('reset-view')?.click();
    }
    
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey) {
        document.getElementById('fullscreen')?.click();
    }
    
    if (e.key === '/' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
    }
});
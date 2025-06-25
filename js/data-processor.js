// data-processor.js - Memproses data investasi real dari investment-data.json

class InvestmentDataProcessor {
    constructor(rawData) {
        this.rawData = rawData;
        this.processedData = this.processRawData();
    }

    processRawData() {
        // Filter data yang valid (bukan null atau header)
        const validData = this.rawData.filter(item => 
            item && 
            typeof item.NO === 'number' && 
            item["NAMA PELAKU USAHA"] && 
            item["KABUPATEN/KOTA"]
        );

        // Group by kabupaten/kota
        const groupedByRegion = {};
        
        validData.forEach(item => {
            const region = this.normalizeRegionName(item["KABUPATEN/KOTA"]);
            const investment = this.parseInvestment(item["AKUMULASI REALISASI INVESTASI"]);
            const additionalCapital = this.parseInvestment(item["TAMBAHAN MODAL TETAP REALISASI"]);

            if (!groupedByRegion[region]) {
                groupedByRegion[region] = {
                    companies: [],
                    totalInvestment: 0,
                    totalAdditionalCapital: 0,
                    sectors: new Set(),
                    pmaCount: 0,
                    pmdnCount: 0
                };
            }

            const company = {
                name: item["NAMA PELAKU USAHA"],
                sector: item.SEKTOR || 'Tidak Teridentifikasi',
                kbli: item.KBLI,
                description: item["RINCIAN KBLI"] || item["URAIAN KBLI"],
                district: item.KECAMATAN,
                investment: investment,
                additionalCapital: additionalCapital,
                type: item.KETERANGAN || 'PMDN'
            };

            groupedByRegion[region].companies.push(company);
            groupedByRegion[region].totalInvestment += investment;
            groupedByRegion[region].totalAdditionalCapital += additionalCapital;
            groupedByRegion[region].sectors.add(company.sector);

            if (company.type === 'PMA') {
                groupedByRegion[region].pmaCount++;
            } else {
                groupedByRegion[region].pmdnCount++;
            }
        });

        return groupedByRegion;
    }

    normalizeRegionName(regionName) {
        const mapping = {
            'Kab. Bima': 'Bima',
            'Kab. Dompu': 'Dompu',
            'Kab. Lombok Barat': 'Lombok Barat',
            'Kab. Lombok Tengah': 'Lombok Tengah',
            'Kab. Lombok Timur': 'Lombok Timur',
            'Kab. Lombok Utara': 'Lombok Utara',
            'Kab. Sumbawa': 'Sumbawa',
            'Kab. Sumbawa Barat': 'Sumbawa Barat',
            'Kota Bima': 'Kota Bima',
            'Kota Mataram': 'Mataram'
        };
        return mapping[regionName] || regionName;
    }

    parseInvestment(value) {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            // Remove dots and convert to number
            return parseInt(value.replace(/\./g, '')) || 0;
        }
        return 0;
    }

    getTopCompaniesByRegion(region, limit = 5) {
        const regionData = this.processedData[region];
        if (!regionData) return [];

        return regionData.companies
            .sort((a, b) => b.investment - a.investment)
            .slice(0, limit);
    }

    getTotalStatistics() {
        let totalInvestment = 0;
        let totalCompanies = 0;
        let totalPMA = 0;
        let totalPMDN = 0;
        const allSectors = new Set();

        Object.values(this.processedData).forEach(region => {
            totalInvestment += region.totalInvestment;
            totalCompanies += region.companies.length;
            totalPMA += region.pmaCount;
            totalPMDN += region.pmdnCount;
            region.sectors.forEach(sector => allSectors.add(sector));
        });

        return {
            totalInvestment,
            totalCompanies,
            totalPMA,
            totalPMDN,
            sectors: Array.from(allSectors),
            pmaPercentage: ((totalPMA / totalCompanies) * 100).toFixed(1),
            pmdnPercentage: ((totalPMDN / totalCompanies) * 100).toFixed(1)
        };
    }

    getRegionStatistics(region) {
        const regionData = this.processedData[region];
        if (!regionData) return null;

        const topCompanies = this.getTopCompaniesByRegion(region, 5);
        const mainSectors = Array.from(regionData.sectors).slice(0, 5);

        return {
            name: region,
            totalInvestment: regionData.totalInvestment,
            totalCompanies: regionData.companies.length,
            topCompanies: topCompanies,
            mainSectors: mainSectors,
            pmaCount: regionData.pmaCount,
            pmdnCount: regionData.pmdnCount,
            totalAdditionalCapital: regionData.totalAdditionalCapital
        };
    }

    generateGeoJSONData() {
        // Koordinat yang sudah akurat untuk setiap wilayah
        const coordinates = {
            'Mataram': [116.1178, -8.5833],
            'Lombok Barat': [116.1047, -8.6500],
            'Lombok Tengah': [116.3081, -8.7000],
            'Lombok Timur': [116.5472, -8.5500],
            'Lombok Utara': [116.4067, -8.3500],
            'Sumbawa': [117.4181, -8.4667],
            'Sumbawa Barat': [116.8167, -8.7167],
            'Dompu': [118.4667, -8.5333],
            'Bima': [118.7167, -8.4667],
            'Kota Bima': [118.7267, -8.4600]
        };

        // Populasi berdasarkan data BPS terbaru
        const populations = {
            'Mataram': '441,546',
            'Lombok Barat': '679,871',
            'Lombok Tengah': '980,167',
            'Lombok Timur': '1,325,240',
            'Lombok Utara': '230,899',
            'Sumbawa': '439,909',
            'Sumbawa Barat': '135,689',
            'Dompu': '230,696',
            'Bima': '440,232',
            'Kota Bima': '149,859'
        };

        const features = [];

        Object.keys(this.processedData).forEach(region => {
            const stats = this.getRegionStatistics(region);
            if (!stats || !coordinates[region]) return;

            const feature = {
                type: "Feature",
                properties: {
                    name: region,
                    type: this.getRegionType(region),
                    population: populations[region] || 'Data tidak tersedia',
                    total_investment: stats.totalInvestment.toString(),
                    total_companies: stats.totalCompanies,
                    main_sectors: stats.mainSectors,
                    top_companies: stats.topCompanies.map(company => ({
                        name: company.name,
                        sector: company.sector,
                        investment: company.investment.toString(),
                        type: company.type,
                        description: company.description,
                        district: company.district
                    })),
                    pma_count: stats.pmaCount,
                    pmdn_count: stats.pmdnCount,
                    total_additional_capital: stats.totalAdditionalCapital
                },
                geometry: {
                    type: "Point",
                    coordinates: coordinates[region]
                }
            };

            features.push(feature);
        });

        return {
            type: "FeatureCollection",
            features: features
        };
    }

    getRegionType(region) {
        if (region === 'Mataram') return 'Ibu Kota';
        if (region === 'Kota Bima') return 'Kota';
        return 'Kabupaten';
    }

    getRankingData() {
        const regions = Object.keys(this.processedData).map(region => {
            const stats = this.getRegionStatistics(region);
            return {
                name: region,
                type: this.getRegionType(region),
                investment: stats.totalInvestment,
                companies: stats.totalCompanies
            };
        }).sort((a, b) => b.investment - a.investment);

        const allCompanies = [];
        Object.keys(this.processedData).forEach(region => {
            this.processedData[region].companies.forEach(company => {
                allCompanies.push({
                    ...company,
                    region: region
                });
            });
        });

        allCompanies.sort((a, b) => b.investment - a.investment);

        return {
            regions: regions,
            companies: allCompanies.slice(0, 20) // Top 20 companies
        };
    }

    getSectorAnalysis() {
        const sectorData = {};
        
        Object.keys(this.processedData).forEach(region => {
            this.processedData[region].companies.forEach(company => {
                if (!sectorData[company.sector]) {
                    sectorData[company.sector] = {
                        name: company.sector,
                        totalInvestment: 0,
                        companies: [],
                        regions: new Set(),
                        pmaCount: 0,
                        pmdnCount: 0
                    };
                }

                sectorData[company.sector].totalInvestment += company.investment;
                sectorData[company.sector].companies.push({...company, region});
                sectorData[company.sector].regions.add(region);
                
                if (company.type === 'PMA') {
                    sectorData[company.sector].pmaCount++;
                } else {
                    sectorData[company.sector].pmdnCount++;
                }
            });
        });

        // Convert to array and sort by investment
        return Object.values(sectorData)
            .map(sector => ({
                ...sector,
                regions: Array.from(sector.regions),
                averageInvestment: sector.totalInvestment / sector.companies.length
            }))
            .sort((a, b) => b.totalInvestment - a.totalInvestment);
    }
}

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvestmentDataProcessor;
}
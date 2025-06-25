// This script will contain all the logic for the investment map.
// It waits for the DOM to be fully loaded before running.

// Raw investment data from the JSON file provided by the user.
const rawInvestmentData = [
    {"NO":1,"NAMA PELAKU USAHA":"TENGGARA POINT RESORT","KBLI":"55194","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"VILA","KECAMATAN":"Parado","KABUPATEN/KOTA":"Kab. Bima","TAMBAHAN MODAL TETAP REALISASI":1646704140,"AKUMULASI REALISASI INVESTASI":382652766534,"KETERANGAN":"PMA"},
    {"NO":2,"NAMA PELAKU USAHA":"CHAROEN POKPHAND INDONESIA","KBLI":"52101","SEKTOR":"Perdagangan","RINCIAN KBLI":"Pergudangan dan Penyimpanan","KECAMATAN":"Madapangga","KABUPATEN/KOTA":"Kab. Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":198867748959,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"GOLDEN PALM SURYATAMA","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Sape","KABUPATEN/KOTA":"Kab. Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":190382025581,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"TIRTAMAS MUTIARA","KBLI":"03219","SEKTOR":"Kelautan dan Perikanan","RINCIAN KBLI":"Budidaya Biota Air Laut Lainnya","KECAMATAN":"Langgudu","KABUPATEN/KOTA":"Kab. Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":89000197224,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"SANGGARAGRO KARYAPERSADA","KBLI":"20294","SEKTOR":"Perindustrian","RINCIAN KBLI":"Industri Minyak Atsiri","KECAMATAN":"Tambora","KABUPATEN/KOTA":"Kab. Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":55563464705,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"SUMBAWA TIMUR MINING","KBLI":"07301","SEKTOR":"ESDM","RINCIAN KBLI":"Pertambangan Emas Dan Perak","KECAMATAN":"Hu'u","KABUPATEN/KOTA":"Kab. Dompu","TAMBAHAN MODAL TETAP REALISASI":259370193928,"AKUMULASI REALISASI INVESTASI":7802569572664,"KETERANGAN":"PMA"},
    {"NO":2,"NAMA PELAKU USAHA":"SEGER AGRO NUSANTARA","KBLI":"46201","SEKTOR":"Perdagangan","RINCIAN KBLI":"Perdagangan Besar Padi Dan Palawija","KECAMATAN":"Pekat","KABUPATEN/KOTA":"Kab. Dompu","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":69588510000,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"SUKSES MANTAP SEJAHTERA","KBLI":"01140","SEKTOR":"Pertanian","RINCIAN KBLI":"Perkebunan Tebu","KECAMATAN":"Pekat","KABUPATEN/KOTA":"Kab. Dompu","TAMBAHAN MODAL TETAP REALISASI":92000000,"AKUMULASI REALISASI INVESTASI":47391075499,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"SUKSES MANTAP SEJAHTERA","KBLI":"10721","SEKTOR":"Perindustrian","RINCIAN KBLI":"Industri Gula Pasir","KECAMATAN":"Pekat","KABUPATEN/KOTA":"Kab. Dompu","TAMBAHAN MODAL TETAP REALISASI":1952702741,"AKUMULASI REALISASI INVESTASI":37523608495,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"MACMAHON MINING SERVICES","KBLI":"09900","SEKTOR":"ESDM","RINCIAN KBLI":"Aktivitas Penunjang pertambangan dan penggalian lainnya","KECAMATAN":"Hu'u","KABUPATEN/KOTA":"Kab. Dompu","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":27695888493,"KETERANGAN":"PMA"},
    {"NO":1,"NAMA PELAKU USAHA":"PELAYANAN LISTRIK NASIONAL BATAM","KBLI":"35111","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkitan Tenaga Listrik","KECAMATAN":"Gerung","KABUPATEN/KOTA":"Kab. Lombok Barat","TAMBAHAN MODAL TETAP REALISASI":395966417,"AKUMULASI REALISASI INVESTASI":927119472934,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"BLISS PEMBANGUNAN SEJAHTERA","KBLI":"68111","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Real Estat Yang Dimiliki Sendiri Atau Disewa","KECAMATAN":"Narmada","KABUPATEN/KOTA":"Kab. Lombok Barat","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":419637796264,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"NARMADA AWET MUDA","KBLI":"11051","SEKTOR":"Perindustrian","RINCIAN KBLI":"Industri Air Kemasan","KECAMATAN":"Lingsar","KABUPATEN/KOTA":"Kab. Lombok Barat","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":171066640896,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"GRAHA SENGGIGI","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Batu Layar","KABUPATEN/KOTA":"Kab. Lombok Barat","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":149658714241,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"RAJAWALI ADIMANDALIKA","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Batu Layar","KABUPATEN/KOTA":"Kab. Lombok Barat","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":129264000000,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"PENGEMBANGAN PARIWISATA INDONESIA (INDONESIA TOURISM DEVELOPMENT)","KBLI":"68120","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Kawasan Pariwisata","KECAMATAN":"-","KABUPATEN/KOTA":"Kab. Lombok Tengah","TAMBAHAN MODAL TETAP REALISASI":62463737887,"AKUMULASI REALISASI INVESTASI":9009123215123.389,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"GOODWIND POWER INDONESIA","KBLI":"35111","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkitan Tenaga Listrik","KECAMATAN":"Pujut","KABUPATEN/KOTA":"Kab. Lombok Tengah","TAMBAHAN MODAL TETAP REALISASI":1606800000000,"AKUMULASI REALISASI INVESTASI":1606800000000,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"PENGEMBANGAN PARIWISATA INDONESIA (INDONESIA TOURISM DEVELOPMENT)","KBLI":"68120","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Kawasan Pariwisata","KECAMATAN":"-","KABUPATEN/KOTA":"Kab. Lombok Tengah","TAMBAHAN MODAL TETAP REALISASI":62463737887,"AKUMULASI REALISASI INVESTASI":1010713489286,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"LOMBOK INVEST AND DEVELOPMENT","KBLI":"55194","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Apartemen Hotel","KECAMATAN":"Praya Barat","KABUPATEN/KOTA":"Kab. Lombok Tengah","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":472873030683,"KETERANGAN":"PMA"},
    {"NO":5,"NAMA PELAKU USAHA":"LAPORTE KELUARGA SEJAHTRA","KBLI":"55194","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Apartemen Hotel","KECAMATAN":"Praya Barat","KABUPATEN/KOTA":"Kab. Lombok Tengah","TAMBAHAN MODAL TETAP REALISASI":946429800,"AKUMULASI REALISASI INVESTASI":96583321638,"KETERANGAN":"PMA"},
    {"NO":1,"NAMA PELAKU USAHA":"PERUSAHAAN PERSEROAN (PERSERO) PT. PERUSAHAAN LISTRIK NEGARA","KBLI":"35115","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkit, Transmisi, Distribusi dan Penjualan Tenaga Listrik Dalam Satu Kesatuan Usaha","KECAMATAN":"Sambelia","KABUPATEN/KOTA":"Kab. Lombok Timur","TAMBAHAN MODAL TETAP REALISASI":15066002264,"AKUMULASI REALISASI INVESTASI":1407288042467,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"DELAPAN MENIT ENERGI","KBLI":"35111","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkitan Tenaga Listrik","KECAMATAN":"Sambelia","KABUPATEN/KOTA":"Kab. Lombok Timur","TAMBAHAN MODAL TETAP REALISASI":310271150,"AKUMULASI REALISASI INVESTASI":144729626405,"KETERANGAN":"PMA"},
    {"NO":3,"NAMA PELAKU USAHA":"IRADAT AMAN","KBLI":"35111","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkitan Tenaga Listrik","KECAMATAN":"Pringgabaya","KABUPATEN/KOTA":"Kab. Lombok Timur","TAMBAHAN MODAL TETAP REALISASI":1503564001,"AKUMULASI REALISASI INVESTASI":111364559251,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"CHAROEN POKPHAND JAYA FARM","KBLI":"01468","SEKTOR":"Peternakan","RINCIAN KBLI":"Pembibitan Ayam Ras","KECAMATAN":"Pringgabaya","KABUPATEN/KOTA":"Kab. Lombok Timur","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":79422227020,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"DOK DAN PERKAPALAN AIR KANTUNG","KBLI":"33151","SEKTOR":"Perindustrian","RINCIAN KBLI":"Reparasi Kapal, Perahu Dan Bangunan Terapung","KECAMATAN":"Pringgabaya","KABUPATEN/KOTA":"Kab. Lombok Timur","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":36974027513,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"WAKA OBEROI INDONESIA","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Tanjung","KABUPATEN/KOTA":"Kab. Lombok Utara","TAMBAHAN MODAL TETAP REALISASI":498157431,"AKUMULASI REALISASI INVESTASI":298277153856,"KETERANGAN":"PMA"},
    {"NO":2,"NAMA PELAKU USAHA":"JAYA HAMPARAN LOMBOK","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Pemenang","KABUPATEN/KOTA":"Kab. Lombok Utara","TAMBAHAN MODAL TETAP REALISASI":28193922272,"AKUMULASI REALISASI INVESTASI":166778174203,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"MEKARAYA INTERNUSA","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Tanjung","KABUPATEN/KOTA":"Kab. Lombok Utara","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":162535939853,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"PRAPAT AGUNG PERMAI","KBLI":"55110","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"Hotel Bintang","KECAMATAN":"Pemenang","KABUPATEN/KOTA":"Kab. Lombok Utara","TAMBAHAN MODAL TETAP REALISASI":1031107435,"AKUMULASI REALISASI INVESTASI":120899357655,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"WALTER PROPERTINDO JAYA","KBLI":"55113","SEKTOR":"Pariwisata dan Ekonomi Kreatif","RINCIAN KBLI":"HOTEL BINTANG TIGA","KECAMATAN":"Pemenang","KABUPATEN/KOTA":"Kab. Lombok Utara","TAMBAHAN MODAL TETAP REALISASI":97557933000,"AKUMULASI REALISASI INVESTASI":116451525079,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"PERUSAHAAN PERSEROAN (PERSERO) PT. PERUSAHAAN LISTRIK NEGARA","KBLI":"35115","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkit, Transmisi, Distribusi dan Penjualan Tenaga Listrik Dalam Satu Kesatuan Usaha","KECAMATAN":"Labuhan Badas","KABUPATEN/KOTA":"Kab. Sumbawa","TAMBAHAN MODAL TETAP REALISASI":24908187064,"AKUMULASI REALISASI INVESTASI":531151255969,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"CHAROEN POKPHAND INDONESIA","KBLI":"52101","SEKTOR":"Perdagangan","RINCIAN KBLI":"Pergudangan dan Penyimpanan","KECAMATAN":"Moyo Hilir","KABUPATEN/KOTA":"Kab. Sumbawa","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":434477903300,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"SUMBAWA JUTARAYA","KBLI":"24201","SEKTOR":"Perindustrian","RINCIAN KBLI":"Industri Pembuatan Logam Dasar Mulia","KECAMATAN":"Ropang","KABUPATEN/KOTA":"Kab. Sumbawa","TAMBAHAN MODAL TETAP REALISASI":71211188108,"AKUMULASI REALISASI INVESTASI":271595378206,"KETERANGAN":"PMDN"},
    {"NO":4,"NAMA PELAKU USAHA":"SUMBER REJEKI POWER","KBLI":"35111","SEKTOR":"ESDM","RINCIAN KBLI":"Pembangkitan Tenaga Listrik","KECAMATAN":"Unter Iwes","KABUPATEN/KOTA":"Kab. Sumbawa","TAMBAHAN MODAL TETAP REALISASI":3215230941,"AKUMULASI REALISASI INVESTASI":207753285189,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"SUMBAWA JUTARAYA","KBLI":"07301","SEKTOR":"ESDM","RINCIAN KBLI":"Pertambangan Emas Dan Perak","KECAMATAN":"Ropang","KABUPATEN/KOTA":"Kab. Sumbawa","TAMBAHAN MODAL TETAP REALISASI":71211188108,"AKUMULASI REALISASI INVESTASI":185480600525,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"AMMAN MINERAL NUSA TENGGARA","KBLI":"07294","SEKTOR":"ESDM","RINCIAN KBLI":"Pertambangan Bijih Tembaga","KECAMATAN":"Sekongkang","KABUPATEN/KOTA":"Kab. Sumbawa Barat","TAMBAHAN MODAL TETAP REALISASI":1666921762929,"AKUMULASI REALISASI INVESTASI":234990859636484,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"AMMAN MINERAL INDUSTRI","KBLI":"24202","SEKTOR":"Perindustrian","RINCIAN KBLI":"Industri Pembuatan Logam Dasar Bukan Besi","KECAMATAN":"Maluk","KABUPATEN/KOTA":"Kab. Sumbawa Barat","TAMBAHAN MODAL TETAP REALISASI":2153478334593,"AKUMULASI REALISASI INVESTASI":17386161163299,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"MACMAHON INDONESIA","KBLI":"09900","SEKTOR":"ESDM","RINCIAN KBLI":"Aktivitas Penunjang pertambangan dan penggalian lainnya","KECAMATAN":"Sekongkang","KABUPATEN/KOTA":"Kab. Sumbawa Barat","TAMBAHAN MODAL TETAP REALISASI":756262379354,"AKUMULASI REALISASI INVESTASI":17239364616487,"KETERANGAN":"PMA"},
    {"NO":4,"NAMA PELAKU USAHA":"AMMAN MINERAL NUSA TENGGARA","KBLI":"07294","SEKTOR":"ESDM","RINCIAN KBLI":"Pertambangan Bijih Tembaga","KECAMATAN":"Sekongkang","KABUPATEN/KOTA":"Kab. Sumbawa Barat","TAMBAHAN MODAL TETAP REALISASI":3319320774869,"AKUMULASI REALISASI INVESTASI":15775802514269,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"JURONG ENGINEERING LESTARI","KBLI":"43211","SEKTOR":"ESDM","RINCIAN KBLI":"Instalasi Listrik","KECAMATAN":"Maluk","KABUPATEN/KOTA":"Kab. Sumbawa Barat","TAMBAHAN MODAL TETAP REALISASI":158003884015,"AKUMULASI REALISASI INVESTASI":2105964077594,"KETERANGAN":"PMA"},
    {"NO":1,"NAMA PELAKU USAHA":"PERUSAHAAN GAS NEGARA","KBLI":"49300","SEKTOR":"Transportasi","RINCIAN KBLI":"Angkutan Melalui Saluran Pipa","KECAMATAN":"Asakota","KABUPATEN/KOTA":"Kota Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":146299999999,"KETERANGAN":"PMDN"},
    {"NO":2,"NAMA PELAKU USAHA":"RS PKU MUHAMMADIYAH BIMA","KBLI":"86103","SEKTOR":"Kesehatan","RINCIAN KBLI":"Aktivitas Rumah Sakit Swasta","KECAMATAN":"Mpunda","KABUPATEN/KOTA":"Kota Bima","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":33415106982,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"SAKA AGUNG ABADI","KBLI":"46634","SEKTOR":"Perdagangan","RINCIAN KBLI":"Perdagangan Besar Semen, Kapur, Pasir Dan Batu","KECAMATAN":"Rasanae Barat","KABUPATEN/KOTA":"Kota Bima","TAMBAHAN MODAL TETAP REALISASI":9101816989,"AKUMULASI REALISASI INVESTASI":18186133978,"KETERANGAN":"PMDN"},
    {"NO":1,"NAMA PELAKU USAHA":"XLSMART TELECOM SEJAHTERA","KBLI":"61200","SEKTOR":"Telekomunikasi","RINCIAN KBLI":"AKTIVITAS TELEKOMUNIKASI TANPA KABEL","KECAMATAN":"Mataram","KABUPATEN/KOTA":"Kota Mataram","TAMBAHAN MODAL TETAP REALISASI":665292420294,"AKUMULASI REALISASI INVESTASI":1827358609517,"KETERANGAN":"PMA"},
    {"NO":2,"NAMA PELAKU USAHA":"AGRINDO NUSANTARA","KBLI":"46319","SEKTOR":"Perdagangan","RINCIAN KBLI":"Perdagangan Besar Bahan Makanan Dan Minuman Hasil Pertanian Lainnya","KECAMATAN":"Sandubaya","KABUPATEN/KOTA":"Kota Mataram","TAMBAHAN MODAL TETAP REALISASI":87800000000,"AKUMULASI REALISASI INVESTASI":727830634210,"KETERANGAN":"PMDN"},
    {"NO":3,"NAMA PELAKU USAHA":"INDOSAT","KBLI":"61200","SEKTOR":"Telekomunikasi","RINCIAN KBLI":"AKTIVITAS TELEKOMUNIKASI TANPA KABEL","KECAMATAN":"Mataram","KABUPATEN/KOTA":"Kota Mataram","TAMBAHAN MODAL TETAP REALISASI":1421173252,"AKUMULASI REALISASI INVESTASI":253927304487,"KETERANGAN":"PMA"},
    {"NO":4,"NAMA PELAKU USAHA":"AIR MINUM GIRI MENANG","KBLI":"36001","SEKTOR":"Kelautan dan Perikanan","RINCIAN KBLI":"Penampungan, Penjernihan dan Penyaluran Air Minum","KECAMATAN":"Selaprang","KABUPATEN/KOTA":"Kota Mataram","TAMBAHAN MODAL TETAP REALISASI":14002266766,"AKUMULASI REALISASI INVESTASI":118085467163,"KETERANGAN":"PMDN"},
    {"NO":5,"NAMA PELAKU USAHA":"BINTANG BALI INDAH","KBLI":"46333","SEKTOR":"Perdagangan","RINCIAN KBLI":"Perdagangan Besar Minuman Beralkohol","KECAMATAN":"Sandubaya","KABUPATEN/KOTA":"Kota Mataram","TAMBAHAN MODAL TETAP REALISASI":0,"AKUMULASI REALISASI INVESTASI":117033565000,"KETERANGAN":"PMDN"}
];

document.addEventListener('DOMContentLoaded', function() {
    // --- GLOBAL VARIABLES ---
    let map, markersLayer, citiesData = [], investmentChart;

    // --- MASTER DATA FOR REGIONS ---
    const regionMasterData = {
      "Kota Mataram":     { coords: [116.1178, -8.5833], population: "441.000", name: "Mataram", type: "Ibu Kota" },
      "Kab. Lombok Barat":{ coords: [116.05, -8.65], population: "726.000", name: "Lombok Barat", type: "Kabupaten" },
      "Kab. Lombok Tengah":{ coords: [116.2833, -8.7], population: "1.048.000", name: "Lombok Tengah", type: "Kabupaten" },
      "Kab. Lombok Timur":{ coords: [116.5, -8.5833], population: "1.369.000", name: "Lombok Timur", type: "Kabupaten" },
      "Kab. Lombok Utara":{ coords: [116.25, -8.3333], population: "252.000", name: "Lombok Utara", type: "Kabupaten" },
      "Kab. Sumbawa":     { coords: [117.4181, -8.5], population: "512.000", name: "Sumbawa", type: "Kabupaten" },
      "Kab. Sumbawa Barat":{ coords: [116.85, -8.8333], population: "149.000", name: "Sumbawa Barat", type: "Kabupaten" },
      "Kab. Dompu":       { coords: [118.4667, -8.5333], population: "241.000", name: "Dompu", type: "Kabupaten" },
      "Kab. Bima":        { coords: [118.5833, -8.5], population: "536.000", name: "Bima", type: "Kabupaten" },
      "Kota Bima":        { coords: [118.7267, -8.46], population: "155.000", name: "Kota Bima", type: "Kota" }
    };

    // --- DATA PROCESSING ---
    function generateGeoJSONFromRealData(rawData) {
        const validData = rawData.filter(item => item && typeof item.NO === 'number' && item["NAMA PELAKU USAHA"] && item["AKUMULASI REALISASI INVESTASI"]);
        
        const groupedByRegion = {};
        validData.forEach(company => {
            const regionKey = company["KABUPATEN/KOTA"];
            if (!groupedByRegion[regionKey]) groupedByRegion[regionKey] = [];
            groupedByRegion[regionKey].push({
                name: company["NAMA PELAKU USAHA"],
                sector: company["SEKTOR"] || "Lainnya",
                investment: parseFloat(company["AKUMULASI REALISASI INVESTASI"]) || 0,
                type: company["KETERANGAN"],
            });
        });

        const features = Object.values(regionMasterData).map(master => {
            // Match region names like "Kab. Bima", "Kota Mataram", or just "Mataram"
            const companies = groupedByRegion[`Kab. ${master.name}`] || groupedByRegion[`Kota ${master.name}`] || groupedByRegion[master.name] || [];
            companies.sort((a, b) => b.investment - a.investment);
            const totalInvestment = companies.reduce((sum, c) => sum + c.investment, 0);
            
            return {
                type: "Feature",
                properties: { 
                    ...master, 
                    total_investment: totalInvestment, 
                    total_companies: companies.length, 
                    top_companies: companies.slice(0, 5) // Get top 5 companies
                },
                geometry: { type: "Point", coordinates: master.coords }
            };
        });
        return { type: "FeatureCollection", features: features };
    }

    // --- MAP INITIALIZATION & RENDERING ---
    function initializeMap() {
        map = L.map('map', { zoomControl: false, minZoom: 8 }).setView([-8.65, 117.36], 8);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        markersLayer = L.layerGroup().addTo(map);
        document.getElementById('reset-view').addEventListener('click', () => map.setView([-8.65, 117.36], 8));
    }

    function getMarkerStyle(type, investment) {
        let radius = 10 + Math.log10(investment + 1) * 1.2;
        radius = Math.max(12, Math.min(radius, 28)); // Clamp radius
        const styles = {
            'Ibu Kota': { icon: 'fas fa-star', gradient: 'var(--gradient-accent)' },
            'Kota': { icon: 'fas fa-city', gradient: 'var(--gradient-main)', opacity: 0.8 },
            'Kabupaten': { icon: 'fas fa-mountain', gradient: 'var(--gradient-main)', opacity: 1.0 }
        };
        return { radius, ...(styles[type] || styles['Kabupaten']) };
    }

    function createAnimatedMarker(feature) {
        const { type, total_investment } = feature.properties;
        const style = getMarkerStyle(type, total_investment);
        const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        const customIcon = L.divIcon({
            html: `<div class="custom-marker" style="width:${style.radius*2}px;height:${style.radius*2}px;background:${style.gradient};opacity:${style.opacity};border:2px solid white;box-shadow:var(--shadow-strong);"><i class="${style.icon}"></i></div>`,
            className: 'leaflet-div-icon', iconSize: [style.radius*2, style.radius*2], iconAnchor: [style.radius, style.radius]
        });
        const marker = L.marker(coords, { icon: customIcon });
        marker.bindPopup(createEnhancedPopupContent(feature.properties), { maxWidth: 400, className: 'custom-popup' });
        marker.on('mouseover', function() { this.openPopup(); });
        return marker;
    }
    
    // --- UI & DASHBOARD LOGIC ---
    function createEnhancedPopupContent(props) {
        const topCompaniesHtml = props.top_companies.map((c, i) => `
            <div class="company-item">
                <div class="company-rank">#${i + 1}</div>
                <div style="flex:1;">
                    <div class="company-name">${c.name}</div>
                    <div class="company-info">${c.sector} | ${c.type}</div>
                    <div class="company-investment">${formatCurrency(c.investment)}</div>
                </div>
            </div>`).join('');
        return `<div class="popup-header"><h4>${props.name}</h4><div class="city-type">${props.type}</div></div>
                <div class="popup-body">
                    <div class="popup-stats">
                        <div class="stat-item"><div class="stat-label">Populasi</div><div class="stat-value">${props.population}</div></div>
                        <div class="stat-item"><div class="stat-label">Jml. Perusahaan</div><div class="stat-value">${props.total_companies}</div></div>
                    </div>
                    <div class="popup-section">
                        <h5><i class="fas fa-trophy"></i> Top 5 Investor (Realisasi)</h5>
                        <div class="companies-list">${topCompaniesHtml || 'Data tidak tersedia.'}</div>
                    </div>
                </div>`;
    }
    
    function updateDashboard() {
        const totalInvestment = citiesData.reduce((s, c) => s + c.properties.total_investment, 0);
        const totalCompanies = citiesData.reduce((s, c) => s + c.properties.total_companies, 0);
        let pmaInvestment = 0, pmdnInvestment = 0;
        citiesData.forEach(c => c.properties.top_companies.forEach(co => (co.type === 'PMA' ? pmaInvestment += co.investment : pmdnInvestment += co.investment)));
        const pmaPercentage = totalInvestment > 0 ? (pmaInvestment / totalInvestment * 100).toFixed(1) : 0;
        const pmdnPercentage = totalInvestment > 0 ? (pmdnInvestment / totalInvestment * 100).toFixed(1) : 0;
        
        document.getElementById('total-investment-header').textContent = formatCurrencyShort(totalInvestment);
        document.getElementById('total-companies-header').textContent = totalCompanies.toLocaleString('id-ID');
        document.getElementById('total-investment-display').textContent = formatCurrency(totalInvestment);
        document.getElementById('total-companies-display').textContent = `${totalCompanies.toLocaleString('id-ID')} Perusahaan`;
        document.getElementById('pma-percentage').textContent = `${pmaPercentage}%`;
        document.getElementById('pmdn-percentage').textContent = `${pmdnPercentage}%`;

        renderInvestmentChart();
        renderRanking();
    }

    function renderInvestmentChart() {
        const ctx = document.getElementById('investmentChart').getContext('2d');
        if (investmentChart) investmentChart.destroy();
        
        const sortedData = [...citiesData].sort((a,b) => b.properties.total_investment - a.properties.total_investment);

        investmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedData.map(c => c.properties.name),
                datasets: [{
                    label: 'Total Investasi (Rp)',
                    data: sortedData.map(c => c.properties.total_investment),
                    backgroundColor: 'rgba(13, 71, 161, 0.8)',
                    borderColor: 'rgba(13, 71, 161, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Investasi: ${formatCurrency(context.raw)}`
                        }
                    }
                },
                scales: {
                    x: { ticks: { callback: value => formatCurrencyShort(value) } }
                }
            }
        });
    }

    function renderRanking() {
        const regionList = document.getElementById('region-ranking-list');
        const companyList = document.getElementById('company-ranking-list');
        
        // Region Ranking
        const sortedRegions = [...citiesData].sort((a,b) => b.properties.total_investment - a.properties.total_investment);
        regionList.innerHTML = sortedRegions.map((c, i) => `
            <div class="ranking-item">
                <div class="rank">${i + 1}.</div>
                <div>
                    <div class="name">${c.properties.name}</div>
                    <div class="meta">${c.properties.total_companies} Perusahaan</div>
                </div>
                <div class="value">${formatCurrencyShort(c.properties.total_investment)}</div>
            </div>`).join('');

        // Company Ranking
        const allCompanies = citiesData.flatMap(c => c.properties.top_companies.map(co => ({...co, region: c.properties.name})));
        const sortedCompanies = allCompanies.sort((a, b) => b.investment - a.investment).slice(0, 10);
        companyList.innerHTML = sortedCompanies.map((c, i) => `
             <div class="ranking-item">
                <div class="rank">${i + 1}.</div>
                <div>
                    <div class="name">${c.name}</div>
                    <div class="meta">${c.region} | ${c.sector}</div>
                </div>
                <div class="value">${formatCurrencyShort(c.investment)}</div>
            </div>`).join('');
    }

    function setupDashboardControls() {
        const buttons = document.querySelectorAll('.dashboard-btn');
        const contents = document.querySelectorAll('.dashboard-content');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                contents.forEach(content => {
                    content.classList.toggle('active', content.id === `${button.dataset.view}-dashboard`);
                });
            });
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) return;
            const found = citiesData.find(c => c.properties.name.toLowerCase().includes(query));
            if (found) {
                const coords = [found.geometry.coordinates[1], found.geometry.coordinates[0]];
                map.flyTo(coords, 11);
                markersLayer.eachLayer(layer => {
                    const markerCoords = layer.getLatLng();
                    if (markerCoords.lat === coords[0] && markerCoords.lng === coords[1]) {
                       setTimeout(() => layer.openPopup(), 500);
                    }
                });
            } else {
                alert('Wilayah tidak ditemukan.');
            }
        };
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
    }

    // --- HELPER FUNCTIONS ---
    function formatCurrency(value) { return `Rp ${Math.round(value).toLocaleString('id-ID')}`; }
    function formatCurrencyShort(value) {
        if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(2)} T`;
        if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)} M`;
        if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)} Jt`;
        return formatCurrency(value);
    }

    // --- APP INITIALIZATION ---
    function init() {
        initializeMap();
        try {
            const geojsonData = generateGeoJSONFromRealData(rawInvestmentData);
            citiesData = geojsonData.features;
            markersLayer.clearLayers();
            citiesData.forEach(feature => {
                if(feature.geometry && feature.geometry.coordinates) markersLayer.addLayer(createAnimatedMarker(feature));
            });
            updateDashboard();
            setupSearch();
            setupDashboardControls();
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => document.getElementById('loading').style.display = 'none', 500);
        } catch (error) {
            console.error('Gagal memproses dan memuat data peta:', error);
            document.getElementById('loading').innerHTML = '<h3>Gagal Memuat Data</h3>';
        }
    }
    
    init();
});

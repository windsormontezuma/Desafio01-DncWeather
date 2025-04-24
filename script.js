document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const results = document.getElementById('results');
    
    // Function to fetch address information using CEP
    async function fetchAddress(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('CEP não encontrado');
            }
            const data = await response.json();
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            return data;
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            throw error;
        }
    }

    // Function to fetch weather information
    async function fetchWeather(latitude, longitude) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`);
            if (!response.ok) {
                throw new Error('Erro ao buscar previsão do tempo');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar previsão do tempo:', error);
            throw error;
        }
    }

    // Function to create and update results HTML
    function createResultsHTML() {
        results.innerHTML = `
            <div class="result-section">
                <div class="result-header">
                    <h3>Resultado da busca por CEP:</h3>
                    <div class="pin-icon">xxxxx</div>
                </div>
                <div class="result-table">
                    <div class="table-header">
                        <div>Logradouro/nome</div>
                        <div>Bairro/Distrito</div>
                        <div>Localidade/UF</div>
                    </div>
                    <div class="table-content" id="addressResult">
                        <div>-</div>
                        <div>-</div>
                        <div>-</div>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <div class="result-header">
                    <h3>Previsão do tempo na região:</h3>
                    <div class="weather-icon-container">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-icon" style="margin-left: -0.5rem;">
                            <path d="M18 9.6C18 7.61175 16.3882 6 14.4 6C14.0625 6 13.7348 6.0465 13.4228 6.13425C12.657 4.614 11.0872 3.6 9.3 3.6C6.51525 3.6 4.2 5.91525 4.2 8.7C4.2 8.88075 4.20975 9.05925 4.22835 9.23475C3.07425 9.50925 2.25 10.6065 2.25 11.9C2.25 13.0163 3.01125 13.9583 4.05 14.4083H16.95C18.7388 14.4083 20.1 13.047 20.1 11.2583C20.1 9.84825 19.047 8.64075 17.7 8.42025V9.6Z" fill="#0C70F2"/>
                        </svg>
                    </div>
                </div>
                <div class="weather-result">
                    <p id="weatherResult">Previsão de tempo de acordo com a região: - °C</p>
                </div>
            </div>
        `;
    }

    // Function to update address table
    function updateAddressTable(address) {
        const addressResult = document.getElementById('addressResult');
        if (addressResult) {
            addressResult.innerHTML = `
                <div>${address.logradouro || '-'}</div>
                <div>${address.bairro || '-'}</div>
                <div>${address.localidade}/${address.uf || '-'}</div>
            `;
        }
    }

    // Function to update weather information
    function updateWeatherInfo(weather) {
        const weatherResult = document.getElementById('weatherResult');
        if (weatherResult) {
            const temperature = Math.round(weather.current.temperature_2m);
            weatherResult.textContent = `Previsão de tempo de acordo com a região: ${temperature}° C`;
        }
    }

    // Handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const email = document.getElementById('email').value;
        const cep = document.getElementById('cep').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        // Basic validation
        if (!firstName || !email || !cep || !latitude || !longitude) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            // Create results structure if it doesn't exist
            createResultsHTML();
            
            // Show results section
            results.style.display = 'block';

            // Update pin icon with CEP
            const formattedCep = cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
            const pinIcon = document.querySelector('.pin-icon');
            if (pinIcon) {
                pinIcon.textContent = formattedCep;
            }

            // Fetch and update address information
            const addressData = await fetchAddress(cep);
            updateAddressTable(addressData);

            // Fetch and update weather information
            const weatherData = await fetchWeather(latitude, longitude);
            updateWeatherInfo(weatherData);

        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    });

    // CEP input mask
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
    });
}); 
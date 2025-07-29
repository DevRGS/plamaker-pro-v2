interface LocationData {
  state: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Função para obter localização via IP usando um serviço gratuito
export const getLocationByIP = async (): Promise<LocationData | null> => {
  try {
    // Usando ipapi.co que é gratuito e confiável
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.error) {
      console.warn('Erro ao obter localização por IP:', data.reason);
      return null;
    }

    return {
      state: data.region || '',
      city: data.city || '',
      country: data.country_name || '',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Erro ao buscar localização por IP:', error);
    return null;
  }
};

// Função para obter localização via GPS (opcional, requer permissão do usuário)
export const getLocationByGPS = (): Promise<LocationData | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Usar reverse geocoding para obter estado e cidade
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          );
          const data = await response.json();

          resolve({
            state: data.principalSubdivision || '',
            city: data.city || data.locality || '',
            country: data.countryName || '',
            latitude,
            longitude
          });
        } catch (error) {
          console.error('Erro no reverse geocoding:', error);
          resolve({
            state: '',
            city: '',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      },
      (error) => {
        console.warn('Erro ao obter localização GPS:', error.message);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  });
};

// Função principal que tenta GPS primeiro, depois IP
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  // Primeiro tenta GPS (mais preciso)
  const gpsLocation = await getLocationByGPS();
  if (gpsLocation && gpsLocation.state && gpsLocation.city) {
    return gpsLocation;
  }

  // Se GPS falhar ou não tiver dados completos, usa IP
  const ipLocation = await getLocationByIP();
  return ipLocation;
};

// Mapear códigos de estado para nomes completos (Brasil)
export const stateCodeToName: Record<string, string> = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

// Função para normalizar nome do estado
export const normalizeStateName = (state: string): string => {
  if (!state) return '';
  
  // Se é código do estado, converter para nome completo
  const upperState = state.toUpperCase();
  if (stateCodeToName[upperState]) {
    return stateCodeToName[upperState];
  }
  
  // Se já é nome completo, retornar como está
  return state;
};
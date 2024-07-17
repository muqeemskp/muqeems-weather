import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

import sunny from './assets/sunny.png'
import snowy from './assets/snowy.png'
import rain from './assets/rain.png'
import cloud from './assets/cloud.png'

import clearbg from './assets/clearbg.png'
import cloudybg from './assets/cloudybg.png'
import hazebg from './assets/hazebg.png'
import mistbg from './assets/mistbg.png'
import snowbg from './assets/snowbg.png'
import rainybg from './assets/rainybg.png'

import loading from './assets/loading.gif'

function App() {
  const [data, setData] = useState({});
  const [wError, setWError] = useState('');
  const [location, setLocation] = useState('Sheikhupura');
  const [background, setBackground] = useState(clearbg);
  const [loadingData, setLoadingData] = useState(false);

  const api_key = '9399ce923b372cf04639cc79a327a187';

  useEffect(() => {
    search();
  }, []);

  const search = async () => {
    setLoadingData(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api_key}`;
    
    try {
      const res = await axios.get(url);
      const searchData = res.data; // data is the object inside api response having our required data, we can log the api to see datial
      setData(searchData);
      setBackground(getBackgroundImage(searchData.weather[0].main));
      setLocation('');
      setWError('');
      setLoadingData(false);
        } catch (error) {
      console.log(error.message);
      setWError('Location not found. Please enter a valid city name.');
      setData({}); //will remove everything from the weather screen
      setLoadingData(false);
    }
  }

  const getWeatherIcon = (main) => {
    switch(main) {
      case 'Clear':
        return sunny;
      case 'Snow':
        return snowy;
      case 'Rain':
        return rain;
      case 'Clouds':
        return cloud;
      case 'Haze':
        return cloud;
      case 'Mist':
        return cloud;
      case 'Smoke':
        return cloud;
      default:
        return sunny;
    }
  }

  const getBackgroundImage = (main) => {
    switch(main) {
      case 'Clear':
        return clearbg;
      case 'Snow':
        return snowbg;
      case 'Rain':
        return rainybg;
      case 'Clouds':
        return cloudybg;
      case 'Haze':
        return cloudybg;
      case 'Mist':
        return mistbg;
      case 'Drizzle':
        return hazebg;
      default:
        return clearbg;
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  }

  return (
    <>
      <div className="container" style={{ backgroundImage: `url(${background})` }}> 
        <div className='main-heading'>MUQEEM'S WEATHER</div>
        <div className="weather-main">
          <div className="search">
            <div className="search-top">
              <i className='fa-solid fa-location-dot'></i> 
              <h3>{!wError && data.name}</h3> {/* Show city name only if no error */}
            </div>
            <div className="search-input">
              <input 
                type='text' 
                placeholder='Enter city name'
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className='fa-solid fa-search' onClick={search}></i>
            </div>
          </div>
          {loadingData ? (
            <div className="loading">
              <img src={loading} alt="loading" className='loading' />
            </div>
          ) : (
            <>
              {wError && <div className="error">{wError}</div>}
              {!wError && data.main && ( //if there is no error and data do have properties, mean api is working then go forward
                <>
                  <div className="weather">
                    <img src={getWeatherIcon(data.weather[0].main)} alt={data.weather[0].main} />
                    <div className="weather-type">{data.weather[0].main}</div>
                    <div className="temp">{Math.round(data.main.temp)}°</div>
                  </div>
                  <div className="weather-date">
                    <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
                  <div className="weather-data">
                    <div className="humidity">
                      <div className="data-name">Humidity</div>
                      <i className="fa-solid fa-droplet"></i>
                      <div className="data">{data.main.humidity}%</div> 
                    </div>
                    <div className="wind">
                      <div className="data-name">Wind</div>
                      <i className="fa-solid fa-wind"></i>
                      <div className="data">{data.wind.speed} km/h</div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App

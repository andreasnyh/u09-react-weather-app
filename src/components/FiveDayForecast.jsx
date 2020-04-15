import React from 'react';

const fiveDayStyle = {
  display: 'flex',
  // justifyContent: 'space-between',
  width: '45vw',
  flexWrap: 'wrap',
  flexDirection: 'column',
  position: 'relative',
  margin: '0 auto',
  textTransform: 'capitalize',
  border: '1px solid gray',
  borderRadius: '10px',
  padding: '1rem',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  borderBottom: '1px solid lightgray',
};

const minTempStyle = {
  color: 'blue',
};

const maxTempStyle = {
  color: 'red',
};

const FiveDayForecast = (props) => {
  const weatherData = props.weatherData.list;
  const { tempUnit } = props;
  console.log('five: ', weatherData);
  let dateOptions = {
    weekday: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <div className='fiveDayList' style={fiveDayStyle}>
      <h3>Five day Forecast</h3>
      {weatherData.map((weatherData) => (
        <div key={weatherData.dt} className='row' style={rowStyle}>
          {/* Timestamp into readable date */}
          <span>
            {/* För svenska 'sv-SE' */}
            {Intl.DateTimeFormat('en-US', dateOptions).format(
              weatherData.dt * 1000
            )}
            {/* Timestamp */}
            {', ' +
              Intl.DateTimeFormat('sv-SE', {
                hour: 'numeric',
                // minute: 'numeric'
              }).format(weatherData.dt * 1000)}
            h
          </span>

          {/* Weather Icon */}
          {weatherData.weather.map((weatherType) => (
            <div key={Math.random() * 99999}>
              <img
                className='dayWeatherIcon'
                src={`http://openweathermap.org/img/wn/${weatherType.icon}@2x.png`}
                alt={weatherType.description}
                title={weatherType.description}
              />
              {/* Weather Icon Description */}
              <div>{weatherType.description}</div>
            </div>
          ))}

          {/* Temperature */}
          {/* Min Temperature */}
          <span className='minTemp' style={minTempStyle}>
            {'⬇' + Math.round(weatherData.main.temp_min)}
            {tempUnit === 'metric' ? '\u00b0C' : '\u00b0F'}

            {/* Max Temperature */}
            <span className='maxTemp' style={maxTempStyle}>
              &nbsp; {'⬆' + Math.round(weatherData.main.temp_max)}
              {tempUnit === 'metric' ? '\u00b0C' : '\u00b0F'}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default FiveDayForecast;
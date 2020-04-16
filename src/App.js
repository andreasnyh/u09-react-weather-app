import React, { Component } from 'react';
// import Api from './Api';
import Detail from './components/Detail';
import Forecast from './components/Forecast';
import Temperature from './components/Temperature';
import Wind from './components/Wind';
import SunAndMoon from './components/SunAndMoon';
import LocationInput from './components/LocationInput'
import Location from './components/Location'

import './App.css';

class App extends Component {
  apiKey = '47191cd2411b39bd47c91b1dfe204dd6';
  city = '';
  constructor() {
    super();
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCitySubmit = this.handleCitySubmit.bind(this);
    this.getLocation = this.getLocation.bind(this);
    

    this.state = {
      error: null,
      isLoaded: false,
      currentCity: 'Stockholm',
      tempUnit: 'metric',
      speedUnit: 'metric',
      forecast: {},
      today: {},
      latitude: '',
      longitude: '',
      searchMyLocation: 'no'
    };
  }
  /* tempUnit
    For temperature in Fahrenheit use units=imperial
    For temperature in Celsius use units=metric
    Temperature in Kelvin is used by default,
    no need to use units parameter in API call
  */

  handleCityChange = (event) => {
    this.city = event.target.value;

  }

  handleCitySubmit = (event) => {
    let prevState = this.state;
    if(prevState.currentCity !== this.city){
      this.setState({currentCity : this.city}, () => {
        this.getForecastAndWeather()
      })
      
  }
    event.preventDefault();
  }


 showLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  () => {
    let prevState = this.state;
    if(prevState.latitude !== this.latitude && prevState.longitude !== this.longitude){
      this.setState({latitude: this.latitude,
                     longitude: this.longitude,
                     searchMyLocation: 'yes' }, 
                     () => {this.getForecastAndWeather()
      })
    }
  }
}

 errorHandler(err) {
  if(err.code == 1) {
     alert("Error: Access is denied!");
  } else if( err.code == 2) {
     alert("Error: Position is unavailable!");
  }
}
  
 getLocation() {

  if(navigator.geolocation) {
     // timeout at 60000 milliseconds (60 seconds)
     var options = {timeout:60000};
     navigator.geolocation.getCurrentPosition(this.showLocation, this.errorHandler, options);
  } 
  else {
     alert("Sorry, browser does not support geolocation!");
  }

}
  
  /* componentDidUpdate(prevState) {
    if(prevState.currentCity !== this.state.currentCity){
      this.getForecastAndWeather();
    } 
  } */


  componentDidMount() {
    // When components mount run both fetches and wait for response
    this.getForecastAndWeather()
    /* .then(
      // load the results.json into state
      ([forecast, weather]) => {
        this.setState({
          forecast: forecast,
          today: weather,
          isLoaded: true,
        }); */
    // console.log('Forecast: ', forecast);
    // console.log('weather: ', weather);

    
    // }
    // );
  }

  // Wait until both fetches return a response
  getForecastAndWeather() {
    Promise.all([this.getForecast(), this.getWeather()]).then(
      // load the results.json into state
      ([forecast, weather]) => {
        this.setState({
          forecast: forecast,
          today: weather,
          isLoaded: true,
        });
      }
      )
      console.log('Fetched 5-day forecast for:', this.state.currentCity);
  }



  getForecast() {
    
      if(this.state.searchMyLocation=='yes'){
        return fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat={this.state.latitude}&lon={this.state.longitude}&appid={this.apiKey}`
        )} 
      else{
        return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.currentCity}&units=${this.state.tempUnit}&appid=${this.apiKey}`
        )}
    .then((res) => {
      // check if we get an ok response else throw an error
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    },
      // catch error
      (err) => this.setState({ error: err, isLoaded: true }));
    /* .then(
        // load the results.json into state
        (res) => {
          this.setState({
            forecast: res.list,
            isLoaded: true,
          });
          // console.log("Forecast state: ",res.list);

          console.log('Fetched 5-day forecast for:', this.state.currentCity);
        },
        // catch error
        (err) => this.setState({ error: err, isLoaded: true })
      ); */
  }

  getWeather() {
    
      if(this.state.searchMyLocation=='yes'){
        return fetch( 
        `https://api.openweathermap.org/data/2.5/weather?lat={this.state.latitude}&lon={this.state.longitude}&appid={this.apiKey}`
        )} 
      else{
      return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.state.currentCity}&units=${this.state.tempUnit}&appid=${this.apiKey}`
      )}
    .then((res) => {
      // check if we get an ok response else throw an error
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    },
   
      (err) => this.setState({ error: err, isLoaded: true }));

  }

  render() {
    const { forecast, today, tempUnit, speedUnit } = this.state;
    const { error, isLoaded /*weatherData*/ } = this.state;
    // console.log(this.state);

    if (error) {
      return <div>Something went wrong: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='App'>
          {/* <Detail temp={temp} /> */}
          <LocationInput handleCitySubmit={this.handleCitySubmit} handleCityChange={this.handleCityChange} />
          <p>{this.state.currentCity}</p>
          <Location />
          <Forecast forecast={forecast} tempUnit={tempUnit} />
          <Temperature temp={today.main.temp} tempUnit={tempUnit} />
          <Detail weather={today} tempUnit={tempUnit} />
          <Wind wind={today.wind} speedUnit={speedUnit} />
          <SunAndMoon time={today.sys} />
        </div>
      );
    }
  }
}

export default App;

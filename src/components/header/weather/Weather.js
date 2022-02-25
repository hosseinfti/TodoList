import React, { Component } from "react";
import axios from "axios";
import iranCities from "/home/hossein/Documents/Practice/ReactJs/ClassPractice/todolist/src/json/iranCities.json";
import airConditions from "/home/hossein/Documents/Practice/ReactJs/ClassPractice/todolist/src/json/airConditions.json";
import Pollution from "../pollution/Pollution";
import "../style.css";
// import weatherIcon from "../../../assets/images/weather/haze-night.png";
// import air from "../../../json/module"

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: iranCities,
      cityName: iranCities[12]["name"],
      inputCity: iranCities[12]["langs"][0]["fa"],
      inputId: iranCities[12]["id"],
      inputLat: iranCities[12]["coord"]["lat"],
      inputLon: iranCities[12]["coord"]["lon"],
      weatherData: undefined,
      weatherDescription: undefined,
      weatherTextDisplay: undefined,
      airConditionsText: airConditions,
      loading: false,
      iconSrc: "",
    };
  }

  getWeatherData = () => {
    axios
      .get(
        // `http://api.openweathermap.org/data/2.5/weather?id=${this.state.inputId}&units=metric&appid=2166d7ffe1acb211d49ade284aa794fa`
        `http://api.openweathermap.org/data/2.5/weather?lat=${this.state.inputLat}&lon=${this.state.inputLon}&units=metric&appid=2166d7ffe1acb211d49ade284aa794fa`
      )
      .then((response) => response.data)
      .then((data) => {
        this.setState(
          {
            weatherData: data.main.temp,
            weatherDescription: data.weather[0].description,
            weatherTextDisplay: this.state.airConditionsText.filter((item) => {
              return item["id"] === data.weather[0].id;
            }),
          },
          () =>
            this.setState({
              iconSrc: this.state.weatherTextDisplay[0]["icon"],
            })
        );
      });
  };

  handleSelectCity = (event) => {
    const x = this.state.cities.filter((item) => {
      return event.target.value === item.langs[0].fa;
    });
    this.setState(
      {
        inputLat: x[0]["coord"]["lat"],
        inputLon: x[0]["coord"]["lon"],
        inputId: x[0].id,
        inputCity: event.target.value,
        cityName: x[0].name,
      },
      () => this.getWeatherData()
    );
  };

  componentDidMount() {
    this.getWeatherData();
  }
  componentDidUpdate() {}

  render() {

    const weatherIcon =
      this.state.iconSrc === "storm-rain"
        ? require(`../../../assets/images/weather4/storm-rain.png`).default
        : this.state.iconSrc === "storm"
        ? require(`../../../assets/images/weather4/storm.png`).default
        : this.state.iconSrc === "rain"
        ? require(`../../../assets/images/weather4/rain.png`).default
        : this.state.iconSrc === "heavy-rain"
        ? require(`../../../assets/images/weather4/heavy-rain.png`).default
        : this.state.iconSrc === "freez-rain"
        ? require(`../../../assets/images/weather4/freez-rain.svg`).default
        : this.state.iconSrc === "snow"
        ? require(`../../../assets/images/weather4/snow.png`).default
        : this.state.iconSrc === "heavy-snow"
        ? require(`../../../assets/images/weather4/heavy-snow.png`).default
        : this.state.iconSrc === "haze-day" && new Intl.DateTimeFormat("fa-IR", {
          timeStyle: "medium",
        }).format(new Date()) >= "6:00:00" 
        ? require(`../../../assets/images/weather4/haze-day.png`).default
        : this.state.iconSrc === "haze-day" && new Intl.DateTimeFormat("fa-IR", {
          timeStyle: "medium",
        }).format(new Date()) >= "18:00:00"
        ? require(`../../../assets/images/weather4/haze-night.svg`).default
        : this.state.iconSrc === "foggy"
        ? require(`../../../assets/images/weather4/foggy.svg`).default
        : this.state.iconSrc === "tornado"
        ? require(`../../../assets/images/weather4/tornado.png`).default
        : this.state.iconSrc === "clean-day" && new Intl.DateTimeFormat("fa-IR", {
          timeStyle: "medium",
        }).format(new Date()) >= "6:00:00"
        ? require(`../../../assets/images/weather4/clean-day.png`).default
        : this.state.iconSrc === "clean-day" && new Intl.DateTimeFormat("fa-IR", {
          timeStyle: "medium",
        }).format(new Date()) >= "18:00:00"
        ? require(`../../../assets/images/weather4/clean-night.svg`).default
        : require(`../../../assets/images/weather4/cloudy.png`).default;

    let temp =
      isNaN(this.state.weatherData) === false
        ? `${this.state.weatherTextDisplay[0]["fa"]}`
        : "درحال بارگذاری ...";

    return (
      <>
        <select
          className="card selector-city color-pallete-1 inset-shadow"
          value={this.state.inputCity}
          onChange={this.handleSelectCity}
        >
          {this.state.cities.map((item) => {
            return <option key={item.id}> {item.langs[0].fa} </option>;
          })}
        </select>
        <div className="card weather-container color-pallete-1 inset-shadow">
          <div className="temp-container">
            <div className="temp">
              <span className="temp-deg">
                {isNaN(this.state.weatherData) === false
                  ? `${Math.round(this.state.weatherData)}°C`
                  : ""}
              </span>
            </div>
            <div> {temp} </div>
          </div>
          <div className="weather-icon">
            <img
              className="weather-icon-png"
              src={weatherIcon}
              alt={this.state.weatherDescription}
            />
          </div>
        </div>
        <Pollution aqiCity={this.state.cityName} />
      </>
    );
  }
}
export default Weather;

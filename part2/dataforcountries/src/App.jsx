import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name"
const allCountriesUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"
const weatherUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{City},{Country}?Params
// open source API without the need for a key

const CountryDetails = ({ country, weather }) => {
  return <>
    <h1>{country.name.common}</h1>
    <p>{country.capital[0]}</p>
    <p>Area {country.area}</p>
    <h1>Languages</h1>
    {console.log(Object.entries(country.languages))}
    <ul>
      {Object.entries(country.languages).map((arr) => <li key={arr[0]}>{arr[1]}</li>)}
    </ul>
    <img src={country.flags.png} />
    {/* {console.log(country)}
    {console.log(weather)} */}
    <h1>Weather in {country.capital}</h1>
    <p>Temperature {weather.currentConditions.feelslike}C</p>
    <p>Conditions {weather.currentConditions.conditions}</p>
  </>
}

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [country, setCountry] = useState(null)
  const [countryObject, setCountryObject] = useState(null)
  const [weather, setWeather] = useState(null)

  const handleCountryChange = (event) => {
    const value = event.target.value.toLocaleLowerCase()
    const matches = allCountries.filter((c) =>c.name.common.toLocaleLowerCase().includes(value))
    setFilteredCountries(matches)

    if (matches.length == 1) {
      setCountry(matches[0].name.common)
      return
    }

    setCountryObject(null)    
  };

  useEffect(() => {
    axios.get(allCountriesUrl).then((res) => setAllCountries(res.data));
  }, []);

  useEffect(() => {
    console.log("test2")
    if (!country) return
    console.log("test3")
    axios.get(`${baseUrl}/${country}`).then(res => setCountryObject(res.data))
  }, [country])

  useEffect(() => {
    if (!countryObject) return

    axios.get(`${weatherUrl}${countryObject.capital[0]},${countryObject.cca2}?unitGroup=metric`).then(res => setWeather(res.data))
  }, [countryObject])

  const handleShow = (countryName) => {
    setCountry(countryName)
    console.log("Test")
  }

  // console.log(filteredCountries);
  // console.log(country)
  console.log(weather)
  // console.log(countryObject)
  return (
    <>
      <p>
        find countries <input onChange={handleCountryChange}></input>
      </p>
      {filteredCountries.length != 0 ? (
        filteredCountries.length > 1 && filteredCountries.length < 10 ? (
          <>
            {filteredCountries.map((c) => (
              <p key={c.tld[0]}>{c.name.common} <button onClick={() => {handleShow(c.name.common)}}>Show</button></p>
            ))}
          </>
        ) : (
          countryObject && weather ? <CountryDetails country={countryObject} weather={weather} /> : <p>Too many countries, specifiy another filter</p>
        ) // I got lost trying to remove this part of the ternary and figured it would be easier for myself to just not display the details of the country another time by checking if the list isn't 1 element to prevent duplicate displays
      ) : ( 
        <p>enter a valid country name</p>
      )}
      {countryObject && filteredCountries.length > 1 && weather ? <CountryDetails country={countryObject} weather={weather} /> : <></>}
    </>
  );
}

export default App;

// I don't like it here... /s
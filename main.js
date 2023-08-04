"use strict";

(() => {
    const Countries_List_URL = "https://restcountries.com/v3.1/";

    const showAllBtn = document.getElementById("showAllBtn");
    const searchBtn = document.getElementById("searchBtn");
    const inputText = document.getElementById("inputText");

    const mainDataDiv = document.getElementById("mainDataDiv");
    const statDiv = document.getElementById("statDiv");

    const countriesTableContainer = document.getElementById("countriesTableDiv");
    const regionsTableDiv = document.getElementById("regionsTableDiv");
    const currenciesTableDiv = document.getElementById("currenciesTableDiv");
    const msgDiv = document.getElementById("msgDiv");

    const regionObj = {};
    const currencyObj = {};
    let totalPop = 0;
    let totalCount = 0;

    showAllBtn.addEventListener("click", getAndDisplayAll);
    searchBtn.addEventListener("click", getAndDisplayResult);

    async function getAndDisplayAll() {
        try {
            const result = await getJson(Countries_List_URL + "all");
            displayCountries(result);
        } catch (err) {
            msgDiv.innerHTML = err;
            msgDiv.style.color = "red";
        }
    }

    async function getAndDisplayResult() {
        if (inputText.value !== "") {
            try {
                const result = await getJson(Countries_List_URL + "name/" + inputText.value);
                displayCountries(result);
            } catch (err) {
                msgDiv.innerHTML = err;
                msgDiv.style.color = "red";
            }
        } else {
            reset();
        }
    }

    async function getJson(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        } catch (err) {
            msgDiv.innerHTML = err;
            msgDiv.style.color = "red";

        }
    }

    function displayCountries(countries) {
        reset();
        let html = '';

        for (const country of countries) {
            html += `<tr>
                <td><img width="25" src="${country.flags.png}" alt="${country.name.common} flag">
                ${country.name.common}</td>
                <td>${numAddCommas(country.population)}</td>
            </tr>`
            totalPop += country.population;
            totalCount++;
            regionObj[country.region] ? regionObj[country.region] += 1 : regionObj[country.region] = 1;

            for (let item in country['currencies']) {
                currencyObj[item] ? currencyObj[item] += 1 : currencyObj[item] = 1;
            }
        }
        mainDataDiv.style.display = "block";
        msgDiv.style.display = "none";
        countriesTableContainer.innerHTML = html;
        displayRegions();
        displayStatistic();
    }

    function displayRegions() {
        let html = '';
        for (const reg in regionObj) {
            html += `<tr>
                <td>${reg}</td>
                <td>${regionObj[reg]}</td>
            </tr>`
        }
        regionsTableDiv.innerHTML = html;

        html = '';
        for (const item in currencyObj) {
            html += `<tr>
                <td>${item}</td>
                <td>${currencyObj[item]}</td>
            </tr>`
        }
        currenciesTableDiv.innerHTML = html;
    }
 
    function displayStatistic() {
        let html = `
        <p>Total Countries Result:<span> ${totalCount}</span></p>
        <p>Total Countries Population:<span> ${numAddCommas(totalPop)}</span></p>
        <p>Average Population: <span>${numAddCommas(totalPop / totalCount)}</span></p>
        `;
        statDiv.innerHTML = html;
    }   

    function reset() {
        msgDiv.innerHTML = 'Please Enter Country and then press "Search".';
        msgDiv.style.color = "#777";
        mainDataDiv.style.display = "none";
        msgDiv.style.display = "block";
        inputText.value = "";
        totalPop = 0;
        totalCount = 0;

        for (const reg in regionObj) {
            delete regionObj[reg];
        }
        for (const cur in currencyObj) {
            delete currencyObj[cur];
        }
    }

    function numAddCommas(num) {
        let fixNum = Math.floor(num);
        return fixNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

})()

const axios = window.axios;

const lattitude = document.getElementById("lattitude");
const longitude = document.getElementById("longitude");
const button = document.getElementById("submitButton");
const preloader = document.querySelector('.precontainer');

const delay = ms => new Promise(res => setTimeout(res, ms));

function autocomplete(inp) {
    var currentFocus;
    inp.addEventListener("keyup", async function (e) {
        await delay(1000);

        var a,
            b,
            i,
            val = this.value;
        // console.log(val);

        closeAllLists();

        if (!val) {
            return false;
        }

        suggestiondata = await axios.post("/locationsuggestion", { val });
        const sug = suggestiondata.data;
        // console.log(sug);
        arr = sug.dname;
        dlat = sug.dlat;
        dlon = sug.dlon;

        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
            if (
                arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                b = document.createElement("DIV");
                b.innerHTML =
                    "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    indexx = arr.indexOf(inp.value);
                    // console.log(indexx);
                    lattitude.value = dlat[indexx];
                    longitude.value = dlon[indexx];
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

firstload();

autocomplete(document.getElementById("myInput"));

const getWeatherinfo = async (event) => {
    disableButton();
    // preloader.addEventListener("load", preload(preloader));
    preload(preloader);

    event.preventDefault();
    const elem = event.target.elements;
    const name = elem.namedItem("myInput").value;
    const lattitude = elem.lattitude.value;
    const longitude = elem.longitude.value;
    // console.log(lattitude, longitude);
    const weatherdata = await axios.post("/weatherinfo", {
        lattitude,
        longitude,
    });
    const data = weatherdata.data;
    // console.log(data);
    namearr = name.split(",");
    document.getElementById("placeloc").textContent = namearr[0];

    updateallinformation(data);

    document.querySelector("form").reset();
    enableButton();
};

const disableButton = () => {
    button.value = "Searching...";
    button.disabled = true;
};

const enableButton = () => {
    button.value = "Submit";
    button.disabled = false;
};

function dateformat(code) {
    const date = new Date(code * 1000);
    const day = date.toLocaleString("default", { weekday: "short" });
    const month = date.toLocaleString("default", { month: "short" });
    const day_date = date.getDate();
    return `${day}, ${day_date} ${month}`;
}

function imagecode(code) {
    switch (code) {
        case "Thunderstorm":
            return "thunderstorm";
        case "Drizzle":
            return "drizzle";
        case "Rain":
            return "rain";
        case "Snow":
            return "snow";
        case "Clear":
            return "sunny";
        case "Clouds":
            return "cloudy";
        default:
            return "atmosphere";
    }
}

function preload(loader){
    loader.style.display = "block";
    setTimeout(function(){ loader.style.display = "none"; }, 2000);
}

function updateallinformation(data){

    const today = data.current;
    oneday = data.daily[0];
    twoday = data.daily[1];
    threeday = data.daily[2];
    fourday = data.daily[3];
    fiveday = data.daily[4];



    document.getElementById("currenttemp1").textContent = Math.round(
        today.temp
    );
    document.getElementById("mainhead1").textContent = today.weather[0].main;

    document.getElementById("maxtemp1").textContent = Math.round(
        oneday.temp.max
    );
    document.getElementById("mintemp1").textContent = Math.round(
        oneday.temp.min
    );
    document.getElementById("wind1").textContent = Math.round(
        today.wind_speed * 3.6
    );

    // Update dates
    document.getElementById("daytwodate").textContent = dateformat(twoday.dt);
    document.getElementById("daythreedate").textContent = dateformat(
        threeday.dt
    );
    document.getElementById("dayfourdate").textContent = dateformat(fourday.dt);
    document.getElementById("dayfivedate").textContent = dateformat(fiveday.dt);

    // Update Max and minimum temperature
    document.getElementById("dayonemax").textContent = Math.round(
        oneday.temp.max
    );
    document.getElementById("dayonemin").textContent = Math.round(
        oneday.temp.min
    );
    document.getElementById("daytwomax").textContent = Math.round(
        twoday.temp.max
    );
    document.getElementById("daytwomin").textContent = Math.round(
        twoday.temp.min
    );
    document.getElementById("daythreemax").textContent = Math.round(
        threeday.temp.max
    );
    document.getElementById("daythreemin").textContent = Math.round(
        threeday.temp.min
    );
    document.getElementById("dayfourmax").textContent = Math.round(
        fourday.temp.max
    );
    document.getElementById("dayfourmin").textContent = Math.round(
        fourday.temp.min
    );
    document.getElementById("dayfivemax").textContent = Math.round(
        fiveday.temp.max
    );
    document.getElementById("dayfivemin").textContent = Math.round(
        fiveday.temp.min
    );

    // Update weather icon
    document.getElementById("dayoneimg").src = `./images/icons/${imagecode(
        oneday.weather[0].main
    )}.webp`;
    document.getElementById("daytwoimg").src = `./images/icons/${imagecode(
        twoday.weather[0].main
    )}.webp`;
    document.getElementById("daythreeimg").src = `./images/icons/${imagecode(
        threeday.weather[0].main
    )}.webp`;
    document.getElementById("dayfourimg").src = `./images/icons/${imagecode(
        fourday.weather[0].main
    )}.webp`;
    document.getElementById("dayfiveimg").src = `./images/icons/${imagecode(
        fiveday.weather[0].main
    )}.webp`;

    // Update weather description
    document.getElementById("dayonedesc").textContent =
        oneday.weather[0].description;
    document.getElementById("daytwodesc").textContent =
        twoday.weather[0].description;
    document.getElementById("daythreedesc").textContent =
        threeday.weather[0].description;
    document.getElementById("dayfourdesc").textContent =
        fourday.weather[0].description;
    document.getElementById("dayfivedesc").textContent =
        fiveday.weather[0].description;

    // Update background
    document.querySelector("html").style.backgroundRepeat = "no-repeat";
    document.querySelector("html").style.backgroundPosition = "center";
    document.querySelector("html").style.backgroundAttachment = "fixed";
    document.querySelector(
        "html"
    ).style.backgroundImage = `url("images/bg/${imagecode(
        today.weather[0].main
    )}.webp")`;

}

async function firstload () {

    preloader.addEventListener("load", preload(preloader));

    const lattitude = 28.6517178;
    const longitude = 77.2219388;

    const weatherdata = await axios.post("/weatherinfo", {
        lattitude,
        longitude,
    });
    const data = weatherdata.data;
    updateallinformation(data);

}

// firstload();


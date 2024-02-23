const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Erro");
  }
};

const renderCountries = (data) => {
  const row = document.querySelector(".row");
  row.innerHTML = data.map(createCard).join("");
};

const list = async () => {
  const data = await fetchData("https://restcountries.com/v3.1/all");
  renderCountries(data);
};

const handleSearchSubmit = async (event) => {
  event.preventDefault();

  const searchTerm = document
    .querySelector(".form-control")
    .value.toLowerCase();
  const data = await fetchData("https://restcountries.com/v3.1/all");

  const filteredData = data.filter((country) =>
    countrySearchs(country, searchTerm)
  );
  renderCountries(filteredData);
};

const countrySearchs = (country, searchTerm) => {
  const commonName = country.translations?.por?.common?.toLowerCase();
  const region = country.region?.toLowerCase();
  return commonName.includes(searchTerm) || region.includes(searchTerm);
};

const createCard = (country) => {
  const cardColorClass = document.body.classList.contains("dark-mode")
    ? "card-dark"
    : "card-light";

  return `
    <div class="col-4">
        <div class="card mt-3 ${cardColorClass}">
            <img src="${country.flags.png}" class="card-img-top" alt="${country.flags.alt}" data-bs-toggle="modal" data-bs-target="#countryModal" onclick="openCountryModal('${country.translations.por.common}', '${country.region}', '${country.capital}', '${country.population}', '${country.timezones}' )">
            <div class="card-body">
                <h5 class="card-title">${country.translations.por.common}</h5>
                <p class="card-text">
                    Região: ${country.region}
                </p>
            </div>
        </div>
    </div>`;
};

const openCountryModal = (
  countryName,
  countryRegion,
  countryCapital,
  countryPopulation,
  countryTimeZones
) => {
  document.getElementById("countryModalName").innerText = countryName;
  document.getElementById(
    "countryModalRegion"
  ).innerText = `Região: ${countryRegion}`;
  document.getElementById(
    "countryModalCapital"
  ).innerText = `Capital: ${countryCapital}`;
  document.getElementById(
    "countryModalPopulation"
  ).innerText = `População: ${countryPopulation} habitantes`;
  document.getElementById(
    "countryModalTimeZones"
  ).innerText = `Time zones: ${countryTimeZones}`;
};

document
  .getElementById("searchForm")
  .addEventListener("submit", handleSearchSubmit);

document.getElementById("darkModeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");

  const navbar = document.querySelector(".navbar");
  const isDarkMode = document.body.classList.contains("dark-mode");

  navbar.classList.toggle("navbar-light", !isDarkMode);
  navbar.classList.toggle("bg-light", !isDarkMode);
  navbar.classList.toggle("navbar-dark", isDarkMode);
  navbar.classList.toggle("bg-dark", isDarkMode);

  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("card-light", !isDarkMode);
    card.classList.toggle("card-dark", isDarkMode);
  });

  const modal = document.getElementById("countryModal");
  modal.classList.toggle("dark-mode", isDarkMode);
});

list();

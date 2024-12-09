
import {urlJson, urlAPI} from "../scripts/module.js";

const countryListElement = document.getElementById("country-list");
const mensagemDeErroJson = document.getElementById("json-error");

try {
  var resp = await fetch(urlJson);
  var paises = await resp.json();
} catch (error) {
  mensagemDeErroJson.style.display = "flex";
}

for (const pais of paises) {
  countryListElement.insertAdjacentHTML("beforeend", `<option value="${pais.sigla}">${pais.nome_pais}</option>`);
}


countryListElement.onchange = function() {
  let countrySelect = document.getElementById("country-list");

  let value = countrySelect.selectedIndex;

  let array = [];
  array.push(paises[value].nome_pais_int);
  array.push(paises[value].gentilico);
  array.push(paises[value].sigla);

  // map
  function toUpperCase(text) {
    return text.toUpperCase();
  }
  let newArray = array.map(toUpperCase);

  // destructuring
  const [internacional, gentilico, sigla] = newArray;
  
  document.getElementById("internacional").textContent = internacional;
  document.getElementById("gentilico").textContent = gentilico;
  document.getElementById("sigla").textContent = sigla;
};

const searchButton = document.getElementById("formButton");
const conteudo = document.getElementById("ddd");
const filterElement = document.getElementById("filter");
const mensagemDeErroAPI = document.getElementById("api-error");
const cidadesElement = document.getElementById("cidades-list");

function displayCities(cidades, filtro) {
  mensagemDeErroAPI.style.display = "none";
  
  cidadesElement.innerHTML = '';
  // filtro
  if (filtro !== undefined) {
    function comecaCom(nome) {
      return nome.toUpperCase().startsWith(filtro.toUpperCase());
    }
    
    var arrayFiltrado = cidades.cities.filter(comecaCom);
    for (const cidade of arrayFiltrado) {
      cidadesElement.insertAdjacentHTML("beforeend", `<option value="${cidades.estado}">${cidades.state} - ${cidade}</option>`);
    }
    return;
  }
  
  for (const cidade of cidades.cities) {
    cidadesElement.insertAdjacentHTML("beforeend", `<option value="${cidades.estado}">${cidades.state} - ${cidade}</option>`);
  }
}

var cidades = {};
const dddList = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68,
  69, 71, 73, 74, 75, 77, 81, 82, 83, 84, 86, 87, 88, 89, 91, 92, 93, 94, 96, 97, 98,
  99
];

var aplicarFiltro = false;

searchButton.onclick = async function() {
  cidadesElement.innerHTML = '';
  try {
    var dddValido = false;
  
    for (const ddd of dddList) {
      if (conteudo.value == ddd) {
        dddValido = true;
        aplicarFiltro = true;
        break;
      }
    }
  
    if (!dddValido) {
      aplicarFiltro = false;
      throw new Error("ddd não encontrado");
    }
  } catch (error) {
    mensagemDeErroAPI.style.display = "flex";
    return;
  }
  
  
  try {
    if (conteudo.value == '') {
      aplicarFiltro = false;
      throw new Error("Nenhum DDD selecionado");
    }
    
    var resp = await fetch(urlAPI+conteudo.value);
    cidadesElement.innerHTML = '';
    
    if (!resp.ok) {
      throw new Error("DDD não encontrado");
    }
    
    if (!resp.status === 200) {
      aplicarFiltro = false;
      throw new Error("");
    }

    cidades = await resp.json();
    displayCities(cidades, filter.value)

  } catch (error) {
    mensagemDeErroAPI.style.display = "flex";
    return;
  }

}

filterElement.addEventListener('input', (event) => {
  if (aplicarFiltro) {
    displayCities(cidades, event.target.value)
  }
});


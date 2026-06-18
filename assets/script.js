document.getElementById("searchBtn").addEventListener("click", async () => {

const city = document.getElementById("city").value;

if (!city) {
alert("Please enter a city");
return;
}

try {
const weather = await getWeather(city);
const outfit = await getOutfitSuggestion(weather);

document.getElementById("results").innerHTML = `
<h2>Outfit Recommendation</h2>
<p>${outfit.replace(/\n/g, "<br>")}</p>
`;

} catch (error) {
document.getElementById("results").innerHTML =
`<p>Error: ${error.message}</p>`;
}

});
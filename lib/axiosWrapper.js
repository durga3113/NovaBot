const axios = require("axios");

function ax(method, url, data) {
	return axios({ method, url, data })
		.then(response => response.data)
		.catch(error => console.error(error));
}

module.exports = { ax };

//HOW TO USE IT 🐊

/*const getData = async () => {
	const data = await ax("GET", "(link unavailable)");
	console.log(data);
};*/

async function getJobs() {
	const response = await fetch("http://localhost:3000/jobs");
	console.log(await response.json());
}

getJobs();

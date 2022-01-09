class App {
	jobs = [];

	list = document.querySelector(".jobs");

	constructor() {
		this.displayJobs();
	}

	generateItemTemplate(item) {
		let tagsTemplate = "";
		[item.role, item.level, ...item.languages, ...item.tools].forEach((el) => {
			tagsTemplate += `<li class="jobs__tags-item">${el}</li>`;
		});
		const html = `
		<div class="jobs__item ${item.featured && `jobs__item--featured`}">
			<div class="jobs__company-img">
				<img src="/dist${item.logo}" alt="" />
			</div>
			<div class="jobs__info">
				<div class="jobs__info__head">
					<span class="jobs__info__company">${item.company}</span>
					${item.new ? `<span class="jobs__info__tag jobs__info__tag--new">NEW!</span>` : ""}
					${item.new ? `<span class="jobs__info__tag jobs__info__tag--featured">FEATURED</span>` : ""}
				</div>
				<h2 class="jobs__info__title">${item.position}</h2>
				<div class="jobs__footer">
					<span class="jobs__footer__tag">${item.postedAt}</span>
					<span class="jobs__footer__tag">${item.contract}</span>
					<span class="jobs__footer__tag">${item.location}</span>
				</div>
			</div>
			<ul class="jobs__tags">
			${tagsTemplate}
			</ul>
		</div>`;
		return html;
	}

	async getJobs() {
		const response = await fetch("http://localhost:3000/jobs");
		return response.json();
	}

	async displayJobs() {
		try {
			const data = await this.getJobs();
			data.forEach((element) => {
				const html = this.generateItemTemplate(element);
				this.list.insertAdjacentHTML("beforeend", html);
			});
		} catch (err) {
			console.error(err);
		}
	}
}

/* eslint-disable */
const app = new App();
/* eslint-disable */

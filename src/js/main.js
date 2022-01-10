class App {
	jobs = [];
	displayedJobs = [];
	list = document.querySelector(".jobs");
	appliedFilters = [];
	filtersList = document.querySelector(".filters__list");
	filtersBox = document.querySelector(".filters");

	constructor() {
		this.getJobs();
		document
			.querySelector(".filters__clear")
			.addEventListener("click", () => this.removeFilter());
	}

	generateItemTemplate(item) {
		let tagsTemplate = "";
		item.tags.forEach((el) => {
			tagsTemplate += `<li class="jobs__tags-item" data-filter="${el}">${el}</li>`;
		});
		const html = `
		<div class="jobs__item ${item.featured && `jobs__item--featured`}">
			<div class="jobs__company-img">
				<img src="/dist${item.logo}" alt="company logo" />
			</div>
			<div class="jobs__info">
				<div class="jobs__info__head">
					<span class="jobs__info__company">${item.company}</span>
${
	item.new
		? `<span class="jobs__info__tag jobs__info__tag--new">NEW!</span>`
		: ""
}
${
	item.new
		? `<span class="jobs__info__tag jobs__info__tag--featured">FEATURED</span>`
		: ""
}
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
		try {
			const response = await fetch("http://localhost:3000/jobs");
			if (!response.ok) throw new Error("Something went wrong");

			let data = await response.json();
			data = data.map((el) => ({
				...el,
				tags: [el.role, el.level, ...el.languages, ...el.tools],
			}));

			this.jobs = data;
			this.displayedJobs = this.jobs;
			this.displayJobs(data);
		} catch (err) {
			console.error(err);
		}
	}

	filterHelper(job) {
		return this.appliedFilters.every((f) => job.tags.includes(f));
	}

	filterJobs() {
		this.displayedJobs = this.jobs.filter((job) => this.filterHelper(job));
		this.displayJobs();
	}

	async displayJobs() {
		this.list.innerHTML = "";
		try {
			this.displayedJobs.forEach((element) => {
				const html = this.generateItemTemplate(element);
				this.list.insertAdjacentHTML("beforeend", html);
			});
			document.querySelectorAll(".jobs__tags-item").forEach((el) => {
				el.addEventListener("click", (e) => this.applyFilter(e.target));
			});
		} catch (err) {
			console.error(err);
		}
	}

	applyFilter(tag) {
		const { filter } = tag.dataset;
		if (this.appliedFilters.find((fil) => fil === filter)) return;
		if (this.appliedFilters.length === 0) {
			this.displayFiltersBox(true);
		}
		this.appliedFilters.push(filter);
		this.updateFilters();
	}

	removeFilter(filter) {
		if (!filter) {
			this.appliedFilters = [];
		} else {
			this.appliedFilters = this.appliedFilters.filter((f) => f !== filter);
		}
		if (this.appliedFilters.length === 0) this.displayFiltersBox(false);
		this.updateFilters();
	}

	updateFilters() {
		this.filtersList.innerHTML = "";
		this.appliedFilters.forEach((item) => {
			const html = `
			<li class="filters__item" data-filter="${item}">
			<span>${item}</span>
			<span class="filters__close">&#x2715;</span>
		</li>`;
			this.filtersList.insertAdjacentHTML("beforeend", html);
		});

		this.filtersList.addEventListener("click", (e) => {
			this.removeFilter(e.target.closest(".filters__item").dataset.filter);
		});
		this.filterJobs();
	}

	displayFiltersBox(show = false) {
		if (!show) this.filtersBox.classList.add("filters--hidden");
		else {
			this.filtersBox.classList.remove("filters--hidden");
			this.filtersBox = document.querySelector(".filters");
		}
	}
}

/* eslint-disable */
const app = new App();
/* eslint-disable */

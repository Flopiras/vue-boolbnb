<script>
import { loader } from '../stores/_loader';
import { axiosInstance } from '../assets/axios'
import ApartmentCard from '../components/ApartmentCard.vue';
import AppMap from '../components/AppMap.vue'
import AddressInput from '../components/AddressInput.vue';
import SectionRegistration from '../components/SectionRegistration.vue';

const apartmentEndpoint = '/api/apartments/';

const GEOCODE_ENDPOINT = "https://api.tomtom.com/search/2/geocode";
const TOM_TOM_KEY = import.meta.env.VITE_TOM_TOM_KEY;
const params = { key: TOM_TOM_KEY, language: "it-IT", countrySet: "IT", limit: 15 };


export default {
	name: 'HomePage',

	data() {
		return {
			nonSponsoredApartments: [],
			sponsoredApartments: [],
			apartments: [],
			address: '',
			lat: '',
			lon: '',
			loader,
		};
	},
	components: { ApartmentCard, AppMap, AddressInput, SectionRegistration },

	methods: {
		async searchAddress() {
			const address = this.address;
			if (address === '') return;

			this.loader.setLoader();
			const position = await AddressInput.methods.getCoordinates(this.address);
			this.loader.unsetLoader();
			const { lat, lon } = position;
			const query = { address, lat, lon }

			this.$router.push({ name: 'advanced-search', query })
		},

	},

	created() {
		loader.setLoader();
		axiosInstance.get(apartmentEndpoint)
			.then(res => {
				const apartments = res.data;
				this.apartments = apartments;
				this.nonSponsoredApartments = apartments.filter(apartment => !apartment.sponsored);
				this.sponsoredApartments = apartments.filter(apartment => apartment.sponsored !== null)
			})
			.then(() => {
				loader.unsetLoader();
			})

	}
};
</script>

<template>
	<div class="jumbotron p-5 my-4 main-bg-color rounded-3">
		<div class="container py-5">
			<div class="mb-4">

				<form @submit.prevent="searchAddress"
					class="d-flex gap-3 flex-wrap flex-lg-nowrap align-items-center justify-content-center">
					<AddressInput label="Per iniziare cerca un indirizzo" v-model:address="address" />
					<button class="btn btn-success">Cerca</button>
				</form>

				<h1 class="display-5 fw-bold text-center pt-4 second-color">
					BoolBnB
				</h1>

				<h6 class="text-center pb-4 main-color">IL TUO APPARTAMENTO TI ASPETTA</h6>
			</div>
			<div class="mt-4">
				<p class="text-center fs-3 main-color">
					Cerca l'Appartamento giusto per te filtrando i risultati di ricerca per numero di bagni,
					la presenza di piscina, sauna, portineria e tanti altri servizi. <br>
					Puoi inoltre decidere quanti ambienti preferisci avere per il tuo Appartamento; ad esempio, bilocali,
					trilocali, quadrilocali.

				</p>
			</div>
		</div>
	</div>
	<div class="container mx-auto p-0 pb-5">

		<h4 class="pt-4 main-color fw-bolder">Appartamenti in evidenza: </h4>


		<!-- CARDS: -->

		<!-- <AppMap v-if="apartments.length > 0" :apartments="apartments" /> -->

		<div class="d-flex justify-content-center rounded-1 pt-4 pb-5 p-0 m-0">
			<div class="cards_deck row justify-content-center  justify-content-xl-start gap-5 mt-5 m-0 p-0">
				<div class="card_container p-0" v-for="apartment in sponsoredApartments" :key="apartment.id">
					<ApartmentCard :homepage="true" :apartment="apartment" />
				</div>
			</div>
		</div>

		<!-- registration section -->
		<SectionRegistration />

	</div>
</template>

<style lang="scss" scoped>
@use '../assets/Scss/style.scss' as *;

.jumbotron {
	-webkit-box-shadow: 0px 0px 9px 17px #f0fff1;
	box-shadow: 0px 0px 9px 17px #f0fff1;
}

.cards_deck {
	max-width: 1236px;
}

.cards_deck .card_container {
	max-width: 380px;
}

.cards_deck .card_container .card {
	box-shadow: 0px 0px 25px 5px #bbbbbb;
}

.cards_deck img {
	border-radius: 5px;
}

.card img {
	object-fit: fill;
	height: 200px;
}
</style>

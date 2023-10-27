<script>
import axios from "axios";
import { RouterLink } from "vue-router";

const baseURL = import.meta.env.VITE_BACKEND_URL

const SEARCH_ENDPOINT = "https://api.tomtom.com/search/2/search";
const GEOCODE_ENDPOINT = "https://api.tomtom.com/search/2/geocode";
const TOM_TOM_KEY = import.meta.env.VITE_TOM_TOM_KEY;

const params = { key: TOM_TOM_KEY, language: "it-IT", countrySet: "IT", limit: 15 };

const emptyForm = {
	// TO CHANGE
	user_id: 1,
	name: "",
	description: "",
	thumbnail: "",
	address: "",
	lat: "",
	lon: "",
	rooms: "",
	bedrooms: "",
	bathrooms: "",
	square_meters: "",
	visible: false,
};

export default {
	name: "ApartmentForm",
	props: {
		apartment: {
			type: Object,
			default: emptyForm,
		},
		errors: {
			type: Object
		},
	},
	data() {
		return {
			form: { ...this.apartment },
			addressTimeout: null,
			suggestedAddresses: [],
			fetchingCoordinates: false,
			thumbnail: null,
		};
	},
	computed: {
		isFetchingCoordinates() {
			return this.fetchingCoordinates;
		},

		isBackValid() {
			return window.history.state.back
		},
	},

	emits: ["form-submit", 'update:errors'],

	methods: {

		loadPicture(event) {
			this.thumbnail = event.target.files[0];
		},


		/**
		 * After every keypress, if half a second after last keypress has passed, search for similar addresses and provide autocompletion.
		 */
		handleAddressInput() {
			const timeoutDuration = 500;
			// deletes previous timeout
			clearTimeout(this.addressTimeout);
			// sets a new timeout
			this.addressTimeout = setTimeout(() => {
				// if address is empty, skip
				if (!this.form.address)
					return;
				axios
					.get(`${SEARCH_ENDPOINT}/${this.form.address}.json`, { params })
					.then((res) => {
						this.suggestedAddresses = [];
						const addresses = res.data.results;
						addresses.forEach((address) => {
							this.suggestedAddresses.push(address.address.freeformAddress);
						});
					});
			}, timeoutDuration);
		},

		/**
		 * 
		 */
		async handleAddressEnterKeypress() {
			await this.getCoordinates();
			if (!this.errors.address)
				this.handleFormSubmit();
		},

		/**
		 * Get Coordinates using TomTom's api.
		 */
		async getCoordinates() {
			// reset lat and lon
			this.form.lat = this.form.lon = '';

			// if address is empty, skip			
			if (!this.form.address)
				return;

			try {
				this.fetchingCoordinates = true;
				const res = await axios.get(`${GEOCODE_ENDPOINT}/${this.form.address}.json`, { params });
				// reset address errors
				this.errors.address = ''
				this.$emit('update:errors', { ...this.errors })

				// if there are no results for the given address add an address error
				if (res.data.results.length === 0 || res.data.results[0].score < 10) {
					this.$emit('update:errors', { ...this.errors, address: 'Indirizzo non valido.' });
					return;
				}

				// update lat and lon
				const { position } = res.data.results[0];
				this.form.lat = position.lat;
				this.form.lon = position.lon;
			} catch (err) {
				console.error(err);
			} finally {
				this.fetchingCoordinates = false;
				return
			}
		},
		/**
		 * Handles the form submission
		 */
		handleFormSubmit() {

			// don't send form if address is invalid
			if (this.errors.address === 'Indirizzo non valido.') return;

			// don't submit the form if there are no lat and lon
			if (!this.form.lat || !this.form.lon) {
				this.$emit('update:errors', { ...this.errors, address: 'Indirizzo non valido.' });
				return
			}

			// if the form submit occours during tomtom's coordinates call wait 100ms and try to resubmit the form.
			if (this.fetchingCoordinates) {
				setTimeout(() => {
					this.handleFormSubmit()
				}, 100)
			} else {

				// build the formdata to allow the thumbnail upload
				const formData = new FormData();

				if (this.thumbnail)
					formData.append('thumbnail', this.thumbnail);

				for (let key in this.form) {
					if (this.form[key])
						formData.append(key, this.form[key])
				}

				// finally emit the form submit, to let the parent handle the call.
				this.$emit("form-submit", formData);
			}
		},
	},
}
</script>

<template>
	<div class="container mt-5">
		<form @submit.prevent="handleFormSubmit" class="row g-3">


			<!-- Name -->
			<div class="col-lg-6 col-sm-12">
				<label for="name" class="form-label">Titolo</label>
				<input type="text" :class="[{ 'is-invalid': errors.name }, 'form-control']" id="name" name="name"
					v-model.trim="form.name" autofocus>
				<div :class="[{ 'd-block': errors.name }, 'invalid-feedback']">
					{{ errors.name }}
				</div>
			</div>

			<!-- Slug -->
			<!-- <div class="col-6">
				<label for="slug" class="form-label">Slug</label>
				<input type="text" class="form-control" id="slug" disabled :value="form.slug">
			</div> -->

			<!-- Address -->
			<div class="col-lg-6 col-sm-12">
				<label for="address" class="form-label">Indirizzo</label>
				<input @keyup="handleAddressInput" @keydown.enter.prevent="handleAddressEnterKeypress"
					@focusout="getCoordinates" type="text" v-model.trim="form.address" list="addresses"
					:class="[{ 'is-invalid': errors.address }, 'form-control']" id="address" />
				<div :class="[{ 'd-block': errors.address }, 'invalid-feedback']">
					{{ errors.address }}
				</div>
				<!-- address datalist -->
				<datalist id="addresses">
					<option v-for=" address, i  in  suggestedAddresses " :key="i" :value="address"></option>
				</datalist>
			</div>

			<!-- Description -->
			<div class="col-12">
				<label for="description" class="form-label">Descrizione</label>
				<textarea :class="[{ 'is-invalid': errors.description }, 'form-control']" id="description"
					name="description" rows="7" v-model.trim="form.description"></textarea>
				<div :class="[{ 'd-block': errors.description }, 'invalid-feedback']">
					{{ errors.description }}
				</div>
			</div>

			<!-- Thumbnail -->
			<div class="col-12">
				<label for="thumbnail">Immagine</label>
				<input type="file" name="thumbnail" id="thumbnail" @input="loadPicture"
					:class="[{ 'is-invalid': errors.image }, 'form-control']">
				<div :class="[{ 'd-block': errors.image }, 'invalid-feedback']">
					{{ errors.image }}
				</div>
			</div>

			<!-- Bedrooms -->
			<div class="col-lg-3 col-sm-6">
				<label for="bedrooms" class="form-label">Stanze da letto</label>
				<input type="number" name="bedrooms" id="bedrooms"
					:class="[{ 'is-invalid': errors.bedrooms }, 'form-control']" v-model.trim="form.bedrooms">
				<div :class="[{ 'd-block': errors.bedrooms }, 'invalid-feedback']">
					{{ errors.bedrooms }}
				</div>
			</div>

			<!-- Rooms -->
			<div class="col-lg-3 col-sm-6">
				<label for="rooms" class="form-label">Stanze</label>
				<input type="number" name="rooms" id="rooms" :class="[{ 'is-invalid': errors.rooms }, 'form-control']"
					v-model.trim="form.rooms">
				<div :class="[{ 'd-block': errors.rooms }, 'invalid-feedback']">
					{{ errors.rooms }}
				</div>
			</div>

			<!-- Bathrooms -->
			<div class="col-lg-3 col-sm-6">
				<label for="bathrooms" class="form-label">Bagni</label>
				<input type="number" name="bathrooms" id="bathrooms"
					:class="[{ 'is-invalid': errors.bathrooms }, 'form-control']" v-model.trim="form.bathrooms">
				<div :class="[{ 'd-block': errors.bathrooms }, 'invalid-feedback']">
					{{ errors.bathrooms }}
				</div>
			</div>

			<!-- Square_meters -->
			<div class="col-lg-3 col-sm-6">
				<label for="square_meters" class="form-label">Metri quadrati</label>
				<input type="number" name="square_meters" id="square_meters"
					:class="[{ 'is-invalid': errors.square_meters }, 'form-control']" v-model.trim="form.square_meters">
				<div :class="[{ 'd-block': errors.square_meters }, 'invalid-feedback']">
					{{ errors.square_meters }}
				</div>
			</div>

			<!-- Visible -->
			<div class="col-12">
				<div class="form-check form-switch">
					<label v-if="!form.visible" class="form-check-label" for="visible">Rendi visibile</label>
					<label v-else class="form-check-label" for="visible">Rendi
						invisibile</label>
					<input class="form-check-input" type="checkbox" id="visible" name="visible" v-model.trim="form.visible">
				</div>
				<div v-if="!apartment.slug" class="col-12 mt-4 text-sm-center text-md-start">
					<button type="submit" class="btn btn-primary">Crea
						appartamento</button>
					<button v-if="isBackValid" type="button" class="btn btn-secondary mx-2" @click="$router.back">Torna
						indietro</button>
					<RouterLink v-else :to="{ name: 'home' }" class="btn btn-secondary mx-2">Torna indietro</RouterLink>
				</div>
				<div v-else class="col-12 mt-4 text-sm-center text-md-start">
					<button type="submit" class="btn btn-warning">Modifica
						appartamento</button>
					<button v-if="isBackValid" type="button" class="btn btn-secondary mx-2" @click="$router.back">Torna
						indietro</button>
					<RouterLink v-else :to="{ name: 'home' }" class="btn btn-secondary mx-2">Torna indietro</RouterLink>
				</div>
			</div>
		</form>
	</div>
</template>

<style></style>

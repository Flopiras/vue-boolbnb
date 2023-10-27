<script>
import { axiosInstance } from '../assets/axios';
import ApartmentForm from '../components/ApartmentForm.vue';
import { loader } from '../stores/_loader';

const endpoint = '/api/apartments'

export default {
	name: 'CreateApartmentPage',
	data() {
		return {
			errors: {}
		}
	},
	components: { ApartmentForm },
	methods: {
		createApartment(apartment) {

			loader.setLoader();
			const headers = { headers: { 'Content-Type': 'multipart/form-data' } };

			axiosInstance.post(endpoint, apartment, headers)
				.then(res => {
					//redirect to the apartmaint details page
					const { slug } = res.data;
					this.$router.push({ name: 'apartment-detail', params: { slug } })
				})
				.catch(err => {
					const { errors } = err.response.data
					const errorMessage = {}
					for (let field in errors) errorMessage[field] = errors[field][0];
					this.errors = errorMessage
				}).then(() => {
					loader.unsetLoader();
				})
		},
	},
};
</script>

<template>
	<ApartmentForm @form-submit="createApartment" v-model:errors=errors />
</template>

<style scoped></style>

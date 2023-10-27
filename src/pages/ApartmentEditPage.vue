<script>
import axios from 'axios';
import { axiosInstance } from '../assets/axios';
import ApartmentForm from '../components/ApartmentForm.vue';
import { loader } from '../stores/_loader';
export default {
    name: 'CreateApartmentPage',
    data() {
        return {
            loader,
            errors: {},
            apartment: {}
        }
    },
    components: { ApartmentForm },
    methods: {
        updateApartment(apartment) {

            loader.setLoader();

            const headers = { headers: { 'Content-Type': 'multipart/form-data' } };

            apartment.append('_method', 'PUT');

            axiosInstance.post(`/api/apartments/${this.apartment.id}`, apartment, headers)
                .then(res => {
                    const { slug } = res.data;
                    this.$router.push({ name: 'apartment-detail', params: { slug } })
                })
                .catch(err => {
                    const { errors } = err.response.data
                    const errorMessage = {}
                    for (let field in errors) errorMessage[field] = errors[field][0];
                    this.errors = errorMessage
                })
                .then(() => {
                    loader.unsetLoader();
                });
        },
    },
    created() {
        loader.setLoader();
        axiosInstance.get(`api/apartments/${this.$route.params.slug}`)
            .then(res => this.apartment = res.data)
            .catch(err => { })
            .then(() => {
                loader.unsetLoader();
            })
    }
};
</script>

<template>
    <ApartmentForm @form-submit="updateApartment" v-model:errors=errors :apartment=apartment v-if="!loader.isLoading" />
</template>

<style scoped></style>

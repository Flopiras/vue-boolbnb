<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { axiosInstance } from '../assets/axios';
import ApartmentCard from '../components/ApartmentCard.vue';
import AppMap from '../components/AppMap.vue';
import AddressInput from '../components/AddressInput.vue'

const form = {
    address: '',
    distance: '20',
    selectedServices: [],
    lat: '',
    lon: '',
    rooms: 1,
    bedrooms: 1
}

export default {
    name: 'AdvancedSearch',
    components: { ApartmentCard, AppMap, FontAwesomeIcon, AddressInput },
    data() {
        return {
            form: { ...form },
            services: [],
            apartments: [],
            sponsoredApartments: [],
            nonSponsoredApartments: [],
            errors: {}
        }
    },
    methods: {
        async handleFormSubmission() {
            const position = await AddressInput.methods.getCoordinates(this.form.address);

            this.form.lat = position.lat;
            this.form.lon = position.lon;
            const query = {};
            for (let field in this.form) {
                query[field] = this.form[field]
            }
            this.$router.push({ query })
            this.fetchApartments();
        },

        fetchApartments() {
            const params = { ...this.form }
            this.apartments = []
            axiosInstance.get('api/apartments', { params }).then(res => {
                this.apartments = [...res.data];
                const sponsored = this.apartments.filter(apt => apt.sponsored);
                const nonSponsored = this.apartments.filter(apt => !apt.sponsored);

                this.sponsoredApartments = [...sponsored];
                this.nonSponsoredApartments = [...nonSponsored];
            });
        },

        emptyForm() {
            this.form = { ...form }
            this.$router.replace('/advanced-search')
        }
    },
    mounted() {
        axiosInstance.get('api/services').then(res => { this.services = res.data })

        const query = this.$route.query;

        for (const param in query) {
            this.form[param] = query[param];
        }
        this.fetchApartments();
    }
}
</script>

<template>
    <div class="container my-5">
        <div class="row">
            <!-- FORM -->
            <form @submit.prevent="handleFormSubmission" class="col-12 mb-4">
                <div class="mb-3 row">
                    <div class="col-12 col-md-9">
                        <AddressInput label="Località" v-model:address="form.address" />
                    </div>
                    <div class="col-12 col-md-3">
                        <label for="distance">Distanza massima in km</label>
                        <input type="number" id="distance" class="form-control" v-model="form.distance" />
                    </div>
                </div>
                <!-- ROOMS AND BEDROOMS -->
                <div class="d-flex mb-3 gap-3">
                    <div>
                        <label for="rooms">Stanze</label>
                        <input type="number" id="rooms" class="form-control" v-model="form.rooms" />
                    </div>
                    <div>
                        <label for="bedrooms">Camere da letto</label>
                        <input type="number" id="bedrooms" class="form-control" v-model="form.bedrooms" />
                    </div>
                </div>
                <!-- SERVICES -->
                <div>
                    <ul v-if="services.length > 0" class="list-unstyled d-flex flex-wrap">
                        <li v-for="service, i in services" :key="service.id" class="me-3">
                            <label :for="`service-${service.id}`">
                                <FontAwesomeIcon :icon="['fas', service.icon]" />
                                {{ service.name }}
                            </label>
                            <input :id="`service-${service.id}`" type="checkbox" class="ms-2" :value="service.id"
                                v-model="form.selectedServices" />
                        </li>
                    </ul>

                </div>
                <div>
                    <button class="btn btn-primary">Cerca</button>
                    <button type="button" class="btn btn-secondary ms-2" @click="emptyForm">Svuota</button>
                </div>
            </form>

            <!-- MAP -->
            <div class="col-12">
                <AppMap :width="1080" :apartments="apartments" :coordinates="{ lat: form.lat, lon: form.lon }"
                    :radius="form.distance" />
            </div>

        </div>

        <hr class="my-5">

        <!-- LIST -->
        <div v-if="apartments.length > 0" class="d-flex justify-content-center rounded-1 pt-4 pb-5 p-0 m-0">

            <div class="cards_deck row justify-content-center justify-content-xl-start gap-5 m-0 p-0">
                <div class="card_container p-0" v-for="apartment in sponsoredApartments" :key="apartment.id">
                    <ApartmentCard :apartment="apartment" />
                </div>
                <div class="card_container p-0" v-for="apartment in nonSponsoredApartments" :key="apartment.id">
                    <ApartmentCard :apartment="apartment" />
                </div>
            </div>
        </div>
        <div v-else>
            <div class="text-center text-secondary fw-bold">Nessun appartamento trovato</div>
        </div>
    </div>
</template>

<style scoped>
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

form {
    max-width: 1080px;
    margin: 0 auto;
}
</style>

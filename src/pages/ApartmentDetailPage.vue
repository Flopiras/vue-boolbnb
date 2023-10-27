<script>
import { axiosInstance } from '../assets/axios';
import { loader } from '../stores/_loader';
import ApartmentServiceModal from '../components/ApartmentServiceModal.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AppMap from '../components/AppMap.vue';
import ApartmentMessageForm from '../components/ApartmentMessageForm.vue';

export default {
    name: 'ApartmentDetailPage',
    data() {
        return {
            apartment: {},
            map: null,
            modal: false,
            errors: {},
        }
    },
    components: { ApartmentServiceModal, FontAwesomeIcon, AppMap, ApartmentMessageForm },

    computed: {
        isLoadedApartment() {
            return Object.keys(this.apartment).length > 0;
        },
    },

    methods: {

        // apartment
        getApartment() {
            const endpoint = `api/apartments/${this.$route.params.slug}`;
            loader.setLoader();

            axiosInstance.get(endpoint)
                .then(res => {
                    this.apartment = res.data;
                    this.logVisit();
                })
                .catch(err => {
                    console.error(err);
                })
                .then(() => {
                    loader.unsetLoader()
                })
        },

        /**
         * Logs a new visit to the apartment.
         */
        logVisit() {
            axiosInstance.post('api/visits/log/' + this.apartment.id).catch(err => console.error(err));
        }
    },
    created() {
        this.getApartment();
    }
}
</script>

<template>
    <main v-if="isLoadedApartment">
        <header>
            <div class="container text-center mt-4">
                <h2>{{ apartment.name }}</h2>
                <small class="text-secondary">{{ apartment.address }}</small>
                <hr>
            </div>
        </header>
        <div class="container mt-4">
            <button class="mb-3 btn btn-secondary" @click="$router.back()">Torna indietro</button>
            <div class="row justify-content-between">
                <div class="col-md-1 col-lg-7" v-if="apartment.thumbnail">

                    <!-- image -->
                    <figure>
                        <img :src="`http://localhost:8000/storage/${apartment.thumbnail}`" :alt="`${apartment.name}`"
                            class="rounded img-fluid">
                    </figure>
                </div>
                <!-- map -->
                <div class="col-md-1 col-lg-5">
                    <AppMap v-if="isLoadedApartment" :apartments="[apartment]" :zoom="10"
                        :coordinates="{ lat: apartment.lat, lng: apartment.lon }" />
                </div>
                <div class="col-md-1  col-lg-6">
                    <!-- apartment' info -->
                    <div class="my-5">
                        <h4 class="text-secondary text-uppercase">Informazioni su questo spazio</h4>
                        <p>{{ apartment.address }}</p>
                        <p v-if="apartment.description">{{ apartment.description }}</p>
                        <p v-else> -- </p>
                    </div>
                    <hr>
                    <!-- features -->
                    <h4 class="text-secondary text-uppercase pt-3 pb-2">Cosa troverai</h4>
                    <!-- rooms -->
                    <div class="row row-cols-2">
                        <div class="d-flex align-items-baseline">
                            <span><font-awesome-icon :icon="['fas', 'door-closed']" /> Stanze</span>
                            <h6 class="ps-2 fw-bold" v-if="apartment.rooms">{{ apartment.rooms }}</h6>
                            <span class="ps-4" v-else> -- </span>
                        </div>
                        <!-- bathrooms -->
                        <div class="d-flex align-items-baseline">
                            <span><font-awesome-icon :icon="['fas', 'shower']" /> Bagni</span>
                            <h6 class="ps-2 fw-bold" v-if="apartment.bathrooms">{{ apartment.bathrooms }}</h6>
                            <span class="ps-4" v-else> -- </span>
                        </div>
                        <!-- bedrooms -->
                        <div class="d-flex align-items-baseline">
                            <span><font-awesome-icon :icon="['fas', 'bed']" /> Stanze da letto</span>
                            <h6 class="ps-2 fw-bold" v-if="apartment.bedrooms">{{ apartment.bedrooms }}</h6>
                            <span class="ps-4" v-else> -- </span>
                        </div>
                        <!-- square_meters -->
                        <div class="d-flex align-items-baseline">
                            <span><font-awesome-icon :icon="['fas', 'house']" /> Metri Quadri</span>
                            <h6 class="ps-2 fw-bold" v-if="apartment.square_meters">{{ apartment.square_meters }} m&sup2;
                            </h6>
                            <span class="ps-4" v-else> -- </span>
                        </div>
                        <!-- first service -->
                        <!-- <div class="d-flex align-items-baseline">
                            <FontAwesomeIcon :icon="['fas', apartment.services[0].icon]" />
                            <p class="ms-2">
                                {{ apartment.services[0].name }}
                            </p>
                        </div> -->
                        <!-- second service -->
                        <!-- <div class="d-flex align-items-baseline">
                            <FontAwesomeIcon :icon="['fas', apartment.services[1].icon]" />
                            <p class="ms-2">
                                {{ apartment.services[1].name }}
                            </p>
                        </div> -->
                    </div>


                    <div class="d-flex align-items-baseline">
                        <p><font-awesome-icon :icon="['fas', 'person-swimming']" /> Piscina</p>
                    </div>
                    <ul class="list-unstyled d-flex flex-wrap my-3">
                        <li v-for="service in apartment.services" :key="service.id"
                            class="d-flex justify-content-start align-items-baseline me-3">
                            <FontAwesomeIcon :icon="['fas', service.icon]" />
                            <p class="ms-2">
                                {{ service.name }}
                            </p>
                        </li>
                    </ul>
                    <hr>
                </div>
                <div class="col-md-1 col-lg-4 my-5">
                    <ApartmentMessageForm :apartment="apartment" />
                </div>




            </div>

        </div>

    </main>
</template>
    <!-- <div id="map">
    <img :src="`${map}`" :alt="`${apartment.name}`">
</div> -->


<style scoped lang="scss">
.card {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);
}

.service-button {
    width: 185px;
    padding: 12px;
    font-weight: 600;
}



textarea {
    resize: none;
}

form {
    p {
        font-size: 11px;
        color: gray;
    }
}
</style>

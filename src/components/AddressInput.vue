<script>
import { axiosInstance } from '../assets/axios';

const SEARCH_ENDPOINT = "https://api.tomtom.com/search/2/search";
const GEOCODE_ENDPOINT = "https://api.tomtom.com/search/2/geocode";
const TOM_TOM_KEY = import.meta.env.VITE_TOM_TOM_KEY;

const params = { key: TOM_TOM_KEY, language: "it-IT", countrySet: "IT", limit: 15 };

export default {
    name: 'AddressInput',
    props: {
        label: String,
        address: String,
    },
    data() {
        return {
            suggestedAddresses: [],
            addressTimeout: null,
        }
    },
    emits: ['update:address', 'update:lat', 'update:lon'],
    methods: {
        /**
        * After every keypress, if half a second after last keypress has passed, search for similar addresses and provide autocompletion.
        */
        handleAddressInput(event) {
            const address = event.target.value
            this.$emit('update:address', address)
            const timeoutDuration = 500;
            // deletes previous timeout
            clearTimeout(this.addressTimeout);
            // sets a new timeout
            this.addressTimeout = setTimeout(() => {
                // if address is empty, skip
                if (!address)
                    return;
                axiosInstance
                    .get(`${SEARCH_ENDPOINT}/${address}.json`, { params })
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
 * Get Coordinates using TomTom's api.
 */
        async getCoordinates(address) {
            // reset lat and lon

            // if address is empty, skip			
            if (!address) return { lat: '', lon: '' }

            try {
                const res = await axiosInstance.get(`${GEOCODE_ENDPOINT}/${address}.json`, { params });

                if (res.data.results.length < 1) {
                    return { lat: '', lon: '' }
                }

                // update lat and lon
                const { position } = res.data.results[0];
                return position

            } catch (err) {
                console.error(err);
            }
        },
    }

}
</script>

<template>
    <label for="address" class="flex-shrink-0">{{ label }}</label>
    <input @keyup="handleAddressInput" id="address" class="form-control" :value="address" list="addresses" />
    <datalist id="addresses">
        <option v-for="address in suggestedAddresses">{{ address }}</option>
    </datalist>
</template>

<style scoped></style>
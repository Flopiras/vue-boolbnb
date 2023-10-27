<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import * as turf from '@turf/turf'

const key = import.meta.env.VITE_TOM_TOM_KEY;

const rome = { lat: 41.89193, lng: 12.51133 };
const markers = [];

const props = defineProps({
    apartments: Array,
    circle: Object,
    coordinates: Object,
    radius: {
        default: '20'
    },
    zoom: {
        type: Number,
        default: 4.5
    },
    focus: Array,
    width: {
        type: Number,
        default: 600
    }
})
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const mapRef = ref(null);
let timeout = null;

watch(() => props.coordinates,
    newValue => {
        const { lat, lon } = newValue;
        if (!lat || !lon) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            addCircle(map, [lon, lat], props.radius);
        }, 300);
    })

watch(() => props.apartments,
    newValue => {
        insertLocs(map, newValue)
    })

const calculateProperZoom = (radius) => {
    const slope = -3 / 130;
    const yIntercept = 120 / 13;

    const zoom = slope * radius + yIntercept;
    return zoom > 5 ? zoom : 5;
}

const insertLocs = (map, locations) => {
    const tomtom = window.tt;

    // clear all the previous markers
    markers.forEach(marker => { marker.remove() })

    locations.forEach(location => {

        const marker = new tomtom.Marker().setLngLat(location).addTo(map);
        const popup = new tt.Popup({ anchor: 'top' })
        marker.setPopup(popup)
        markers.push(marker);
    })

}

const addCircle = (map, coordinates, radius) => {

    if (coordinates[0] === '' && coordinates[1] === '')
        coordinates = [rome.lng, rome.lat];

    const center = turf.point(coordinates)
    const options = { steps: 80, units: 'kilometers' }

    const circle = turf.circle(center, radius, options)

    const zoom = calculateProperZoom(radius)

    map.setZoom(zoom);

    map.setCenter(coordinates);

    const layer = map.getLayer('circle-fill');
    if (layer) {
        map.removeLayer('circle-fill')
    }
    const source = map.getSource('circleData');
    if (source) {
        map.removeSource('circleData');
    }

    map.addSource('circleData', {
        type: 'geojson', data: circle
    })

    map.addLayer({
        id: 'circle-fill',
        type: 'fill',
        source: 'circleData',
        paint: {
            "fill-color": "blue",
            "fill-opacity": 0.1,
        },
    })
}

onMounted(() => {
    const tt = window.tt;

    const focus = props.coordinates && props.coordinates.lat ? props.coordinates : rome;

    const map = tt.map({
        key,
        container: mapRef.value,
        center: focus,
        zoom: props.zoom,
    })

    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

    insertLocs(map, props.apartments);

    if (props.circle) {
        setTimeout(() => {
            addCircle(map);
        }, 1000)
    }


    window.map = map;
})

</script>

<template>
    <div class="d-flex justify-content-center">
        <div id="map" ref="mapRef" :style="`width: ${width}px`"></div>
    </div>
</template>

<style scoped>
#map {
    height: 500px;
}
</style>